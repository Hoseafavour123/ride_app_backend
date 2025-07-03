import { z } from 'zod'

export const updateDriverStatusSchema = z.object({
  availability: z.enum(['ONLINE', 'OFFLINE']),
  location: z.object({
    coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
  }),
})
