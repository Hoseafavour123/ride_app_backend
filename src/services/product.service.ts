import mongoose from 'mongoose'
import { BAD_REQUEST } from '../constants/http'
import { CreateProductInput } from '../controllers/product.schema'
import CategoryModel from '../models/category.model'
import ProductModel from '../models/product.model'
import appAssert from '../utils/appAssert'
import { uploadImageBuffer } from '../utils/uploadToCloudinary'

export const createProduct = async (
  input: CreateProductInput,
  files: Express.Multer.File[]
) => {
  const category = await CategoryModel.findById(input.category)
  appAssert(category, BAD_REQUEST, 'Invalid category ID')

  const uploads = await Promise.all(
    files.map((file) => uploadImageBuffer(file.buffer))
  )

  const images = uploads.map(({ secure_url, public_id }) => ({
    url: secure_url,
    public_id,
  }))

  const product = await ProductModel.create({ ...input, images })

  return product
}



export const getAllProducts = async () => {
  return ProductModel.find().populate('category')
}


export const searchProducts = async (query: any) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    available,
    sortBy = 'createdAt',
    order = 'desc',
    page = 1,
    limit = 10,
  } = query

  const filter: any = {}

  // Text search
  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ]
  }

  // Category filter
  if (category) {
    // Check if it's a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category
    } else {
      const foundCategory = await CategoryModel.findOne({
        name: category.trim(),
      })
      if (foundCategory) {
        filter.category = foundCategory._id
      } else {
        filter.category = null
      }
    }
  }


  // Price range
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = parseFloat(minPrice)
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
  }

  // Availability
  if (available !== undefined) {
    filter.isAvailable = available === 'true'
  }

  const skip = (parseInt(page) - 1) * parseInt(limit)
  const sortOption: Record<string, 1 | -1> = { [String(sortBy)]: order === 'desc' ? -1 : 1 }

  const [products, total] = await Promise.all([
    ProductModel.find(filter)
      .populate('category')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit)),
    ProductModel.countDocuments(filter),
  ])

  return {
    data: products,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
  }
}

export const getProductById = async (productId: string) => {
  const product = await ProductModel.findById(productId).populate('category')
  appAssert(product, 404, 'Product not found')
  return product
}