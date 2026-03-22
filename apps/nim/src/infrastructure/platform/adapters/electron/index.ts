/**
 * Electron Platform Adapter
 * Implements PlatformApi using Electron APIs (with fallbacks)
 */

import type { PlatformApi } from '../../contracts'

const electronHaptics = {
  async light() {
    // Electron doesn't have native haptics; no-op
  },
  async medium() {
    // No-op
  },
  async heavy() {
    // No-op
  },
}

const electronStorage = {
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

const electronDiagnostics = {
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
    // No-op
  },
}

const electronAudio = {
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

const electronDevice = {
  isOnline() {
    return navigator.onLine
  },
  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      supportsHaptics: false,
      supportsNotifications: !!('Notification' in window),
    }
  },
  onOrientationChange(_callback: (orientation: 'portrait' | 'landscape') => void): () => void {
    // Desktop doesn't rotate; return no-op unsubscribe
    return () => {}
  },
}

export function createElectronPlatformApi(): PlatformApi {
  return {
    haptics: electronHaptics,
    storage: electronStorage,
    diagnostics: electronDiagnostics,
    audio: electronAudio,
    device: electronDevice,
    name: 'electron',
  }
}
