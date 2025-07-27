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
  lastStockUpdateBy?: mongoose.Types.ObjectId
  lastStockUpdatedAt?: Date
  lowStock: {
    type: Boolean
    default: false
  }
  lowStockThreshold: {
    type: Number
    default: 3
  }
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
    lastStockUpdateBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastStockUpdatedAt: {
      type: Date,
    },
    lowStock: {
      type: Boolean,
      default: false,
    },
    lowStockThreshold: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true }
)

const ProductModel = mongoose.model<ProductDocument>('Product', productSchema)

export default ProductModel

