import mongoose, { Schema, Document } from 'mongoose'

interface OrderedProduct {
  productId: mongoose.Types.ObjectId
  name: string
  imageUrl: string
  price: number
  quantity: number
}

export interface OrderDocument extends Document {
  userId: mongoose.Types.ObjectId
  items: OrderedProduct[]
  totalAmount: number
  shippingAddress: string
  paymentStatus: 'PENDING' | 'PAID'
  orderStatus: 'PLACED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  createdAt: Date
}

const orderSchema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String,
        imageUrl: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID'],
      default: 'PENDING',
    },
    orderStatus: {
      type: String,
      enum: ['PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PLACED',
    },
  },
  { timestamps: true }
)

export default mongoose.model<OrderDocument>('Order', orderSchema)
