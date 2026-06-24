import { useEffect, useState } from 'react'
import { useCurrency } from '@/context/CurrencyContext'
import { getExchangeRates, convertAmount } from '@/services/exchange-rates'

export function useExchangeRates() {
  const { currency: baseCurrency } = useCurrency()
  const [rates, setRates] = useState<Record<string, number>>({ [baseCurrency]: 1 })

  useEffect(() => {
    let cancelled = false
    getExchangeRates(baseCurrency).then((r) => {
      if (!cancelled) setRates(r)
    })
    return () => { cancelled = true }
  }, [baseCurrency])

  function convert(amountInCents: number, fromCurrency: string): number {
    return convertAmount(amountInCents, fromCurrency, baseCurrency, rates)
  }

  return { rates, baseCurrency, convert }
}
