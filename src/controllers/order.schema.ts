import {z} from 'zod'


export const orderQuerySchema = z.object({
  status: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  user: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
})
