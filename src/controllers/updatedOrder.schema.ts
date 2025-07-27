import { z } from 'zod'

const updateOrderStatusSchema = z.object({
  status: z.enum(['PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
})

export default updateOrderStatusSchema