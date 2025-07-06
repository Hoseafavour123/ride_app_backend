import mongoose, { Schema, Document } from 'mongoose'

export enum DeliveryStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PICKED_UP = 'PICKED_UP',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface DeliveryDocument extends Document {
  userId: mongoose.Types.ObjectId
  driverId?: mongoose.Types.ObjectId
  pickup: {
    address: string
    coordinates: [number, number]
  }
  dropoff: {
    address: string
    coordinates: [number, number]
  }
  packageType: string
  receiverName: string
  receiverPhone: string
  status: DeliveryStatus
  fare?: number
  pickedUpAt?: Date
  deliveredAt?: Date
  createdAt: Date
  updatedAt: Date
}

const deliverySchema = new Schema<DeliveryDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'User' },
    pickup: {
      address: String,
      coordinates: { type: [Number], required: true },
    },
    dropoff: {
      address: String,
      coordinates: { type: [Number], required: true },
    },
    packageType: { type: String, required: true },
    receiverName: { type: String, required: true },
    receiverPhone: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(DeliveryStatus),
      default: DeliveryStatus.PENDING,
    },
    fare: Number,
    pickedUpAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
)

const DeliveryModel = mongoose.model<DeliveryDocument>(
  'Delivery',
  deliverySchema
)
export default DeliveryModel
