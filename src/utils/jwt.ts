import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken'
import Audience from '../constants/audience'
import  { IUser }  from '../models/user.model'
import { SessionDocument } from '../models/session.model'


export type RefreshTokenPayload = {
  sessionId: SessionDocument['_id']
  aud: Audience
}

export type AccessTokenPayload = {
  userId: IUser['_id']
  sessionId: SessionDocument['_id']
  role: IUser['role']
  aud: Audience
}

type SignOptionsWithSecret = SignOptions & { secret: string }

const defaultAccessTokenOptions: SignOptionsWithSecret = {
  expiresIn: '59m',
  secret: process.env.JWT_SECRET as string,
}

export const defaultRefreshTokenOptions: SignOptionsWithSecret = {
  expiresIn: '30d',
  secret: process.env.JWT_REFRESH_SECRET as string,
}

export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsWithSecret
): string => {
  const { secret, ...signOpts } = options ?? defaultAccessTokenOptions

  // Remove 'aud' from payload before signing
  const { aud, ...restPayload } = payload

  return jwt.sign(restPayload, secret, {
    audience: aud,
    ...signOpts,
  })
}

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  expectedAudience: Audience,
  options?: VerifyOptions & { secret?: string }
): { payload?: TPayload; error?: string } => {
  const { secret = process.env.JWT_SECRET as string, ...verifyOpts } = options ?? {}

  try {
    const payload = jwt.verify(token, secret, {
      ...verifyOpts,
      audience: expectedAudience,
    }) as TPayload

    return { payload }
  } catch (error: any) {
    return { error: error.message }
  }
}