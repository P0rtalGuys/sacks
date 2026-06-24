import { useState, useCallback } from 'react'
import {
  getSubscriptionSettings,
  saveSubscriptionSettings,
} from '@/services/subscriptions'
import type { SubscriptionSettings } from '@/types/subscription'

export function useSubscriptionSettings() {
  const [settings, setSettings] = useState<SubscriptionSettings>(getSubscriptionSettings)

  const updateSettings = useCallback((patch: Partial<SubscriptionSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      saveSubscriptionSettings(next)
      return next
    })
  }, [])

  return { settings, updateSettings }
}
