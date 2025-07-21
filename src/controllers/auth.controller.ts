import { CREATED, OK, UNAUTHORIZED } from '../constants/http'
import SessionModel from '../models/session.model'
import {
  createAccount,
  loginUser,
  loginWithFacebook,
  loginWithGoogle,
  refreshUserAccessToken,
  requestPhoneVerification,
  verifyPhoneCode
} from '../services/auth.service'
import appAssert from '../utils/appAssert'
import {
  clearAuthCookies,
  setAuthTokens,
} from '../utils/cookies'
import { verifyToken } from '../utils/jwt'
import catchErrors from '../utils/catchErrors'
import { loginSchema, registerSchema, googleAuthSchema, facebookAuthSchema, phoneRequestSchema, phoneVerifySchema } from './auth.schemas'
import Audience from '../constants/audience'


export const requestPhoneCodeHandler = catchErrors(async (req, res) => {
  const { phone } = phoneRequestSchema.parse(req.body)

  const result = await requestPhoneVerification(phone)

  return res.status(200).json({
    status: 'success',
    data: {
      phone: result.phone,
      code: result.code,
      expiresAt: result.expiresAt,
      message: 'Verification code sent',
    },
  })
})

export const verifyPhoneCodeHandler = catchErrors(async (req, res) => {
  const { phone, code } = phoneVerifySchema.parse(req.body)

  const result = await verifyPhoneCode(phone, code)

  return res.status(200).json({
    status: 'success',
    message: 'Phone verified',
    tokens: result.tokens,
  })
})


export const registerHandler = catchErrors(async (req, res) => {
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers['user-agent'],
  })

  const { user, accessToken, refreshToken } = await createAccount(request)
  const useCookies = req.body.useCookies ?? false

  // Set tokens nd respond with user data
  setAuthTokens({ res, accessToken, refreshToken, useCookies })

  return res.status(CREATED).json({
    status: 'success',
    data: {
      user,
    },
  })
})

// Login (Email/Password)
export const loginHandler = catchErrors(async (req, res) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers['user-agent'],
  })

  const { user, accessToken, refreshToken } = await loginUser(request)
  const useCookies = req.body.useCookies ?? false

  setAuthTokens({ res, accessToken, refreshToken, useCookies })

  return res.status(OK).json({
    status: 'success',
    data: {
      user,
    },
  })
})

// Refresh Token
export const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken ?? req.body.refreshToken ?? undefined

  appAssert(refreshToken, UNAUTHORIZED, 'Missing refresh token')

  const { accessToken, newRefreshToken } = await refreshUserAccessToken(
    refreshToken
  )
  const useCookies = req.body.useCookies ?? !!req.cookies.refreshToken

  return setAuthTokens({
    res,
    accessToken,
    refreshToken: newRefreshToken ?? refreshToken,
    useCookies,
  })
})

export const logoutHandler = catchErrors(async (req, res) => {
  const authHeader = req.headers.authorization
  const accessToken =
    req.cookies.accessToken ??
    (authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : undefined)

  if (!accessToken) {
    clearAuthCookies(res)
    return res.status(OK).json({
      status: 'success',
      message: 'No token found. Already logged out.',
    })
  }

  const { payload } = verifyToken(accessToken, Audience.User)

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId)
  }

  clearAuthCookies(res)

  return res.status(OK).json({
    status: 'success',
    message: 'Logout successful',
  })
})

// Google Sign-In
export const googleAuthHandler = catchErrors(async (req, res) => {
  const request = googleAuthSchema.parse({
    ...req.body,
    userAgent: req.headers['user-agent'],
  })

  const { user, accessToken, refreshToken } = await loginWithGoogle(request)
  const useCookies = req.body.useCookies ?? false

  setAuthTokens({ res, accessToken, refreshToken, useCookies })

  return res.status(OK).json({
    status: 'success',
    data: {
      user,
    },
  })
})

// Facebook Sign-In

export const facebookAuthHandler = catchErrors(async (req, res) => {
  const request = facebookAuthSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const { user, accessToken, refreshToken } = await loginWithFacebook(request);
  const useCookies = req.body.useCookies ?? false;

  setAuthTokens({ res, accessToken, refreshToken, useCookies });

  return res.status(OK).json({
    status: 'success',
    data: {
      user,
    },
  })
})
