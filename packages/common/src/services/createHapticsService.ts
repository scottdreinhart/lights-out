/**
 * Haptics service factory — vibration feedback for mobile
 */
export function createHapticsService() {
  const vibrate = (pattern: number | number[] = 20): void => {
    if (typeof window === 'undefined' || !navigator.vibrate) return
    try {
      navigator.vibrate(pattern)
    } catch {
      console.warn('Haptics not supported')
    }
  }

  return {
    vibrate,
    tick: () => vibrate(20),
    tap: () => vibrate(40),
    heavy: () => vibrate(100),
    success: () => vibrate([100, 50, 100]),
    error: () => vibrate([200, 100, 200]),
  }
}
