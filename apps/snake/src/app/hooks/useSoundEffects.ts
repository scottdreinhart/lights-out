/**
 * Sound effect hooks — integrates sounds.ts with SoundContext.
 * Respects prefers-reduced-motion via SoundProvider guard.
 */

import { createUseContextSoundEffectsHook } from '@games/ui-hooks'

import { useSoundContext } from './SoundContext'
import {
  playClick,
  playConfirm,
  playCrash,
  playEat,
  playLose,
  playPause,
  playPowerUp,
  playResume,
  playSelect,
  playWin,
} from './sounds'

export const useSoundEffects = createUseContextSoundEffectsHook({
  useSoundContext,
  sounds: {
    onSelect: playSelect,
    onConfirm: playConfirm,
    onEat: playEat,
    onPowerUp: playPowerUp,
    onCrash: playCrash,
    onWin: playWin,
    onLose: playLose,
    onClick: playClick,
    onPause: playPause,
    onResume: playResume,
  },
})

export type SoundEffects = ReturnType<typeof useSoundEffects>
