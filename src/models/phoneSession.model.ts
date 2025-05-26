
import mongoose from 'mongoose'

const phoneSessionSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('PhoneSession', phoneSessionSchema)