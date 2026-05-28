/**
 * Sound effect hooks — integrates sounds.ts with SoundContext.
 */

import { createUseSoundEffectsHook, type StandardSoundEffects } from '@games/ui-hooks'

import { useSoundContext } from '../SoundContext'
import { playClick, playConfirm, playCpuMove, playLose, playSelect, playWin } from '../sounds'

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

export default useSoundEffects
