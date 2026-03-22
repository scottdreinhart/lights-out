/**
 * Browser Platform Adapter
 * Implements PlatformApi using standard Web APIs
 */

import type { PlatformApi } from '../../contracts'

const browserHaptics = {
  async light() {
    if (navigator.vibrate) navigator.vibrate(10)
  },
  async medium() {
    if (navigator.vibrate) navigator.vibrate(20)
  },
  async heavy() {
    if (navigator.vibrate) navigator.vibrate(50)
  },
}

const browserStorage = {
  async getItem(key: string) {
    return localStorage.getItem(key)
  },
  async setItem(key: string, value: string) {
    localStorage.setItem(key, value)
  },
  async removeItem(key: string) {
    localStorage.removeItem(key)
  },
  async clear() {
    localStorage.clear()
  },
}

const browserDiagnostics = {
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
    // No-op in browser; could integrate analytics service
  },
}

const browserAudio = {
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

const browserDevice = {
  isOnline() {
    return navigator.onLine
  },
  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      isMobile: /iPhone|iPad|Android/i.test(navigator.userAgent),
      isTablet: /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent),
      isDesktop: !/iPhone|iPad|Android/i.test(navigator.userAgent),
      supportsHaptics: !!navigator.vibrate,
      supportsNotifications: !!('Notification' in window),
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

export function createBrowserPlatformApi(): PlatformApi {
  return {
    haptics: browserHaptics,
    storage: browserStorage,
    diagnostics: browserDiagnostics,
    audio: browserAudio,
    device: browserDevice,
    name: 'web',
  }
}
