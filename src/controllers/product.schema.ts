import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),


  price: z.preprocess((val) => Number(val), z.number().positive()),

  discountPrice: z
    .preprocess(
      (val) => (val === '' || val == null ? undefined : Number(val)),
      z.number().positive()
    )
    .optional(),

  inStock: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number().int().nonnegative()
  ),

  category: z.string().length(24),

  tags: z
    .preprocess((val) => {
      if (!val) return undefined
      try {
        return JSON.parse(String(val))
      } catch {
        return undefined
      }
    }, z.array(z.string()))
    .optional(),
})


export const updateStockSchema = z.object({
  quantity: z.number().int().min(1),
  action: z.enum(['INCREASE', 'DECREASE']),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
