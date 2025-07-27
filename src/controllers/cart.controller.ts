import { Request, Response } from 'express'
import catchErrors from '../utils/catchErrors'
import {
  addToCartSchema,
  updateCartItemSchema,
} from './cart.schema'
import {
  addToCartService,
  getCartService,
  updateCartItemService,
  removeCartItemService,
  clearCartService,
} from '../services/cart.service'

export const addToCartHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { productId, quantity} = addToCartSchema.parse(req.body)
    const userId = req.user?.id.toString()
    const cart = await addToCartService(userId, productId, quantity)
    res.status(201).json({ msg: 'Item added to cart', data: cart })
  }
)

export const getCartHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userId = req.user?.id.toString()
    const cart = await getCartService(userId)
    res.status(200).json({ msg: 'Cart fetched', data: cart })
  }
)

export const updateCartItemHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { quantity } = updateCartItemSchema.parse(req.body)
    const userId = req.user?.id.toString()
    const { productId } = req.params
    const cart = await updateCartItemService(
      userId,
      productId,
      quantity
    )
    res.status(200).json({ msg: 'Cart item updated', data: cart })
  }
)

export const removeCartItemHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userId = req.user?.id.toString()
    const { productId } = req.params
    const cart = await removeCartItemService(userId, productId)
    res.status(200).json({ msg: 'Item removed from cart', data: cart })
  }
)

export const clearCartHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userId = req.user?.id.toString()
    await clearCartService(userId)
    res.status(200).json({ msg: 'Cart cleared' })
  }
)