const CACHE_KEY = 'bt_exchange_rates'
const CACHE_TTL = 24 * 60 * 60 * 1000

interface CachedRates {
  base: string
  rates: Record<string, number>
  fetchedAt: number
}

function getCached(): CachedRates | null {
  const raw = localStorage.getItem(CACHE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as CachedRates
  } catch {
    return null
  }
}

async function fetchRates(base: string): Promise<Record<string, number>> {
  const res = await fetch(`https://open.er-api.com/v6/latest/${base}`)
  if (!res.ok) throw new Error(`Exchange rate fetch failed: ${res.status}`)
  const data = await res.json()
  return data.rates as Record<string, number>
}

export async function getExchangeRates(base: string): Promise<Record<string, number>> {
  const cached = getCached()
  if (cached && cached.base === base && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached.rates
  }

  try {
    const rates = await fetchRates(base)
    const entry: CachedRates = { base, rates, fetchedAt: Date.now() }
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
    return rates
  } catch {
    if (cached && cached.base === base) return cached.rates
    return { [base]: 1 }
  }
}

export function convertAmount(
  amountInCents: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
): number {
  if (fromCurrency === toCurrency) return amountInCents
  const fromRate = rates[fromCurrency]
  const toRate = rates[toCurrency]
  if (!fromRate || !toRate) return amountInCents
  return Math.round((amountInCents / fromRate) * toRate)
}
