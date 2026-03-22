/**
 * Cross-platform app lifecycle management
 * Handle pause, resume, and app exit across Capacitor, Electron, and Web
 */

import { useEffect } from 'react'
import { usePlatform } from './usePlatform'
import { useAppLifecycle as useCapacitorLifecycle } from './useCapacitor'

interface LifecycleCallbacks {
  onPause?: () => void
  onResume?: () => void
  onBeforeUnload?: () => void
}

/**
 * useAppLifecycle - Listen to app lifecycle events across platforms
 *
 * - Capacitor (Android/iOS): pause/resume/backButton events
 * - Electron: window-all-closed, before-quit events (via IPC)
 * - Web: beforeunload, visibilitychange events
 *
 * Example:
 *   const { onPause, onResume } = useAppLifecycle()
 *   useAppLifecycle({ onPause, onResume, onBeforeUnload })
 */
export const useAppLifecycle = (callbacks: LifecycleCallbacks = {}) => {
  const { platform, isCapacitor, isElectron, isWeb } = usePlatform()
  const capacitorLifecycle = useCapacitorLifecycle()

  useEffect(() => {
    const cleanups: (() => void)[] = []

    if (isCapacitor) {
      // Capacitor: Use native lifecycle listeners (async, wrapped in promises)
      if (callbacks.onPause) {
        capacitorLifecycle.onPause(callbacks.onPause).then((handle) => {
          cleanups.push(() => handle?.remove?.())
        }).catch(() => {
          // Listener failed to attach, continue gracefully
        })
      }
      if (callbacks.onResume) {
        capacitorLifecycle.onResume(callbacks.onResume).then((handle) => {
          cleanups.push(() => handle?.remove?.())
        }).catch(() => {
          // Listener failed to attach, continue gracefully
        })
      }
    } else if (isElectron) {
      // Electron: Use IPC to listen for window/app events
      const ipc = (window as any).electron?.ipcRenderer

      if (ipc && callbacks.onPause) {
        ipc.on('app:pause', callbacks.onPause)
        cleanups.push(() => ipc.off('app:pause', callbacks.onPause))
      }

      if (ipc && callbacks.onResume) {
        ipc.on('app:resume', callbacks.onResume)
        cleanups.push(() => ipc.off('app:resume', callbacks.onResume))
      }

      if (ipc && callbacks.onBeforeUnload) {
        ipc.on('app:before-quit', callbacks.onBeforeUnload)
        cleanups.push(() => ipc.off('app:before-quit', callbacks.onBeforeUnload))
      }
    } else {
      // Web: Use standard browser events
      const handleBeforeUnload = () => callbacks.onBeforeUnload?.()

      const handleVisibilityChange = () => {
        if (document.hidden) {
          callbacks.onPause?.()
        } else {
          callbacks.onResume?.()
        }
      }

      if (callbacks.onBeforeUnload) {
        window.addEventListener('beforeunload', handleBeforeUnload)
        cleanups.push(() => window.removeEventListener('beforeunload', handleBeforeUnload))
      }

      if (callbacks.onPause || callbacks.onResume) {
        document.addEventListener('visibilitychange', handleVisibilityChange)
        cleanups.push(() =>
          document.removeEventListener('visibilitychange', handleVisibilityChange),
        )
      }
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [isCapacitor, isElectron, isWeb, callbacks, capacitorLifecycle])

  return { platform, isPaused: false }
}

/**
 * useAppPauseResume - Simple wrapper for pause/resume callbacks
 *
 * Example:
 *   useAppPauseResume(
 *     () => { console.log('App paused') },
 *     () => { console.log('App resumed') }
 *   )
 */
export const useAppPauseResume = (onPause?: () => void, onResume?: () => void) => {
  useAppLifecycle({ onPause, onResume })
}

/**
 * useAppBeforeUnload - Hook for cleanup before app closes
 *
 * Example:
 *   useAppBeforeUnload(() => {
 *     console.log('Saving game state...')
 *     saveGameState()
 *   })
 */
export const useAppBeforeUnload = (callback: () => void) => {
  useAppLifecycle({ onBeforeUnload: callback })
}
