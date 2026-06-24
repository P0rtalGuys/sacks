import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { subscribeToSubscriptions } from '@/services/subscriptions'
import type { Subscription } from '@/types/subscription'

export function useSubscriptions() {
  const { user } = useAuth()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const unsub = subscribeToSubscriptions(user.uid, (data) => {
      setSubscriptions(data)
      setLoading(false)
    })
    return unsub
  }, [user])

  return { subscriptions, loading }
}
