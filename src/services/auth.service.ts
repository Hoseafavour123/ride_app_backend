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

import PhoneSessionModel from '../models/phoneSession.model'
import { randomInt } from 'crypto'
import { addMinutes } from 'date-fns'

import { OAuth2Client } from 'google-auth-library'
import axios from 'axios'
import { sendSMS } from '../utils/sendSMS'

// ========== TYPES ==========

type CreateAccountParams = {
  fullName: string
  email: string
  password: string
  role: string
  phone?: string
  birthDate?: Date
  userAgent?: string
}

type LoginParams = {
  emailOrPhone: string
  password: string
  userAgent?: string
}

type GoogleLoginParams = {
  idToken: string
  role?: UserRole
  userAgent?: string
}

// ========== PHONE SIGNUP ==========
export const requestPhoneVerification = async (phone: string) => {
  const code = randomInt(0, 1000000).toString().padStart(6, '0')
  const expiresAt = addMinutes(new Date(), 10)

  await PhoneSessionModel.findOneAndUpdate(
    { phone },
    { phone, code, expiresAt, verified: false },
    { upsert: true, new: true }
  )

  //const message = `🔐 Your verification code is: ${code}`
  console.log(`Your verification code is: ${code}`)


  //await sendSMS(phone, message)

  return { phone, expiresAt, code }
}

export const verifyPhoneCode = async (phone: string, code: string) => {
  const session = await PhoneSessionModel.findOne({ phone })
  appAssert(session, 400, 'Phone not found')
  appAssert(session.code === code, 400, 'Invalid code')
  appAssert(session.expiresAt > new Date(), 400, 'Code expired')

  session.verified = true
  await session.save()

  return { verified: true }
}

export const isPhoneVerified = async (phone: string) => {
  const session = await PhoneSessionModel.findOne({ phone })
  return session?.verified === true
}

// ========== LOCAL SIGNUP ==========
export const createAccount = async ({
  fullName,
  email,
  password,
  phone,
  role,
  birthDate,
  userAgent,
}: CreateAccountParams) => {
  appAssert(phone, 400, 'Phone number is required')
  const verified = await isPhoneVerified(phone)
  appAssert(verified, 401, 'Phone number not verified')
  const existingUser = await UserModel.exists({ email })
  appAssert(!existingUser, CONFLICT, 'Email already in use')

  const user = new UserModel({
    fullName,
    email,
    password,
    role,
    birthDate,
    phone,
  })

  await user.save()

  return issueTokens(user, userAgent)
}


// ========== LOCAL LOGIN ==========
export const loginUser = async ({
  emailOrPhone,
  password,
  userAgent,
}: LoginParams) => {
  
  const user = await UserModel.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  })

  console.log("User response", user)

  appAssert(user, 401, 'Invalid credentials')
  const isValid = await user.comparePassword(password)

  console.log("Is valid", isValid)
  appAssert(isValid, UNAUTHORIZED, 'Invalid credentials')

  return issueTokens(user, userAgent)
}



export const phoneLogin = async(phone: string) => {
  const user = await UserModel.findOne({ phone })


  console.log("User response", user)

  appAssert(user, 401, 'Invalid credentials')

  return issueTokens(user)
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
  appAssert(payload, UNAUTHORIZED, 'Invalid Google token')
  appAssert(payload?.email, UNAUTHORIZED, 'Invalid Google token')

  let user = await UserModel.findOne({ email: payload.email })

  // New user - register with Google
  if (!user) {
    appAssert(role, CONFLICT, 'New users must provide a role')
    user = await UserModel.create({
      email: payload.email,
      fullName: payload.name || 'Unnamed User',
      role,
      password: Math.random().toString(36).slice(-10),
    })
  }

  return issueTokens(user, userAgent)
}

//  ========== FACEBOOK SIGNIN ==============

type FacebookLoginParams = {
  accessToken: string
  role?: UserRole
  userAgent?: string
}

export const loginWithFacebook = async ({
  accessToken,
  role,
  userAgent,
}: FacebookLoginParams) => {
  const fbResponse = await axios.get(
    `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
  )

  const profile = fbResponse.data
  appAssert(profile?.email, 401, 'Facebook account must have a verified email')

  let user = await UserModel.findOne({ email: profile.email })

  if (!user) {
    appAssert(role, 409, 'New users must provide a role')

    user = await UserModel.create({
      email: profile.email,
      fullName: profile.name || 'Facebook User',
      password: Math.random().toString(36).slice(-10),
      role,
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
    aud: user.role == 'passenger' || user.role == 'driver' ? Audience.User : Audience.Admin,
  }

  const refreshToken = signToken(refreshPayload, defaultRefreshTokenOptions)
  const accessToken = signToken(accessPayload)

  console.log(
    `Issuing access token for role ${user.role} with aud ${accessPayload.aud}`
  )


  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  }
}
