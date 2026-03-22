/**
 * Capacitor Platform Adapter
 * Implements PlatformApi using Capacitor plugins for iOS/Android
 */

import type { PlatformApi } from '../../contracts'

const capacitorHaptics = {
  async light() {
    try {
      const { Haptics } = await import('@capacitor/haptics')
      await Haptics.notification({ type: 'Light' as any })
    } catch {
      // Fallback: use browser vibration
      if (navigator.vibrate) navigator.vibrate(10)
    }
  },
  async medium() {
    try {
      const { Haptics } = await import('@capacitor/haptics')
      await Haptics.notification({ type: 'Medium' as any })
    } catch {
      if (navigator.vibrate) navigator.vibrate(20)
    }
  },
  async heavy() {
    try {
      const { Haptics } = await import('@capacitor/haptics')
      await Haptics.notification({ type: 'Heavy' as any })
    } catch {
      if (navigator.vibrate) navigator.vibrate(50)
    }
  },
}

const capacitorStorage = {
  async getItem(key: string) {
    try {
      const { Preferences } = await import('@capacitor/preferences')
      const { value } = await Preferences.get({ key })
      return value || null
    } catch {
      // Fallback to localStorage
      return localStorage.getItem(key)
    }
  },
  async setItem(key: string, value: string) {
    try {
      const { Preferences } = await import('@capacitor/preferences')
      await Preferences.set({ key, value })
    } catch {
      // Fallback to localStorage
      localStorage.setItem(key, value)
    }
  },
  async removeItem(key: string) {
    try {
      const { Preferences } = await import('@capacitor/preferences')
      await Preferences.remove({ key })
    } catch {
      localStorage.removeItem(key)
    }
  },
  async clear() {
    try {
      const { Preferences } = await import('@capacitor/preferences')
      await Preferences.clear()
    } catch {
      localStorage.clear()
    }
  },
}

const capacitorDiagnostics = {
  logError(message: string, context?: Record<string, any>) {
    console.error('[ERROR]', message, context)
  },
  logWarning(message: string) {
    console.warn('[WARN]', message)
  },
  logInfo(message: string) {
    console.log('[INFO]', message)
  },
  trackEvent(_eventName: string, _data?: Record<string, any>) {
    // Could integrate Firebase Analytics or similar
  },
}

const capacitorAudio = {
  async play(_soundId: string) {
    // No-op (handled by app layer)
  },
  async stop(_soundId: string) {
    // No-op
  },
  setVolume(_level: number) {
    // No-op
  },
}

const capacitorDevice = {
  isOnline() {
    return navigator.onLine
  },
  getDeviceInfo() {
    const ua = navigator.userAgent
    return {
      userAgent: ua,
      isMobile: /iPhone|Android/i.test(ua),
      isTablet: /iPad|Android(?!.*Mobile)/i.test(ua),
      isDesktop: false,
      supportsHaptics: true, // Capacitor always provides haptics
      supportsNotifications: true, // Capacitor provides local notifications
    }
  },
  onOrientationChange(callback: (orientation: 'portrait' | 'landscape') => void): () => void {
    const handler = () => {
      const orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      callback(orientation)
    }
    window.addEventListener('orientationchange', handler)
    return () => window.removeEventListener('orientationchange', handler)
  },
}

export function createCapacitorPlatformApi(): PlatformApi {
  return {
    haptics: capacitorHaptics,
    storage: capacitorStorage,
    diagnostics: capacitorDiagnostics,
    audio: capacitorAudio,
    device: capacitorDevice,
    name: 'capacitor',
  }
}
