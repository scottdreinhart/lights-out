import { createUseToggleableSoundEffectsHook } from '@games/ui-hooks'
import { playClick, playExplosion, playReveal, playWin } from '../sounds'

export const useSoundEffects = createUseToggleableSoundEffectsHook({
  actions: {
    click: playClick,
    reveal: playReveal,
    explosion: playExplosion,
    win: playWin,
  },
})
