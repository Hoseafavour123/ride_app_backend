import mongoose, { Document, Schema } from 'mongoose'

export enum RideStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface RideDocument extends Document {
  passengerId: mongoose.Types.ObjectId
  driverId?: mongoose.Types.ObjectId
  pickup: {
    address: string
    coordinates: [number, number]
  }
  dropoff: {
    address: string
    coordinates: [number, number]
  }
  fareEstimate: number
  status: RideStatus
  createdAt: Date
  updatedAt: Date
  startedAt?: Date
  completedAt?: Date
 
}

const rideSchema = new Schema<RideDocument>(
  {
    passengerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'User' },

    pickup: {
      address: { type: String, required: true },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere',
      },
    },

    dropoff: {
      address: { type: String, required: true },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    fareEstimate: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(RideStatus),
      default: RideStatus.PENDING,
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
    
  },
  {
    timestamps: true,
  }
)

const RideModel = mongoose.model<RideDocument>('Ride', rideSchema)
export default RideModel