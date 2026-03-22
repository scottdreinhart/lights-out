/**
 * useIonicPlatform — Platform detection hook using Ionic's isPlatform() utilities.
 *
 * Provides semantic information about the current runtime environment:
 * - Device category (mobile, tablet, desktop)
 * - Operating system (iOS, Android)
 * - Runtime environment (web, Electron, hybrid Capacitor)
 *
 * Usage:
 * const platform = useIonicPlatform()
 * if (platform.isMobileDevice) {
 *   // Render mobile-optimized UI
 * }
 *
 * Benefits:
 * 1. Ionic's platform detection is more reliable than matchMedia alone
 * 2. Distinguishes between actual mobile OS (iOS/Android) vs responsive web
 * 3. Integrates with Capacitor for hybrid app detection
 * 4. Works across Web, Electron, iOS, and Android
 *
 * Alternative to useResponsiveState for OS/runtime detection.
 * Use useResponsiveState for viewport-based (5-tier) layout decisions.
 * Use useIonicPlatform for OS-based (iOS/Android/web) behavior decisions.
 */

import { isPlatform } from '@ionic/react'

export interface IonicPlatformInfo {
  /** True if running on actual mobile OS (iOS or Android) */
  isMobileDevice: boolean
  /** True if running on iOS (iPhone, iPad) */
  isIOS: boolean
  /** True if running on Android */
  isAndroid: boolean
  /** True if running in a web browser (not native/Electron) */
  isWeb: boolean
  /** True if running in Electron (desktop app) */
  isElectron: boolean
  /** True if running in Capacitor hybrid wrapper (iOS/Android native container) */
  isHybrid: boolean
  /** True if running on tablet (Capacitor mobile OR responsive tablet breakpoint) */
  isTablet: boolean
  /** True if running on mobile phone device */
  isMobile: boolean
  /** True if running in desktop-like environment (web desktop, Electron, macOS app) */
  isDesktopEnvironment: boolean
}

/**
 * Detects the current platform using Ionic's isPlatform() utilities.
 * Caches result since platform doesn't change during app runtime.
 */
let cachedPlatformInfo: IonicPlatformInfo | null = null

export function useIonicPlatform(): IonicPlatformInfo {
  if (cachedPlatformInfo) {
    return cachedPlatformInfo
  }

  const isMobileOS = isPlatform('ios') || isPlatform('android')
  const isIOS = isPlatform('ios')
  const isAndroid = isPlatform('android')
  const isElectron = isPlatform('electron')
  const isHybrid = isPlatform('hybrid')
  const isMobileWeb = isPlatform('mobileweb')
  const isPwa = isPlatform('pwa')
  const isWeb = isMobileWeb || isPwa || (!isHybrid && !isElectron)
  const isTablet = isPlatform('tablet')
  const isMobile = isPlatform('mobile')

  // Determine environment context
  const isDesktopEnvironment =
    isElectron || // Electron app (Windows/Linux/macOS desktop)
    (isWeb && !isMobile) || // Web browser on desktop
    (isWeb && isTablet && !isMobileOS) // Web browser on tablet (not iOS iPad mini)

  cachedPlatformInfo = {
    isMobileDevice: isMobileOS,
    isIOS,
    isAndroid,
    isWeb,
    isElectron,
    isHybrid,
    isTablet,
    isMobile,
    isDesktopEnvironment,
  }

  return cachedPlatformInfo
}

/**
 * Resets cached platform info (for testing or if platform changes dynamically).
 * Normally not needed since platform is constant during app lifetime.
 */
export function resetPlatformCache() {
  cachedPlatformInfo = null
}
