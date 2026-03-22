import { useCallback } from 'react'

type PlaySound = (fn: () => void) => void

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