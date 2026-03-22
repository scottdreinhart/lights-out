/**
 * Platform detection — Electron, Capacitor (Android/iOS), or Web
 * Use this to branch logic for native APIs
 */

import { Capacitor } from '@capacitor/core'

export type Platform = 'electron' | 'capacitor-android' | 'capacitor-ios' | 'web'

interface PlatformInfo {
  platform: Platform
  isElectron: boolean
  isCapacitor: boolean
  isWeb: boolean
  isNative: boolean // Electron or Capacitor
}

/**
 * Detect runtime platform
 * Priority: Electron > Capacitor > Web
 */
export const usePlatform = (): PlatformInfo => {
  // Check Electron first
  const isElectron =
    typeof window !== 'undefined' &&
    typeof (window as any).electron !== 'undefined'

  if (isElectron) {
    return {
      platform: 'electron',
      isElectron: true,
      isCapacitor: false,
      isWeb: false,
      isNative: true,
    }
  }

  // Check Capacitor second
  const isCapacitor = Capacitor.isNativePlatform()
  if (isCapacitor) {
    const capPlatform = Capacitor.getPlatform()
    const platform =
      capPlatform === 'android'
        ? ('capacitor-android' as const)
        : capPlatform === 'ios'
          ? ('capacitor-ios' as const)
          : ('web' as const)

    return {
      platform,
      isElectron: false,
      isCapacitor: true,
      isWeb: platform === 'web',
      isNative: platform !== 'web',
    }
  }

  // Default: Web
  return {
    platform: 'web',
    isElectron: false,
    isCapacitor: false,
    isWeb: true,
    isNative: false,
  }
}
