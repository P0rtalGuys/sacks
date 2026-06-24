import type { DateLike } from './expense'

export interface Budget {
  id: string
  userId: string
  category: string
  limit: number
  month: string
  createdAt: DateLike
  updatedAt: DateLike
}

export interface BudgetFormData {
  category: string
  limit: string
}
