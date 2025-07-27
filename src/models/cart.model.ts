
import mongoose, { Schema, Document } from 'mongoose'

export interface CartItem {
  product: mongoose.Types.ObjectId
  quantity: number
  priceAtAdd: number
}

export interface CartDocument extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  items: CartItem[]
}

const cartSchema = new Schema<CartDocument>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        priceAtAdd: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model<CartDocument>('Cart', cartSchema)