import type { AppState } from '@capacitor/app'
import { App } from '@capacitor/app'
import { Keyboard } from '@capacitor/keyboard'
import { StatusBar, Style } from '@capacitor/status-bar'
import { useEffect, useState } from 'react'

// Type augmentation for Capacitor global
declare global {
  interface Window {
    Capacitor?: {
      getPlatform: () => 'ios' | 'android' | 'web'
      isNativePlatform: () => boolean
    }
  }
}

/**
 * Hook to check if running in Capacitor (mobile) environment
 *
 * Usage:
 *   const isCapacitor = useIsCapacitor()
 *   if (isCapacitor) {
 *     // Show mobile-specific UI
 *   }
 */
export const useIsCapacitor = (): boolean => {
  const [isCapacitor, setIsCapacitor] = useState(false)

  useEffect(() => {
    // Check if we're in Capacitor/Cordova environment
    const inCapacitor =
      typeof window !== 'undefined' && (window.Capacitor !== undefined || 'cordova' in window)
    setIsCapacitor(inCapacitor)
  }, [])

  return isCapacitor
}

/**
 * Hook to track app lifecycle (foreground/background)
 *
 * Usage:
 *   const { state, isActive } = useAppState()
 */
export const useAppState = () => {
  const [state, setState] = useState<'foreground' | 'background'>('foreground')
  const isCapacitor = useIsCapacitor()

  useEffect(() => {
    if (!isCapacitor) {
      return
    }

    let listener: any
    ;(async () => {
      try {
        listener = await App.addListener('appStateChange', (appState: AppState) => {
          setState(appState.isActive ? 'foreground' : 'background')
        })
      } catch (err) {
        console.warn('AppState listener not available:', err)
      }
    })()

    return () => {
      if (listener) {
        listener.remove()
      }
    }
  }, [isCapacitor])

  return {
    state,
    isActive: state === 'foreground',
  }
}

/**
 * Hook to manage status bar (iOS/Android)
 *
 * Usage:
 *   useStatusBar('light')
 *   useStatusBar('dark')
 */
export const useStatusBar = (style?: 'light' | 'dark') => {
  const isCapacitor = useIsCapacitor()

  useEffect(() => {
    if (!isCapacitor || !style) {
      return
    }

    ;(async () => {
      try {
        await StatusBar.setStyle({
          style: style === 'light' ? Style.Light : Style.Dark,
        })
      } catch (err) {
        console.warn('StatusBar not available:', err)
      }
    })()
  }, [isCapacitor, style])
}

/**
 * Hook to manage keyboard (iOS/Android)
 * Hides keyboard on blur, shows on focus
 *
 * Usage:
 *   const { show, hide } = useKeyboardManager()
 */
export const useKeyboardManager = () => {
  const isCapacitor = useIsCapacitor()

  return {
    show: async () => {
      if (isCapacitor && Keyboard.show) {
        try {
          await Keyboard.show()
        } catch (err) {
          console.warn('Keyboard.show not available:', err)
        }
      }
    },
    hide: async () => {
      if (isCapacitor && Keyboard.hide) {
        try {
          await Keyboard.hide()
        } catch (err) {
          console.warn('Keyboard.hide not available:', err)
        }
      }
    },
  }
}

/**
 * Hook to detect if running on iOS (Capacitor)
 */
export const useIsIOS = (): boolean => {
  const [isIOS, setIsIOS] = useState(false)
  const isCapacitor = useIsCapacitor()

  useEffect(() => {
    if (!isCapacitor) {
      setIsIOS(false)
      return
    }

    // Check if platform is iOS via Capacitor
    if (window.Capacitor) {
      const platform = window.Capacitor.getPlatform?.()
      setIsIOS(platform === 'ios')
    }
  }, [isCapacitor])

  return isIOS
}

/**
 * Hook to detect if running on Android (Capacitor)
 */
export const useIsAndroid = (): boolean => {
  const [isAndroid, setIsAndroid] = useState(false)
  const isCapacitor = useIsCapacitor()

  useEffect(() => {
    if (!isCapacitor) {
      setIsAndroid(false)
      return
    }

    // Check if platform is Android via Capacitor
    if (window.Capacitor) {
      const platform = window.Capacitor.getPlatform?.()
      setIsAndroid(platform === 'android')
    }
  }, [isCapacitor])

  return isAndroid
}

/**
 * Hook to detect if running on web (in browser)
 */
export const useIsWeb = (): boolean => {
  const isCapacitor = useIsCapacitor()

  return !isCapacitor
}
