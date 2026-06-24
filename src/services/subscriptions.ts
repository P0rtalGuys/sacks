import { localStore, LocalTimestamp } from './local-store'
import type { Subscription, SubscriptionFormData, SubscriptionSettings, CancelSuggestion } from '@/types/subscription'

const LOCAL_KEY = 'bt_subscriptions'
const DATE_FIELDS = ['nextRenewalDate', 'startDate', 'lastUsedDate', 'createdAt', 'updatedAt']

function localGetSubscriptions(): Subscription[] {
  const all = localStore.readAll<Record<string, unknown>>(LOCAL_KEY)
  return all
    .map((item) => localStore.reviveDates<Subscription>(item, DATE_FIELDS))
    .filter((s) => s.isActive)
    .sort((a, b) => a.nextRenewalDate.toDate().getTime() - b.nextRenewalDate.toDate().getTime())
}

export function subscribeToSubscriptions(
  _userId: string,
  callback: (subs: Subscription[]) => void,
  _onError?: (err: Error) => void,
) {
  callback(localGetSubscriptions())
  return localStore.subscribe(LOCAL_KEY, () => callback(localGetSubscriptions()))
}

export async function addSubscription(_userId: string, data: SubscriptionFormData) {
  const now = LocalTimestamp.now()
  const renewalDate = LocalTimestamp.fromDate(new Date(data.nextRenewalDate))
  localStore.add<Subscription>(LOCAL_KEY, {
    userId: 'local-user',
    name: data.name,
    amount: Math.round(Number(data.amount) * 100),
    currency: data.currency,
    billingCycle: data.billingCycle,
    category: data.category,
    nextRenewalDate: renewalDate,
    startDate: renewalDate,
    lastUsedDate: null,
    isActive: true,
    notes: data.notes,
    createdAt: now,
    updatedAt: now,
  } as Omit<Subscription, 'id'>)
}

export async function updateSubscription(id: string, data: SubscriptionFormData) {
  localStore.update<Subscription>(LOCAL_KEY, id, {
    name: data.name,
    amount: Math.round(Number(data.amount) * 100),
    currency: data.currency,
    billingCycle: data.billingCycle,
    category: data.category,
    nextRenewalDate: LocalTimestamp.fromDate(new Date(data.nextRenewalDate)),
    notes: data.notes,
    updatedAt: LocalTimestamp.now(),
  } as Partial<Subscription>)
}

export async function cancelSubscription(id: string) {
  localStore.update<Subscription>(LOCAL_KEY, id, {
    isActive: false,
    updatedAt: LocalTimestamp.now(),
  } as Partial<Subscription>)
}

export async function deleteSubscription(id: string) {
  localStore.remove<Subscription>(LOCAL_KEY, id)
}

export async function markSubscriptionUsed(id: string) {
  localStore.update<Subscription>(LOCAL_KEY, id, {
    lastUsedDate: LocalTimestamp.now(),
    updatedAt: LocalTimestamp.now(),
  } as Partial<Subscription>)
}

export function getMonthlyAmount(sub: Subscription): number {
  switch (sub.billingCycle) {
    case 'monthly':  return sub.amount
    case 'quarterly': return Math.round(sub.amount / 3)
    case 'yearly':   return Math.round(sub.amount / 12)
  }
}

const SETTINGS_KEY = 'bt_subscription_settings'

export function getSubscriptionSettings(): SubscriptionSettings {
  const raw = localStorage.getItem(SETTINGS_KEY)
  if (!raw) return { monthlyBudget: 0, reminderDaysBefore: 3 }
  return JSON.parse(raw) as SubscriptionSettings
}

export function saveSubscriptionSettings(settings: SubscriptionSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function getCancelSuggestions(subscriptions: Subscription[]): CancelSuggestion[] {
  const now = Date.now()
  const suggestions: CancelSuggestion[] = []

  for (const sub of subscriptions) {
    const monthlyAmount = getMonthlyAmount(sub)
    const daysSinceLastUse = sub.lastUsedDate
      ? Math.floor((now - sub.lastUsedDate.toDate().getTime()) / (1000 * 60 * 60 * 24))
      : null

    if (daysSinceLastUse !== null && daysSinceLastUse > 30 && monthlyAmount > 500) {
      suggestions.push({
        subscription: sub,
        reason: `Not used in ${daysSinceLastUse} days — costs ${formatCentsShort(monthlyAmount)}/mo`,
        savingsPerMonth: monthlyAmount,
        daysSinceLastUse,
      })
    } else if (daysSinceLastUse !== null && daysSinceLastUse > 60) {
      suggestions.push({
        subscription: sub,
        reason: `Not used in ${daysSinceLastUse} days`,
        savingsPerMonth: monthlyAmount,
        daysSinceLastUse,
      })
    } else if (daysSinceLastUse === null) {
      const daysSinceStart = Math.floor((now - sub.startDate.toDate().getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceStart > 14) {
        suggestions.push({
          subscription: sub,
          reason: 'Never marked as used — consider tracking usage or cancelling',
          savingsPerMonth: monthlyAmount,
          daysSinceLastUse: null,
        })
      }
    }
  }

  return suggestions.sort((a, b) => b.savingsPerMonth - a.savingsPerMonth)
}

function formatCentsShort(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`
}

export function getUpcomingRenewals(subscriptions: Subscription[], daysBefore: number) {
  const now = Date.now()
  return subscriptions.filter((s) => {
    const days = Math.ceil((s.nextRenewalDate.toDate().getTime() - now) / (1000 * 60 * 60 * 24))
    return days >= 0 && days <= daysBefore
  })
}
