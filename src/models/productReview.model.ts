// models/review.model.ts
import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true },
    comment: String,
  },
  { timestamps: true }
)

export default mongoose.model('productReview', reviewSchema)