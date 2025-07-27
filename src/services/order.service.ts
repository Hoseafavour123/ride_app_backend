import CartModel from '../models/cart.model'
import ProductModel from '../models/product.model'
import OrderModel from '../models/order.model'
import appAssert from '../utils/appAssert'
import { NOT_FOUND } from '../constants/http'
import UserModel from '../models/user.model'

export const createOrderService = async (
  userId: string | undefined,
  shippingAddress: string
) => {
  const cart = await CartModel.findOne({ userId }).populate('items.product')
  appAssert(cart && cart.items.length, NOT_FOUND, 'Cart is empty')

  const orderItems = []
  const productUpdates = []

  for (const item of cart.items) {
    const product = item.product as any

    appAssert(product, NOT_FOUND, `Product not found for the item`)

    appAssert(
      product.inStock >= item.quantity,
      NOT_FOUND,
      `Insufficient stock for product ${product.name}`
    )

    // Reduce stock and update availability if stock reaches zero
    product.inStock -= item.quantity
    product.isAvailable = product.inStock > 0
    product.lowStock = product.inStock <= (product.lowStockThreshold || 5)
    
    productUpdates.push(product.save())

    orderItems.push({
      productId: product._id,
      name: product.name,
      imageUrl: product.images?.[0]?.url || '',
      price: product.price,
      quantity: item.quantity,
    })
  }

  await Promise.all(productUpdates)

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const order = await OrderModel.create({
    userId,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentStatus: 'PENDING',
    orderStatus: 'PLACED',
  })

  // Clear user's cart after order is placed
  await CartModel.deleteOne({ userId })

  return order
}

export const getUserOrdersService = async (userId: string | undefined) => {
  return OrderModel.find({ userId }).sort({ createdAt: -1 })
}


export const updateOrderStatusService = async (
  orderId: string,
  status: 'PLACED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
) => {
  const order = await OrderModel.findById(orderId)
  appAssert(order, NOT_FOUND, 'Order not found')

  order.orderStatus = status
  await order.save()

  return order
}

// ============= ADMIN ==================
export const getAllOrdersService = async (query: any) => {
  const {
    status,
    fromDate,
    toDate,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query

  const filter: any = {}

  if (status) filter.status = status

  if (fromDate || toDate) {
    filter.createdAt = {}
    if (fromDate) filter.createdAt.$gte = new Date(fromDate)
    if (toDate) filter.createdAt.$lte = new Date(toDate)
  }

  const skip = (page - 1) * limit

  const [orders, total] = await Promise.all([
    OrderModel.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('userId', 'name email')
      .populate('items.productId', 'name price'),

    OrderModel.countDocuments(filter),
  ])

  const totalPages = Math.ceil(total / limit)

  return {
    total,
    totalPages,
    currentPage: Number(page),
    pageSize: Number(limit),
    orders,
  }
}




export const getFilteredOrdersService = async (params: any) => {
  const { status, from, to, user, page = 1, limit = 10 } = params

  const query: any = {}

  if (status) query.orderStatus = status

  if (from || to) {
    query.createdAt = {}
    if (from) query.createdAt.$gte = new Date(from)
    if (to) query.createdAt.$lte = new Date(to)
  }

  if (user) {
    const userDoc = await UserModel.findOne({ email: user })
    if (userDoc) query.userId = userDoc._id
  }

  const skip = (Number(page) - 1) * Number(limit)

  const [orders, total] = await Promise.all([
    OrderModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    OrderModel.countDocuments(query),
  ])

  return {
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    orders,
  }
}