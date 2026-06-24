import { z } from 'zod'

export const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  limit: z
    .string()
    .min(1, 'Limit is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Must be a positive number'),
})
