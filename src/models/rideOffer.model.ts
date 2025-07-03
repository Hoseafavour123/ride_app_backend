import mongoose, { Document, Schema } from 'mongoose'

export enum RideOfferStatus {
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export interface RideOfferDocument extends Document {
  rideId: mongoose.Types.ObjectId
  driverId: mongoose.Types.ObjectId
  status: RideOfferStatus
  createdAt: Date
}

const rideOfferSchema = new Schema<RideOfferDocument>(
  {
    rideId: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: Object.values(RideOfferStatus),
      default: RideOfferStatus.SENT,
    },
  },
  { timestamps: true }
)

rideOfferSchema.index({ rideId: 1, driverId: 1 }, { unique: true })

const RideOfferModel = mongoose.model<RideOfferDocument>(
  'RideOffer',
  rideOfferSchema
)
export default RideOfferModel
