import mongoose from 'mongoose'
import { BAD_REQUEST, NOT_FOUND } from '../constants/http'
import { CreateProductInput } from '../controllers/product.schema'
import CategoryModel from '../models/category.model'
import ProductModel from '../models/product.model'
import appAssert from '../utils/appAssert'
import { uploadImageBuffer } from '../utils/uploadToCloudinary'
import productReviewModel from '../models/productReview.model'
import cloudinary from '../config/cloudinary'

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

  // Aggregate reviews
  const [reviewStats] = await productReviewModel.aggregate([
    { $match: { product: product._id } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ])

  // Fetch recent reviews (optional)
  const recentReviews = await productReviewModel.find({ product: product._id })
    .populate('user', 'name') // show reviewer name
    .sort({ createdAt: -1 })
    .limit(5)

  return {
    ...product.toObject(),
    avgRating: reviewStats?.avgRating || 0,
    reviewCount: reviewStats?.reviewCount || 0,
    recentReviews,
  }
}


export const updateProductService = async (productId: string, updates: any) => {
  const product = await ProductModel.findById(productId)
  appAssert(product, 404, 'Product not found')

  Object.assign(product, updates)
  await product.save()
  return product
}


export const deleteProductService = async (productId: string) => {
  const product = await ProductModel.findById(productId)
  appAssert(product,404, 'Product not found')

  // Delete product images from Cloudinary
  if (product.images && Array.isArray(product.images)) {
    for (const img of product.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id)
      }
    }
  }

  await product.deleteOne()
  return true
}





// ============= INVENTORY MGT ============
export const updateProductStockService = async (
  productId: string,
  { quantity, action }: { quantity: number; action: 'INCREASE' | 'DECREASE' }
) => {
  const product = await ProductModel.findById(productId)
  appAssert(product, NOT_FOUND, 'Product not found')

  if (action === 'DECREASE') {
    appAssert(
      product.inStock >= quantity,
      BAD_REQUEST,
      'Insufficient stock to decrease'
    )
    product.inStock -= quantity
  } else {
    product.inStock += quantity
  }

  // Auto-toggle availability
  product.isAvailable = product.inStock > 0

  return product.save()
}


export const getInventoryOverviewService = async () => {
  const totalProducts = await ProductModel.countDocuments()
  const outOfStock = await ProductModel.countDocuments({ inStock: 0 })
  const lowStock = await ProductModel.countDocuments({ inStock: { $lte: 5, $gt: 0 } })

  const stockByCategory = await ProductModel.aggregate([
    {
      $group: {
        _id: '$category',
        totalStock: { $sum: '$inStock' },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $project: {
        _id: 0,
        category: '$category.name',
        totalStock: 1,
      },
    },
  ])

  const recentProducts = await ProductModel.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select('name inStock category createdAt')

  return {
    totalProducts,
    outOfStock,
    lowStock,
    stockByCategory,
    recentProducts,
  }
}
