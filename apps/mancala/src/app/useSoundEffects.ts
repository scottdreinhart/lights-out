/**
 * Sound effect hooks — integrates sounds.ts with SoundContext.
 * Respects prefers-reduced-motion via SoundProvider guard.
 */

import { createUseSoundEffectsHook, type StandardSoundEffects } from '@games/app-hook-utils'

import { useSoundContext } from './SoundContext'
import { playClick, playConfirm, playCpuMove, playLose, playSelect, playWin } from './sounds'

export type SoundEffects = StandardSoundEffects

export const useSoundEffects = createUseSoundEffectsHook({
  useSoundContext,
  sounds: {
    playSelect,
    playConfirm,
    playCpuMove,
    playWin,
    playLose,
    playClick,
  },
})
