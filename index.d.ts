import mongoose from 'mongoose'
import { UserRole } from './src/models/user.model' // adjust path as needed

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: mongoose.Types.ObjectId
        role: UserRole
        sessionId: mongoose.Types.ObjectId
      }
    }
  }
}

export {}
