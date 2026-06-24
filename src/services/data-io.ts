import { localStore, LocalTimestamp } from './local-store'

interface ExportData {
  version: 1
  exportedAt: string
  expenses: Record<string, unknown>[]
  budgets: Record<string, unknown>[]
  subscriptions: Record<string, unknown>[]
}

function timestampToISO(ts: unknown): string {
  if (ts && typeof ts === 'object' && 'toDate' in ts) {
    return (ts as { toDate(): Date }).toDate().toISOString()
  }
  return String(ts)
}

function serializeDoc(doc: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(doc)) {
    if (key === 'userId' || key === 'id') continue
    out[key] = val && typeof val === 'object' && 'toDate' in val ? timestampToISO(val) : val
  }
  return out
}

function localReadAll(key: string, dateFields: string[]): Record<string, unknown>[] {
  return localStore
    .readAll<Record<string, unknown>>(key)
    .map((item) => localStore.reviveDates<Record<string, unknown>>(item, dateFields))
}

export async function exportJSON(_userId: string): Promise<void> {
  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    expenses: localReadAll('bt_expenses', ['date', 'createdAt', 'updatedAt']).map(serializeDoc),
    budgets: localReadAll('bt_budgets', ['createdAt', 'updatedAt']).map(serializeDoc),
    subscriptions: localReadAll('bt_subscriptions', ['nextRenewalDate', 'startDate', 'createdAt', 'updatedAt']).map(serializeDoc),
  }
  downloadFile(JSON.stringify(data, null, 2), `sack-backup-${new Date().toISOString().split('T')[0]}.json`, 'application/json')
}

export async function exportExpensesCSV(_userId: string): Promise<void> {
  const expenses = localReadAll('bt_expenses', ['date', 'createdAt', 'updatedAt'])
  const headers = ['Date', 'Category', 'Amount', 'Description']
  const rows = expenses.map((e) => [
    timestampToISO(e.date).split('T')[0],
    String(e.category),
    (Number(e.amount) / 100).toFixed(2),
    `"${String(e.description ?? '').replace(/"/g, '""')}"`,
  ])
  downloadFile([headers.join(','), ...rows.map((r) => r.join(','))].join('\n'), `expenses-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
}

export async function importJSON(_userId: string, file: File): Promise<{ expenses: number; budgets: number; subscriptions: number }> {
  const text = await file.text()
  const data = JSON.parse(text) as ExportData
  if (data.version !== 1) throw new Error('Unsupported backup version')

  let expenses = 0, budgets = 0, subscriptions = 0
  const dateFields = ['date', 'nextRenewalDate', 'startDate']

  for (const expense of data.expenses) {
    localStore.add('bt_expenses', { ...restoreTimestamps(expense, dateFields), userId: 'local-user', createdAt: LocalTimestamp.now(), updatedAt: LocalTimestamp.now() })
    expenses++
  }
  for (const budget of data.budgets) {
    localStore.add('bt_budgets', { ...restoreTimestamps(budget, []), userId: 'local-user', createdAt: LocalTimestamp.now(), updatedAt: LocalTimestamp.now() })
    budgets++
  }
  for (const sub of data.subscriptions) {
    localStore.add('bt_subscriptions', { ...restoreTimestamps(sub, dateFields), userId: 'local-user', createdAt: LocalTimestamp.now(), updatedAt: LocalTimestamp.now() })
    subscriptions++
  }

  return { expenses, budgets, subscriptions }
}

function restoreTimestamps(doc: Record<string, unknown>, dateFields: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(doc)) {
    if (key === 'createdAt' || key === 'updatedAt') continue
    out[key] = dateFields.includes(key) && typeof val === 'string'
      ? LocalTimestamp.fromDate(new Date(val))
      : val
  }
  return out
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
