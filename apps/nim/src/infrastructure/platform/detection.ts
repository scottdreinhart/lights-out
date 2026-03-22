/**
 * Platform Detection
 * Determine which platform runtime we're on
 */

export type DetectedPlatform = 'web' | 'electron' | 'capacitor'

export function detectPlatform(): DetectedPlatform {
  // Check for Electron
  if (typeof window !== 'undefined' && (window as any).__ELECTRON_PRELOAD__) {
    return 'electron'
  }

  // Check for Capacitor
  if (typeof window !== 'undefined' && (window as any).Capacitor) {
    return 'capacitor'
  }

  // Default to web
  return 'web'
}
