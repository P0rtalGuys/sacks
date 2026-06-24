import type { DateLike } from './expense'

export type BillingCycle = 'monthly' | 'quarterly' | 'yearly'

export interface Subscription {
  id: string
  userId: string
  name: string
  amount: number
  currency: string
  billingCycle: BillingCycle
  category: string
  nextRenewalDate: DateLike
  startDate: DateLike
  lastUsedDate: DateLike | null
  isActive: boolean
  notes: string
  createdAt: DateLike
  updatedAt: DateLike
}

export interface SubscriptionFormData {
  name: string
  amount: string
  currency: string
  billingCycle: BillingCycle
  category?: string
  nextRenewalDate: string
  notes: string
}

export interface SubscriptionSettings {
  monthlyBudget: number
  reminderDaysBefore: number
}

export interface CancelSuggestion {
  subscription: Subscription
  reason: string
  savingsPerMonth: number
  daysSinceLastUse: number | null
}
