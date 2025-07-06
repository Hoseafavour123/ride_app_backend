import mongoose, { Schema, Document } from 'mongoose'

export interface ReviewDocument extends Document {
  rideId: mongoose.Types.ObjectId
  reviewerId: mongoose.Types.ObjectId
  revieweeId: mongoose.Types.ObjectId
  reviewerRole: 'PASSENGER' | 'DRIVER'
  rating: number // 1 to 5
  comment?: string
  createdAt: Date
}

const reviewSchema = new Schema<ReviewDocument>(
  {
    rideId: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    revieweeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewerRole: {
      type: String,
      enum: ['PASSENGER', 'DRIVER'],
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
)

reviewSchema.index({ rideId: 1, reviewerId: 1 }, { unique: true })

const ReviewModel = mongoose.model<ReviewDocument>('Review', reviewSchema)

export default ReviewModel