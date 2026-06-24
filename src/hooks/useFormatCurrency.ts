import { useCallback } from 'react'
import { useCurrency } from '@/context/CurrencyContext'
import { formatCurrency } from '@/lib/utils'

export function useFormatCurrency() {
  const { currency } = useCurrency()
  return useCallback(
    (amountInCents: number) => formatCurrency(amountInCents, currency),
    [currency],
  )
}
