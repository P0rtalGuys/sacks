import { createContext, useContext, useState, type ReactNode } from 'react'

interface CurrencyContextValue {
  currency: string
  setCurrency: (code: string) => Promise<void>
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'USD',
  setCurrency: async () => {},
})

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState(
    () => localStorage.getItem('bt_currency') ?? 'USD',
  )

  async function setCurrency(code: string) {
    setCurrencyState(code)
    localStorage.setItem('bt_currency', code)
  }

  return (
    <CurrencyContext value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
