import { useEffect } from 'react'
import { toast } from 'sonner'

declare global {
  interface Window {
    electronAPI?: {
      onUpdateAvailable: (cb: (info: unknown) => void) => void
      onUpdateDownloaded: (cb: (info: unknown) => void) => void
      onUpdateError: (cb: (err: string) => void) => void
      installUpdate: () => void
      removeUpdateListeners: () => void
    }
  }
}

export function useAutoUpdate() {
  useEffect(() => {
    const api = window.electronAPI
    if (!api) return

    api.onUpdateAvailable(() => {
      toast.info('Update available', {
        description: 'Downloading in the background…',
        duration: 5000,
      })
    })

    api.onUpdateDownloaded(() => {
      toast.success('Update ready to install', {
        description: 'Restart Sack to apply the latest update.',
        action: {
          label: 'Restart now',
          onClick: () => api.installUpdate(),
        },
        duration: Infinity,
      })
    })

    return () => api.removeUpdateListeners()
  }, [])
}
