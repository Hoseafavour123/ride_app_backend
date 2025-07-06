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
  deliveryId?: mongoose.Types.ObjectId // Optional reference to a delivery if this ride offer is for a delivery
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
    deliveryId: { type: Schema.Types.ObjectId, ref: 'Delivery' }, 
  },
  { timestamps: true }
)

rideOfferSchema.index(
  { rideId: 1, driverId: 1 },
  { unique: true, sparse: true }
)
rideOfferSchema.index(
  { deliveryId: 1, driverId: 1 },
  { unique: true, sparse: true }
)

const RideOfferModel = mongoose.model<RideOfferDocument>(
  'RideOffer',
  rideOfferSchema
)
export default RideOfferModel
