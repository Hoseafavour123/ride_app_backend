import { Request, Response } from 'express'
import { createProductSchema } from './product.schema'
import  catchErrors  from '../utils/catchErrors'
import { createProduct, getAllProducts, getProductById, searchProducts } from '../services/product.service'

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