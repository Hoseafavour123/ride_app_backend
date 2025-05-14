import { CONFLICT, UNAUTHORIZED } from '../constants/http'
import Audience from '../constants/audience'
import SessionModel from '../models/session.model'
import UserModel, { IUser, UserRole } from '../models/user.model'
import appAssert from '../utils/appAssert'
import { hashValue } from '../utils/bcrypt'
import { ONE_DAY_MS, thirtyDaysFromNow } from '../utils/date'
import {
  RefreshTokenPayload,
  AccessTokenPayload,
  defaultRefreshTokenOptions,
  signToken,
  verifyToken,
} from '../utils/jwt'

import { OAuth2Client } from 'google-auth-library'

// ========== TYPES ==========

type CreateAccountParams = {
  fullName: string
  email: string
  password: string
  role: string
  phone?:string
  userAgent?: string
}

type LoginParams = {
  email: string
  password: string
  userAgent?: string
}

type GoogleLoginParams = {
  idToken: string
  role?: UserRole
  userAgent?: string
}

// ========== LOCAL SIGNUP ==========
export const createAccount = async ({
  fullName,
  email,
  password,
  role,
  userAgent,
}: CreateAccountParams) => {
  const existingUser = await UserModel.exists({ email })
  appAssert(!existingUser, CONFLICT, 'Email already in use')

  const hashedPassword = await hashValue(password)
  const user = await UserModel.create({fullName, email, password: hashedPassword, role })

  return issueTokens(user, userAgent)
}

// ========== LOCAL LOGIN ==========
export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginParams) => {
  const user = await UserModel.findOne({ email })
  appAssert(user, UNAUTHORIZED, 'Invalid email or password')

  const isValid = await user.comparePassword(password)
  appAssert(isValid, UNAUTHORIZED, 'Invalid email or password')

  return issueTokens(user, userAgent)
}

// ========== GOOGLE SIGN-IN ==========
export const loginWithGoogle = async ({
  idToken,
  role,
  userAgent,
}: GoogleLoginParams) => {
  const client = new OAuth2Client(process.env.JWT_GOOGLE_CLIENT_ID as string)
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.JWT_GOOGLE_CLIENT_ID as string,
  })

  const payload = ticket.getPayload()
  appAssert(payload?.email, UNAUTHORIZED, 'Invalid Google token')

  let user = await UserModel.findOne({ email: payload.email })

  // New user - register with Google
  if (!user) {
    appAssert(role, CONFLICT, 'New users must provide a role')
    user = await UserModel.create({
      email: payload.email,
      fullName: payload.name || 'Unnamed User',
      role,
      password: Math.random().toString(36).slice(-10), // dummy password
    })
  }

  return issueTokens(user, userAgent)
}

// ========== REFRESH TOKEN ==========
export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(
    refreshToken,
    Audience.User,
    {
      secret: defaultRefreshTokenOptions.secret,
    }
  )

  appAssert(payload, UNAUTHORIZED, 'Invalid refresh token')

  const session = await SessionModel.findById(payload.sessionId)
  const now = Date.now()

  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    'Session expired'
  )

  // Rotate refresh token if it's close to expiration
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS

  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow()
    await session.save()
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken(
        {
          sessionId: session._id,
          aud: Audience.User,
        },
        defaultRefreshTokenOptions
      )
    : undefined

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
    role: session.userRole,
    aud: Audience.User,
  })

  return {
    accessToken,
    newRefreshToken,
  }
}

// ========== TOKEN ISSUANCE SHARED ==========
const issueTokens = async (user: IUser, userAgent?: string) => {
  const session = await SessionModel.create({
    userId: user._id,
    userAgent,
    userRole: user.role,
    expiresAt: thirtyDaysFromNow(),
  })

  const refreshPayload: RefreshTokenPayload = {
    sessionId: session._id,
    aud: Audience.User,
  }

  const accessPayload: AccessTokenPayload = {
    userId: user._id,
    sessionId: session._id,
    role: user.role,
    aud: Audience.User,
  }

  const refreshToken = signToken(refreshPayload, defaultRefreshTokenOptions)
  const accessToken = signToken(accessPayload)

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  }
}