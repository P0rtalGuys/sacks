import { localStore, LocalTimestamp } from './local-store'
import type { Expense, ExpenseFormData } from '@/types/expense'

const LOCAL_KEY = 'bt_expenses'
const DATE_FIELDS = ['date', 'createdAt', 'updatedAt']

function localGetExpenses(month: string): Expense[] {
  const [year, m] = month.split('-').map(Number)
  const startOfMonth = new Date(year, m - 1, 1)
  const endOfMonth = new Date(year, m, 0, 23, 59, 59, 999)

  return localStore
    .readAll<Record<string, unknown>>(LOCAL_KEY)
    .map((item) => localStore.reviveDates<Expense>(item, DATE_FIELDS))
    .filter((e) => {
      const d = e.date.toDate()
      return d >= startOfMonth && d <= endOfMonth
    })
    .sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime())
}

export function subscribeToExpenses(
  _userId: string,
  month: string,
  callback: (expenses: Expense[]) => void,
) {
  callback(localGetExpenses(month))
  return localStore.subscribe(LOCAL_KEY, () => callback(localGetExpenses(month)))
}

export async function addExpense(_userId: string, data: ExpenseFormData) {
  const now = LocalTimestamp.now()
  localStore.add<Expense>(LOCAL_KEY, {
    userId: 'local-user',
    amount: Math.round(Number(data.amount) * 100),
    category: data.category,
    description: data.description,
    date: LocalTimestamp.fromDate(new Date(data.date)),
    createdAt: now,
    updatedAt: now,
  } as Omit<Expense, 'id'>)
}

export async function updateExpense(id: string, data: ExpenseFormData) {
  localStore.update<Expense>(LOCAL_KEY, id, {
    amount: Math.round(Number(data.amount) * 100),
    category: data.category,
    description: data.description,
    date: LocalTimestamp.fromDate(new Date(data.date)),
    updatedAt: LocalTimestamp.now(),
  } as Partial<Expense>)
}

export async function deleteExpense(id: string) {
  localStore.remove<Expense>(LOCAL_KEY, id)
}
