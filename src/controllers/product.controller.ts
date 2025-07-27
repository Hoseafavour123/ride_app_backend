import { Request, Response } from 'express'
import { createProductSchema, updateStockSchema } from './product.schema'
import  catchErrors  from '../utils/catchErrors'
import { createProduct, deleteProductService, getAllProducts, getInventoryOverviewService, getProductById, searchProducts, updateProductService, updateProductStockService } from '../services/product.service'
import { updateProductSchema } from './updateProduct.schema'
import cloudinary from '../config/cloudinary'
import appAssert from '../utils/appAssert'
import ProductModel from '../models/product.model'
import { z } from 'zod'
import { uploadImageBuffer } from '../utils/uploadToCloudinary'

export const createProductHandler = catchErrors(
  async (req: Request, res: Response) => {
    const parsed = createProductSchema.parse(req.body)
    const product = await createProduct(
      parsed,
      req.files as Express.Multer.File[]
    )

    res.status(201).json({
      msg: 'Product created successfully',
      data: product,
    })
  }
)

export const getAllProductsHandler = catchErrors(
  async (_req: Request, res: Response) => {
    const products = await getAllProducts()
    res.json({ data: products })
  }
)




export const searchProductsHandler = catchErrors(
  async (req: Request, res: Response) => {
    const result = await searchProducts(req.query)
    res.json(result)
  }
)


export const getProductByIdHandler = catchErrors(async (req, res) => {
  const { productId } = req.params
  const product = await getProductById(productId)
  res.status(200).json(product)
})


export const updateProductHandler = catchErrors(async (req, res) => {
  const validated = updateProductSchema.parse(req.body)
  const product = await updateProductService(req.params.productId, validated)
  res.status(200).json({ msg: 'Product updated', data: product })
})


export const addProductImageHandler = catchErrors(async (req, res) => {
  const productId = req.params.productId
  appAssert(req.file, 400, 'Image file is required')

  // Type guard to satisfy TypeScript
  if (!req.file) {
    return res.status(400).json({ msg: 'Image file is required' })
  }

  const product = await ProductModel.findById(productId)
  appAssert(product, 404, 'Product not found')

  appAssert(Array.isArray(product.images) && product.images.length < 5, 400, 'Maximum image limit (5) exceeded')

  const uploadResult = uploadImageBuffer(req.file.buffer)

  product.images.push({
    url: (await uploadResult).secure_url,
    public_id: (await uploadResult).public_id,
  })

  await product.save()

  res.status(200).json({
    msg: 'Image uploaded successfully',
    image: {
      url: (await uploadResult).secure_url,
      public_id: (await uploadResult).public_id,
    },
    currentImageCount: product.images.length,
  })
})



export const deleteProductImageHandler = catchErrors(async (req, res) => {
  const { imageId } = z.object({ imageId: z.string() }).parse(req.body)
  const productId = req.params.productId

  const product = await ProductModel.findById(productId)
  appAssert(product, 404, 'Product not found')

  // Remove from Cloudinary
  await cloudinary.uploader.destroy(imageId)

  // Remove from DB
  product.images = (product.images ?? []).filter((img) => img.public_id !== imageId)
  await product.save()

  res.status(200).json({
    msg: 'Image deleted successfully',
    currentImageCount: product.images.length,
  })
})



export const deleteProductHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { productId } = req.params
    await deleteProductService(productId)

    res.status(200).json({ msg: 'Product deleted successfully' })
  }
)




// =============== INVENTORY MGT ===============
export const updateStockHandler = catchErrors(async (req, res) => {
  const { productId } = req.params
  const validated = updateStockSchema.parse(req.body)

  const updatedProduct = await updateProductStockService(productId, validated)

  res.status(200).json({
    msg: 'Product stock updated successfully',
    data: updatedProduct,
  })
})


export const getInventoryOverview = catchErrors(
  async (req: Request, res: Response) => {
    const data = await getInventoryOverviewService()
    res.status(200).json(data)
  }
)