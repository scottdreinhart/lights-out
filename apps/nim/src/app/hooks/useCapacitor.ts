import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { Device } from '@capacitor/device'
import { Preferences } from '@capacitor/preferences'
import { Haptics as CapacitorHaptics } from '@capacitor/haptics'
import type { DeviceInfo } from '@capacitor/device'

/**
 * useCapacitor - Access to Capacitor native bridge
 * Provides identity, platform info, and native API access
 *
 * Returns null on web (non-native), native APIs on Android/iOS
 */
export const useCapacitor = () => {
  const isNative = Capacitor.isNativePlatform()
  const platform = Capacitor.getPlatform() // 'android' | 'ios' | 'web'

  return {
    isNative,
    platform,
    // Plugin access (for advanced use cases)
    plugins: {
      App,
      Device,
      Preferences,
      CapacitorHaptics,
    },
  }
}

/**
 * useDeviceInfo - Get native device information
 * Returns device details on native platforms, minimal data on web
 */
export const useDeviceInfo = async (): Promise<DeviceInfo | null> => {
  if (!Capacitor.isNativePlatform()) {
    return null
  }

  try {
    const info = await Device.getInfo()
    return info
  } catch (err) {
    console.error('Failed to get device info:', err)
    return null
  }
}

/**
 * useHaptics - Trigger device vibration/haptic feedback (Capacitor only)
 * No-op on Electron and web
 */
export const useCapacitorHaptics = () => {
  const vibrate = async (duration = 50) => {
    try {
      await CapacitorHaptics.vibrate({ duration })
    } catch (err) {
      console.warn('Haptics not available:', err)
    }
  }

  const selectionStart = async () => {
    try {
      await CapacitorHaptics.selectionStart()
    } catch (err) {
      console.warn('Selection haptics not available:', err)
    }
  }

  const selectionChanged = async () => {
    try {
      await CapacitorHaptics.selectionChanged()
    } catch (err) {
      console.warn('Selection haptics not available:', err)
    }
  }

  const selectionEnd = async () => {
    try {
      await CapacitorHaptics.selectionEnd()
    } catch (err) {
      console.warn('Selection haptics not available:', err)
    }
  }

  return { vibrate, selectionStart, selectionChanged, selectionEnd }
}

/**
 * useCapacitorStorage - Persistent key-value storage
 * Uses native storage on Android/iOS, localStorage fallback on web
 */
export const useCapacitorStorage = () => {
  const setItem = async (key: string, value: string) => {
    try {
      await Preferences.set({ key, value })
    } catch (err) {
      console.error('Storage set failed:', err)
      // Fallback to localStorage
      try {
        localStorage.setItem(key, value)
      } catch (e) {
        console.error('localStorage also failed:', e)
      }
    }
  }

  const getItem = async (key: string): Promise<string | null> => {
    try {
      const { value } = await Preferences.get({ key })
      return value ?? null
    } catch (err) {
      console.error('Storage get failed:', err)
      // Fallback to localStorage
      try {
        return localStorage.getItem(key)
      } catch (e) {
        console.error('localStorage also failed:', e)
        return null
      }
    }
  }

  const removeItem = async (key: string) => {
    try {
      await Preferences.remove({ key })
    } catch (err) {
      console.error('Storage remove failed:', err)
      // Fallback to localStorage
      try {
        localStorage.removeItem(key)
      } catch (e) {
        console.error('localStorage also failed:', e)
      }
    }
  }

  const clear = async () => {
    try {
      await Preferences.clear()
    } catch (err) {
      console.error('Storage clear failed:', err)
      // Fallback to localStorage
      try {
        localStorage.clear()
      } catch (e) {
        console.error('localStorage also failed:', e)
      }
    }
  }

  return { setItem, getItem, removeItem, clear }
}

/**
 * useAppLifecycle - Listen to app lifecycle events
 * Register listeners for pause, resume, and app exit
 *
 * Example:
 *   const { onPause, onResume } = useAppLifecycle()
 *   onPause(() => console.log('App paused'))
 *   onResume(() => console.log('App resumed'))
 */
export const useAppLifecycle = () => {
  const onPause = (callback: () => void) => {
    const remove = App.addListener('pause', callback)
    return remove
  }

  const onResume = (callback: () => void) => {
    const remove = App.addListener('resume', callback)
    return remove
  }

  const onBackButton = (callback: () => void) => {
    const remove = App.addListener('backButton', callback)
    return remove
  }

  return { onPause, onResume, onBackButton }
}
