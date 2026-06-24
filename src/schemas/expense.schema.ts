import { z } from 'zod'

export const expenseSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(200, 'Description too long'),
  date: z.string().min(1, 'Date is required'),
})

export type ExpenseFormValues = z.infer<typeof expenseSchema>
