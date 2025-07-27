import { BAD_REQUEST, NOT_FOUND } from '../constants/http'
import CartModel from '../models/cart.model'
import ProductModel from '../models/product.model'
import appAssert from '../utils/appAssert'
import mongoose from 'mongoose'

export const addToCartService = async (
  userId: string | undefined,
  productId: string,
  quantity: number
) => {
  const product = await ProductModel.findById(productId)
  appAssert(product, 404, 'Product not found')

  const priceAtAdd = product.price

  let cart = await CartModel.findOne({ userId })

  if (!cart) {
    // create new cart
    cart = await CartModel.create({
      userId,
      items: [{ product: product._id, quantity, priceAtAdd }],
    })
    return cart
  }

  // if product already in cart, update quantity
  const existingItem = cart.items.find((item) =>
    item.product.equals(new mongoose.Types.ObjectId(productId))
  )

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.items.push({ product: product._id as mongoose.Types.ObjectId, quantity, priceAtAdd })
  }

  await cart.save()
  return cart
}



export const getCartService = async (userId: string | undefined) => {
  const cart = await CartModel.findOne({ userId }).populate('items.product')
  return cart || { userId, items: [] }
}


export const updateCartItemService = async (
  userId: string | undefined,
  productId: string,
  quantity: number
) => {
  const cart = await CartModel.findOne({ userId })
  appAssert(cart, NOT_FOUND, 'Cart not found')

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  )
  appAssert(itemIndex > -1,BAD_REQUEST,  'Product not in cart',)

  cart.items[itemIndex].quantity = quantity
  await cart.save()
  return cart.populate('items.product')
}


export const removeCartItemService = async (
  userId: string | undefined,
  productId: string
) => {
  const cart = await CartModel.findOneAndUpdate(
    { userId },
    { $pull: { items: { product: productId } } },
    { new: true }
  ).populate('items.product')

  appAssert(cart,NOT_FOUND, 'Cart not found or item not in cart')
  return cart
}

export const clearCartService = async (userId: string | undefined) => {
  await CartModel.findOneAndDelete({ userId })
}
