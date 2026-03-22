/**
 * Haptic Feedback Service
 * Platform-agnostic vibration/haptics wrapper
 */

import { resolvePlatformApi } from '../platform/resolvePlatformApi'

export const haptics = {
  /**
   * Light haptic feedback (quick, subtle vibration)
   */
  async light(): Promise<void> {
    const platform = resolvePlatformApi()
    await platform.haptics.light()
  },

  /**
   * Medium haptic feedback (standard vibration)
   */
  async medium(): Promise<void> {
    const platform = resolvePlatformApi()
    await platform.haptics.medium()
  },

  /**
   * Heavy haptic feedback (strong, prolonged vibration)
   */
  async heavy(): Promise<void> {
    const platform = resolvePlatformApi()
    await platform.haptics.heavy()
  },

  /**
   * Success pattern (light + medium)
   */
  async success(): Promise<void> {
    const platform = resolvePlatformApi()
    await platform.haptics.light()
    await new Promise((r) => setTimeout(r, 50))
    await platform.haptics.medium()
  },

  /**
   * Error pattern (heavy + heavy)
   */
  async error(): Promise<void> {
    const platform = resolvePlatformApi()
    await platform.haptics.heavy()
    await new Promise((r) => setTimeout(r, 100))
    await platform.haptics.heavy()
  },
}
