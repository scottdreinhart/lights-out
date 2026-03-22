import { usePlayableSoundActions } from '@games/app-hook-utils'
import { useMemo } from 'react'

import { useSoundContext } from '../context/SoundContext.tsx'
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
  const actions = useMemo(
    () => ({
      onSelect: playSelect,
      onConfirm: playConfirm,
      onCpuMove: playCpuMove,
      onWin: playWin,
      onLose: playLose,
      onClick: playClick,
    }),
    [],
  )

  const bound = usePlayableSoundActions(playSound, actions)

  return bound
}
