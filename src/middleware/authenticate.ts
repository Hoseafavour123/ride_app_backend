import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import Audience from '../constants/audience'

export const authenticate = (audience: Audience) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Unauthorized: No token' })
    }

    const token = authHeader.split(' ')[1]

    const { payload, error } = verifyToken(token, audience)

    if (error || !payload) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Invalid or expired token' })
    }

    req.user = {
      id: (payload as any).userId,
      role: (payload as any).role,
      sessionId: (payload as any).sessionId,
    }

    next()
  }
}
