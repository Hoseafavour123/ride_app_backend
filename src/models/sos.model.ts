import mongoose, { Document, Schema } from 'mongoose'

export interface SOSDocument extends Document {
  userId: mongoose.Types.ObjectId
  role: 'PASSENGER' | 'DRIVER'
  location: {
    type: 'Point'
    coordinates: [number, number], // [lng, lat]
    address?: string // Optional field for address
  }
  rideId?: mongoose.Types.ObjectId
  deliveryId?: mongoose.Types.ObjectId
  note?: string
  status: 'TRIGGERED' | 'RESOLVED'
  createdAt: Date
}

const sosSchema = new Schema<SOSDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['PASSENGER', 'DRIVER'], required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: { type: [Number], required: true }, // [lng, lat]
      address: { type: String, required: false }, // Optional address field
    },
    rideId: { type: Schema.Types.ObjectId, ref: 'Ride' },
    deliveryId: { type: Schema.Types.ObjectId, ref: 'Delivery' },
    note: String,
    status: {
      type: String,
      enum: ['TRIGGERED', 'RESOLVED'],
      default: 'TRIGGERED',
    },
  },
  { timestamps: true }
)

sosSchema.index({ location: '2dsphere' })

const SOSModel = mongoose.model<SOSDocument>('SOS', sosSchema)
export default SOSModel
