/**
 * Cross-platform haptics — Capacitor haptics + audio feedback
 * Integrates native vibration (Android/iOS) with sound effects (all platforms)
 */

import { useCallback } from 'react'
import { usePlatform } from './usePlatform'
import { useCapacitorHaptics } from './useCapacitor'
import { useSoundEffects } from './useSoundEffects'

interface HapticFeedback {
  select: () => Promise<void>
  confirm: () => Promise<void>
  cpuMove: () => Promise<void>
  win: () => Promise<void>
  lose: () => Promise<void>
  vibrate: (duration?: number) => Promise<void>
  light: () => Promise<void>
  medium: () => Promise<void>
  strong: () => Promise<void>
}

/**
 * useHaptics - Unified haptic feedback across all platforms
 *
 * - Capacitor (Android/iOS): Uses native vibration + sound
 * - Electron: Sound feedback only
 * - Web: Sound feedback only
 *
 * Example:
 *   const haptics = useHaptics()
 *   await haptics.select()    // Light vibrate + sound
 *   await haptics.confirm()   // Strong vibrate + sound
 */
export const useHaptics = (): HapticFeedback => {
  const { isCapacitor } = usePlatform()
  const capacitorHaptics = useCapacitorHaptics()
  const sounds = useSoundEffects()

  const select = useCallback(async () => {
    sounds.onSelect()
    if (isCapacitor) {
      await capacitorHaptics.vibrate(30)
    }
  }, [isCapacitor, capacitorHaptics, sounds])

  const confirm = useCallback(async () => {
    sounds.onConfirm()
    if (isCapacitor) {
      await capacitorHaptics.vibrate(80)
    }
  }, [isCapacitor, capacitorHaptics, sounds])

  const cpuMove = useCallback(async () => {
    sounds.onCpuMove()
    if (isCapacitor) {
      await capacitorHaptics.vibrate(50)
    }
  }, [isCapacitor, capacitorHaptics, sounds])

  const win = useCallback(async () => {
    sounds.onWin()
    if (isCapacitor) {
      // Multi-pulse win pattern
      await capacitorHaptics.vibrate(100)
      await new Promise((r) => setTimeout(r, 100))
      await capacitorHaptics.vibrate(100)
    }
  }, [isCapacitor, capacitorHaptics, sounds])

  const lose = useCallback(async () => {
    sounds.onLose()
    if (isCapacitor) {
      // Double pulse lose pattern
      await capacitorHaptics.vibrate(50)
      await new Promise((r) => setTimeout(r, 50))
      await capacitorHaptics.vibrate(50)
    }
  }, [isCapacitor, capacitorHaptics, sounds])

  const vibrate = useCallback(
    async (duration = 50) => {
      if (isCapacitor) {
        await capacitorHaptics.vibrate(duration)
      }
    },
    [isCapacitor, capacitorHaptics],
  )

  const light = useCallback(async () => {
    sounds.onClick()
    if (isCapacitor) {
      await capacitorHaptics.vibrate(20)
    }
  }, [isCapacitor, capacitorHaptics, sounds])

  const medium = useCallback(async () => {
    sounds.onClick()
    if (isCapacitor) {
      await capacitorHaptics.vibrate(50)
    }
  }, [isCapacitor, capacitorHaptics, sounds])

  const strong = useCallback(async () => {
    sounds.onConfirm()
    if (isCapacitor) {
      await capacitorHaptics.vibrate(100)
    }
  }, [isCapacitor, capacitorHaptics, sounds])

  return { select, confirm, cpuMove, win, lose, vibrate, light, medium, strong }
}
