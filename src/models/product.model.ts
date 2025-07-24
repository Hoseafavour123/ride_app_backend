import mongoose, { Schema, Document } from 'mongoose'

export interface ProductDocument extends Document {
  name: string
  description?: string
  images?: { url: string; public_id: string }[]
  price: number
  discountPrice?: number
  inStock: number
  category: mongoose.Types.ObjectId
  tags?: string[]
  isAvailable: boolean
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    images: [
      {
        url: { type: String },
        public_id: { type: String },
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    inStock: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

const ProductModel = mongoose.model<ProductDocument>('Product', productSchema)

export default ProductModel
