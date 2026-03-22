import { useMemo } from 'react'

import { usePlayableSoundActions, useSoundController } from '@games/app-hook-utils'

/**
 * Generic sound action map: each action is a function that triggers a sound
 * Example: { onSelect: () => playSelect(), onWin: () => playWin() }
 */
type SoundAction = () => void | Promise<void>
export type SoundActionMap<T extends string = string> = Record<T, SoundAction>

/**
 * Hook configuration for loading/persisting sound enabled state
 */
export interface UseSoundEffectsConfig<T extends string = string> {
  soundActions: SoundActionMap<T>
  storageKey?: string
  initialEnabled?: boolean
}

/**
 * Generic useSoundEffects factory
 *
 * Combines useSoundController (manages enabled/disabled state, respects prefers-reduced-motion)
 * with usePlayableSoundActions (binds game-specific sound actions to the controller)
 *
 * Usage:
 * ```
 * const soundActions = useMemo(() => ({
 *   onSelect: () => playSelect(),
 *   onWin: () => playWin(),
 *   onLose: () => playLose(),
 * }), [])
 *
 * const { onSelect, onWin, onLose, soundEnabled, toggleSound } = useSoundEffects({
 *   soundActions,
 *   storageKey: 'my-game-sound',
 * })
 * ```
 *
 * @returns Bound sound actions + controller interface
 */
export const useSoundEffects = <T extends string>({
  soundActions,
  storageKey,
  initialEnabled = true,
}: UseSoundEffectsConfig<T>) => {
  const storage = useMemo(
    () => ({
      load: () => {
        if (!storageKey) return undefined
        try {
          return localStorage.getItem(storageKey) === 'true'
        } catch {
          return undefined
        }
      },
      persist: (enabled: boolean) => {
        if (!storageKey) return
        try {
          localStorage.setItem(storageKey, enabled ? 'true' : 'false')
        } catch {
          // Silent fail on storage errors (privacy mode, quota exceeded, etc)
        }
      },
    }),
    [storageKey]
  )

  const controller = useSoundController({
    initialEnabled,
    loadEnabled: () => storage.load() ?? initialEnabled,
    persistEnabled: storage.persist,
  })

  // Bind game-specific actions to the controller's runIfPlayable
  const boundActions = usePlayableSoundActions(controller.runIfPlayable, soundActions)

  return {
    ...boundActions,
    soundEnabled: controller.soundEnabled,
    toggleSound: controller.toggleSound,
    setSoundEnabled: controller.setSoundEnabled,
  }
}

export default useSoundEffects
