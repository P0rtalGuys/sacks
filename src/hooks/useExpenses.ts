import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { subscribeToExpenses } from '@/services/expenses'
import type { Expense } from '@/types/expense'

export function useExpenses(month: string) {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 1500)
    const unsub = subscribeToExpenses(user.uid, month, (data) => {
      setExpenses(data)
      setLoading(false)
      clearTimeout(timeout)
    })
    return () => { unsub(); clearTimeout(timeout) }
  }, [user, month])

  return { expenses, loading }
}
