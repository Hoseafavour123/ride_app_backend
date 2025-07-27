import { z } from 'zod'


export const updateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  availability: z.boolean().optional(),
  category: z.string().optional(),
  stock: z.number().int().min(0).optional(),
})
