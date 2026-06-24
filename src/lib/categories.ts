import {
  Utensils,
  Car,
  Film,
  ShoppingBag,
  Receipt,
  Heart,
  GraduationCap,
  Home,
  Wifi,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react'

export interface Category {
  id: string
  label: string
  icon: LucideIcon
  color: string
}

export const CATEGORIES: Category[] = [
  { id: 'food', label: 'Food & Dining', icon: Utensils, color: '#f97316' },
  { id: 'transport', label: 'Transport', icon: Car, color: '#3b82f6' },
  { id: 'entertainment', label: 'Entertainment', icon: Film, color: '#a855f7' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: '#ec4899' },
  { id: 'bills', label: 'Bills & Utilities', icon: Receipt, color: '#eab308' },
  { id: 'health', label: 'Health', icon: Heart, color: '#ef4444' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: '#14b8a6' },
  { id: 'housing', label: 'Housing', icon: Home, color: '#8b5cf6' },
  { id: 'subscriptions', label: 'Subscriptions', icon: Wifi, color: '#06b6d4' },
  { id: 'other', label: 'Other', icon: MoreHorizontal, color: '#6b7280' },
]

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))

export function getCategoryById(id: string): Category {
  return CATEGORY_MAP[id] ?? CATEGORIES[CATEGORIES.length - 1]
}
