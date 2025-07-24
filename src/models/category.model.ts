import mongoose, { Schema, Document } from 'mongoose'

export interface CategoryDocument extends Document {
  name: string
  slug?: string
  description?: string
  createdBy?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String },
    description: { type: String },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const CategoryModel = mongoose.model<CategoryDocument>('Category', categorySchema)
export default CategoryModel