import { localStore, LocalTimestamp } from './local-store'
import type { Budget, BudgetFormData } from '@/types/budget'

const LOCAL_KEY = 'bt_budgets'
const DATE_FIELDS = ['createdAt', 'updatedAt']

function localGetBudgets(month: string): Budget[] {
  return localStore
    .readAll<Record<string, unknown>>(LOCAL_KEY)
    .map((item) => localStore.reviveDates<Budget>(item, DATE_FIELDS))
    .filter((b) => b.month === month)
}

export function subscribeToBudgets(
  _userId: string,
  month: string,
  callback: (budgets: Budget[]) => void,
) {
  callback(localGetBudgets(month))
  return localStore.subscribe(LOCAL_KEY, () => callback(localGetBudgets(month)))
}

export async function addBudget(_userId: string, month: string, data: BudgetFormData) {
  const now = LocalTimestamp.now()
  localStore.add<Budget>(LOCAL_KEY, {
    userId: 'local-user',
    category: data.category,
    limit: Math.round(Number(data.limit) * 100),
    month,
    createdAt: now,
    updatedAt: now,
  } as Omit<Budget, 'id'>)
}

export async function updateBudget(id: string, data: BudgetFormData) {
  localStore.update<Budget>(LOCAL_KEY, id, {
    category: data.category,
    limit: Math.round(Number(data.limit) * 100),
    updatedAt: LocalTimestamp.now(),
  } as Partial<Budget>)
}

export async function deleteBudget(id: string) {
  localStore.remove<Budget>(LOCAL_KEY, id)
}
