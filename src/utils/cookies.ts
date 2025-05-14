import { CookieOptions, Response } from 'express'
import { fifteenMinutesFromNow, thirtyDaysFromNow } from './date'

export const REFRESH_PATH = '/auth/refresh'

const defaults: CookieOptions = {
  sameSite: 'strict',
  httpOnly: true,
  secure: true,
}

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenMinutesFromNow(),
})

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  path: REFRESH_PATH,
})

type TokenParams = {
  res: Response
  accessToken: string
  refreshToken: string
  useCookies?: boolean
}

export const setAuthTokens = ({
  res,
  accessToken,
  refreshToken,
  useCookies = false,
}: TokenParams) => {
  if (useCookies) {
    res
      .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
      .cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions())
  }

  return res.status(200).json({
    status: 'success',
    data: {
      accessToken: useCookies ? undefined : accessToken,
      refreshToken: useCookies ? undefined : refreshToken,
    },
  })
}

export const clearAuthCookies = (res: Response) =>
  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken', { path: REFRESH_PATH })
