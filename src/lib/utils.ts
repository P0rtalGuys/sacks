import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const isElectron = navigator.userAgent.includes('Electron')

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amountInCents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amountInCents / 100)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function getMonthLabel(month: string): string {
  const [year, m] = month.split('-')
  const date = new Date(Number(year), Number(m) - 1)
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)
}

const AVATAR_PALETTE = ['#3b82f6','#8b5cf6','#ec4899','#f97316','#14b8a6','#06b6d4','#ef4444','#a855f7']

export function getNameColor(name: string): string {
  const i = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_PALETTE.length
  return AVATAR_PALETTE[i]
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase()
}
