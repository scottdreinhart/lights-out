/**
 * Sound effect hooks — integrates sounds.ts with SoundContext.
 * Respects prefers-reduced-motion via SoundProvider guard.
 */

import { createUseContextSoundEffectsHook } from '@games/ui-hooks'

import { useSoundContext } from '@games/sound-context'
import {
  playBunco,
  playClick,
  playConfirm,
  playCpuMove,
  playDiceRoll,
  playLose,
  playSelect,
  playWin,
} from '../sounds'

export const useSoundEffects = createUseContextSoundEffectsHook({
  useSoundContext,
  sounds: {
    onSelect: playSelect,
    onConfirm: playConfirm,
    onCpuMove: playCpuMove,
    onWin: playWin,
    onLose: playLose,
    onClick: playClick,
    onDiceRoll: playDiceRoll,
    onBunco: playBunco,
  },
})

export type SoundEffects = ReturnType<typeof useSoundEffects>
