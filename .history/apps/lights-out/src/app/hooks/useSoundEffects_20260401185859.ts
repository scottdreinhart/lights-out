import { useCallback } from 'react'

import { useSoundContext } from '../SoundContext'
import {
  playClick,
  playConfirm,
  playCpuMove,
  playLose,
  playSelect,
  playWin,
} from '../services/sounds.ts'

export interface SoundEffects {
  onSelect: () => void
  onConfirm: () => void
  onCpuMove: () => void
  onWin: () => void
  onLose: () => void
  onClick: () => void
}

export function useSoundEffects(): SoundEffects {
  const { playSound } = useSoundContext()

  return {
    onSelect: useCallback(() => playSound(playSelect), [playSound]),
    onConfirm: useCallback(() => playSound(playConfirm), [playSound]),
    onCpuMove: useCallback(() => playSound(playCpuMove), [playSound]),
    onWin: useCallback(() => playSound(playWin), [playSound]),
    onLose: useCallback(() => playSound(playLose), [playSound]),
    onClick: useCallback(() => playSound(playClick), [playSound]),
  }
}
