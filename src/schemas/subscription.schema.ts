import { z } from 'zod'

export const subscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Must be a positive number'),
  currency: z.string().min(1, 'Currency is required'),
  billingCycle: z.enum(['monthly', 'quarterly', 'yearly']),
  category: z.string().optional(),
  nextRenewalDate: z.string().min(1, 'Next renewal date is required'),
  notes: z.string().max(500),
})

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>
