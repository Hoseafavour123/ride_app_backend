import mongoose, { Document, Schema } from 'mongoose'

export enum Availability {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export interface DriverStatusDocument extends Document {
  driverId: mongoose.Types.ObjectId
  availability: Availability
  location: {
    type: 'Point'
    coordinates: [number, number] // [longitude, latitude]
  }
  updatedAt: Date
}

const driverStatusSchema = new Schema<DriverStatusDocument>(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    availability: {
      type: String,
      enum: Object.values(Availability),
      default: Availability.OFFLINE,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
)

driverStatusSchema.index({ location: '2dsphere' }) // For geospatial queries

const DriverStatusModel = mongoose.model<DriverStatusDocument>(
  'DriverStatus',
  driverStatusSchema
)
export default DriverStatusModel
