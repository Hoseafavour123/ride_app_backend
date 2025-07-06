import mongoose, { Schema, Document } from 'mongoose'

export enum ClipStatus {
  NEW = 'NEW',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  FAILED = 'FAILED'
}

export interface DashcamClipDocument extends Document {
  driverId: mongoose.Types.ObjectId
  rideId?: mongoose.Types.ObjectId
  deliveryId?: mongoose.Types.ObjectId
  note?: string
  cloudinaryPublicId?: string
  status: ClipStatus
  uploadedAt?: Date
  completedAt?: Date
}

const dashcamClipSchema = new Schema<DashcamClipDocument>(
  {
    driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rideId: { type: Schema.Types.ObjectId, ref: 'Ride' },
    deliveryId: { type: Schema.Types.ObjectId, ref: 'Delivery' },
    note: String,
    cloudinaryPublicId: String,
    status: {
      type: String,
      enum: Object.values(ClipStatus),
      default: ClipStatus.NEW,
    },
    uploadedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
)

const DashcamClipModel = mongoose.model('DashcamClip', dashcamClipSchema)
export default DashcamClipModel