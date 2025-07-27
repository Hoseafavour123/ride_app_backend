import { Request, Response } from 'express'
import catchErrors  from '../utils/catchErrors'
import {
  createOrderService,
  getAllOrdersService,
  getFilteredOrdersService,
  getUserOrdersService,
  updateOrderStatusService,
} from '../services/order.service'
import { z } from 'zod'
import updateOrderStatusSchema from './updatedOrder.schema'
import { orderQuerySchema } from './order.schema'

const createOrderSchema = z.object({
  shippingAddress: z.string().min(5),
})

export const createOrderHandler = catchErrors(
  async (req: Request, res: Response) => {
    const validated = createOrderSchema.parse(req.body)
    const userId = req.user?.id.toString()
    const order = await createOrderService(userId, validated.shippingAddress)
    res.status(201).json({ msg: 'Order placed successfully', data: order })
  }
)

export const getUserOrdersHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userId = req.user?.id.toString()
    const orders = await getUserOrdersService(userId)
    res.json({ msg: 'Orders fetched', data: orders })
  }
)


export const updateOrderStatusHandler = catchErrors(async (req, res) => {
  const validated = updateOrderStatusSchema.parse(req.body)
  const { orderId } = req.params
  const updatedOrder = await updateOrderStatusService(orderId, validated.status)
  res.json({ msg: 'Order status updated', data: updatedOrder })
})


// ========== ADMIN ============
export const getAllOrdersHandler = catchErrors(
  async (req: Request, res: Response) => {
    const result = await getAllOrdersService(req.query)
    res.status(200).json({
      msg: 'Fetched all orders',
      data: result,
    })
  }
)

export const getFilteredOrdersHandler = catchErrors(
  async (req: Request, res: Response) => {
    const query = orderQuerySchema.parse(req.query)
    const orders = await getFilteredOrdersService(query)
    res.status(200).json({ msg: 'Filtered orders', data: orders })
  }
)