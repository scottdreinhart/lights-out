/**
 * useIonicPlatform — Platform detection hook using browser APIs and Capacitor detection.
 *
 * REFACTORED to remove Ionic dependency. Provides semantic information about the current runtime environment:
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
 * Implementation:
 * - Uses User-Agent parsing for OS detection (iOS/Android)
 * - Uses Capacitor API detection for hybrid apps
 * - Uses window.electron detection for Electron
 * - Uses responsive viewport and browser detection for web
 *
 * Alternative to useResponsiveState for OS/runtime detection.
 * Use useResponsiveState for viewport-based (5-tier) layout decisions.
 * Use useIonicPlatform for OS-based (iOS/Android/web) behavior decisions.
 */

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
 * Detect platform info using browser APIs, without Ionic dependency.
 * Caches result since platform doesn't change during app runtime.
 */
let cachedPlatformInfo: IonicPlatformInfo | null = null

function detectPlatform(): IonicPlatformInfo {
  // Parse User-Agent for OS detection
  const ua = typeof window !== 'undefined' ? navigator.userAgent : ''
  const isIOS = /iPad|iPhone|iPod/.test(ua)
  const isAndroid = /Android/.test(ua)
  const isMobileOS = isIOS || isAndroid

  // Detect Electron
  const isElectron =
    typeof window !== 'undefined' &&
    typeof (window as any).electron !== 'undefined'

  // Detect Capacitor/Hybrid
  const isHybrid =
    typeof window !== 'undefined' &&
    typeof (window as any).Capacitor !== 'undefined'

  // Detect PWA
  const isPwa =
    typeof window !== 'undefined' &&
    (navigator.standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches)

  // Web is anything that's not hybrid/electron
  const isWeb = !isHybrid && !isElectron

  // Mobile/tablet detection: use viewport + UA
  const viewport = typeof window !== 'undefined' ? window.innerWidth : 0
  const isMobile = viewport < 600 || /Mobile|Android/.test(ua)
  const isTablet =
    (viewport >= 600 && viewport < 900) ||
    (/iPad/.test(ua) && !/(Mini|Pad)/.test(ua))

  // Mobile web is web browser on mobile device
  const isMobileWeb = isWeb && (isMobile || (isTablet && isMobileOS))

  // Desktop environment: Electron OR web on desktop OR tablet web without mobile OS
  const isDesktopEnvironment =
    isElectron ||
    (isWeb && !isMobileWeb) ||
    (isWeb && isTablet && !isMobileOS)

  return {
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
}

export function useIonicPlatform(): IonicPlatformInfo {
  if (cachedPlatformInfo) {
    return cachedPlatformInfo
  }

  cachedPlatformInfo = detectPlatform()
  return cachedPlatformInfo
}

/**
 * Resets cached platform info (for testing or if platform changes dynamically).
 * Normally not needed since platform is constant during app lifetime.
 */
export function resetPlatformCache() {
  cachedPlatformInfo = null
}
