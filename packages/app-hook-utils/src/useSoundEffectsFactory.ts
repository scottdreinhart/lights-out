import { useCallback, useMemo, useState } from 'react'

type PlaySound = (fn: () => void) => void
type SoundActionMap = Record<string, () => void>

interface SoundContextLike {
  playSound: PlaySound
}

export interface StandardSoundEffects {
  onSelect: () => void
  onConfirm: () => void
  onCpuMove: () => void
  onWin: () => void
  onLose: () => void
  onClick: () => void
}

export type ToggleableSoundEffects<TActions extends SoundActionMap> = TActions & {
  soundEnabled: boolean
  toggleSound: () => void
}

interface StandardSoundFns {
  playSelect: () => void
  playConfirm: () => void
  playCpuMove: () => void
  playWin: () => void
  playLose: () => void
  playClick: () => void
}

interface CreateUseSoundEffectsConfig {
  useSoundContext: () => SoundContextLike
  sounds: StandardSoundFns
}

interface CreateUseContextSoundEffectsConfig<TActions extends SoundActionMap> {
  useSoundContext: () => SoundContextLike
  sounds: TActions
}

interface CreateUseToggleableSoundEffectsConfig<TActions extends SoundActionMap> {
  actions: TActions
  initialEnabled?: boolean
  respectReducedMotion?: boolean
}

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const createUseContextSoundEffectsHook = <TActions extends SoundActionMap>({
  useSoundContext,
  sounds,
}: CreateUseContextSoundEffectsConfig<TActions>): (() => TActions) => {
  return () => {
    const { playSound } = useSoundContext()

    return useMemo(() => {
      const wrappedEntries = Object.entries(sounds).map(([actionName, playFn]) => [
        actionName,
        () => playSound(playFn),
      ])
      return Object.fromEntries(wrappedEntries) as TActions
    }, [playSound])
  }
}

export const createUseToggleableSoundEffectsHook = <TActions extends SoundActionMap>({
  actions,
  initialEnabled = true,
  respectReducedMotion = false,
}: CreateUseToggleableSoundEffectsConfig<TActions>): (() => ToggleableSoundEffects<TActions>) => {
  return () => {
    const [soundEnabled, setSoundEnabled] = useState(initialEnabled)

    const toggleSound = useCallback(() => {
      setSoundEnabled((current) => !current)
    }, [])

    const canPlay = soundEnabled && (!respectReducedMotion || !prefersReducedMotion())

    const wrappedActions = useMemo(() => {
      const wrappedEntries = Object.entries(actions).map(([actionName, playFn]) => [
        actionName,
        () => {
          if (canPlay) {
            playFn()
          }
        },
      ])
      return Object.fromEntries(wrappedEntries) as TActions
    }, [canPlay])

    return {
      soundEnabled,
      toggleSound,
      ...wrappedActions,
    }
  }
}

export const createUseSoundEffectsHook = ({
  useSoundContext,
  sounds,
}: CreateUseSoundEffectsConfig): (() => StandardSoundEffects) => {
  return () => {
    const { playSound } = useSoundContext()

    return {
      onSelect: useCallback(() => playSound(sounds.playSelect), [playSound]),
      onConfirm: useCallback(() => playSound(sounds.playConfirm), [playSound]),
      onCpuMove: useCallback(() => playSound(sounds.playCpuMove), [playSound]),
      onWin: useCallback(() => playSound(sounds.playWin), [playSound]),
      onLose: useCallback(() => playSound(sounds.playLose), [playSound]),
      onClick: useCallback(() => playSound(sounds.playClick), [playSound]),
    }
  }
}
