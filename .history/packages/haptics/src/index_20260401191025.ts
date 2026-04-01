/**
 * Haptics utility for cross-platform vibration feedback
 * Uses standard Vibration API where available
 * Falls back gracefully if not supported
 */

/**
 * Trigger vibration feedback if supported by the device
 * @param pattern - Single duration (ms) or array of durations for vibration pattern
 *                  For pattern, alternates: vibrate, pause, vibrate, pause...
 *
 * @example
 * // Single vibration
 * vibrate(100)
 *
 * // Vibration pattern: 100ms vibrate, 50ms pause, 200ms vibrate
 * vibrate([100, 50, 200])
 */
export function vibrate(pattern: number | number[]): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

/**
 * Check if device supports vibration
 */
export function isVibrateSupported(): boolean {
  return 'vibrate' in navigator
}
