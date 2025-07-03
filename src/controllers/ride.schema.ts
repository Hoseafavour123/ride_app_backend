import { z } from 'zod'

export const bookRideSchema = z.object({
  pickup: z.object({
    address: z.string(),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  dropoff: z.object({
    address: z.string(),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  fareEstimate: z.number().positive(),
})