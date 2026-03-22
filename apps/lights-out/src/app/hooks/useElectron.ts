import type { ElectronAPI } from '@/electron/types'
import { useEffect, useState } from 'react'

/**
 * Hook to safely access Electron API in React components
 * Returns undefined if not running in Electron
 *
 * Usage:
 *   const electron = useElectron()
 *   if (electron) {
 *     const version = await electron.getVersion()
 *   }
 */
export const useElectron = (): ElectronAPI | undefined => {
  const [electronAPI, setElectronAPI] = useState<ElectronAPI | undefined>(undefined)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      setElectronAPI(window.electronAPI)
    }
  }, [])

  return electronAPI
}

/**
 * Hook to check if running in Electron environment
 *
 * Usage:
 *   const isElectron = useIsElectron()
 *   if (isElectron) {
 *     // Show Electron-specific UI
 *   }
 */
export const useIsElectron = (): boolean => {
  const electron = useElectron()
  return electron?.isElectron ?? false
}

/**
 * Hook to check if running in development mode
 *
 * Usage:
 *   const isDev = useIsDevMode()
 */
export const useIsDevMode = (): boolean => {
  const electron = useElectron()
  if (electron) {
    return electron.isDev
  }
  return import.meta.env.DEV
}

/**
 * Hook to get app version
 *
 * Usage:
 *   const { version, error, loading } = useAppVersion()
 */
export const useAppVersion = () => {
  const [version, setVersion] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const electron = useElectron()

  useEffect(() => {
    if (!electron) {
      setLoading(false)
      return
    }

    ;(async () => {
      try {
        const v = await electron.getVersion()
        setVersion(v)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    })()
  }, [electron])

  return { version, error, loading }
}

/**
 * Hook for window control (minimize, maximize, close)
 *
 * Usage:
 *   const { minimize, maximize, close } = useWindowControls()
 *   <button onClick={minimize}>_</button>
 */
export const useWindowControls = () => {
  const electron = useElectron()

  return {
    minimize: () => electron?.windowMinimize(),
    maximize: () => electron?.windowMaximize(),
    close: () => electron?.windowClose(),
    isAvailable: !!electron,
  }
}
