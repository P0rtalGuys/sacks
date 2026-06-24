import { isElectron } from '@/lib/utils'

export class LocalTimestamp {
  private _date: Date

  constructor(date: Date) {
    this._date = date
  }

  toDate(): Date {
    return this._date
  }

  get seconds(): number {
    return Math.floor(this._date.getTime() / 1000)
  }

  static fromDate(date: Date): LocalTimestamp {
    return new LocalTimestamp(date)
  }

  static now(): LocalTimestamp {
    return new LocalTimestamp(new Date())
  }

  toJSON(): string {
    return this._date.toISOString()
  }
}

type Listener = () => void

const listeners = new Map<string, Set<Listener>>()

function notify(key: string) {
  const set = listeners.get(key)
  if (set) {
    for (const fn of set) fn()
  }
}

function subscribe(key: string, fn: Listener): () => void {
  if (!listeners.has(key)) listeners.set(key, new Set())
  listeners.get(key)!.add(fn)
  return () => listeners.get(key)?.delete(fn)
}

function readAll<T>(key: string): T[] {
  const raw = localStorage.getItem(key)
  if (!raw) return []
  return JSON.parse(raw) as T[]
}

function writeAll<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items))
  notify(key)
}

let idCounter = Date.now()
function generateId(): string {
  return `local_${(idCounter++).toString(36)}_${Math.random().toString(36).slice(2, 6)}`
}

function reviveDates<T>(item: Record<string, unknown>, dateFields: string[]): T {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(item)) {
    if (dateFields.includes(k) && typeof v === 'string') {
      out[k] = new LocalTimestamp(new Date(v))
    } else {
      out[k] = v
    }
  }
  return out as T
}

export const localStore = {
  subscribe,
  readAll,
  writeAll,
  generateId,
  reviveDates,

  add<T extends { id: string }>(key: string, item: Omit<T, 'id'>): string {
    const id = generateId()
    const items = readAll<T>(key)
    items.push({ ...item, id } as T)
    writeAll(key, items)
    return id
  },

  update<T extends { id: string }>(key: string, id: string, patch: Partial<T>) {
    const items = readAll<T>(key)
    const idx = items.findIndex((i) => i.id === id)
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...patch }
      writeAll(key, items)
    }
  },

  remove<T extends { id: string }>(key: string, id: string) {
    const items = readAll<T>(key)
    writeAll(key, items.filter((i) => i.id !== id))
  },
}

export { isElectron }
