import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { subscribeToBudgets } from '@/services/budgets'
import type { Budget } from '@/types/budget'

export function useBudgets(month: string) {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 1500)
    const unsub = subscribeToBudgets(user.uid, month, (data) => {
      setBudgets(data)
      setLoading(false)
      clearTimeout(timeout)
    })
    return () => { unsub(); clearTimeout(timeout) }
  }, [user, month])

  return { budgets, loading }
}
