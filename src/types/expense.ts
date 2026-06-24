export interface DateLike {
  toDate(): Date
}

export interface Expense {
  id: string
  userId: string
  amount: number
  category: string
  description: string
  date: DateLike
  createdAt: DateLike
  updatedAt: DateLike
}

export interface ExpenseFormData {
  amount: string
  category: string
  description: string
  date: string
}
