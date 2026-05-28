// Sources: https://tamagotchi.fandom.com/wiki/Tamagotchi_Angel and
// https://tamagotchi.fandom.com/wiki/Training

import type { PetActionType, PetState, VariantId, VariantProfile } from '@/domain'

export interface EngineControls {
  dispatch: (action: PetActionType, payload?: { won?: boolean }) => void
  tick: (elapsedMinutes?: number) => void
  reset: (variantId?: VariantId) => void
  resurrect: () => void
  setVariant: (variantId: VariantId) => void
}

export interface EngineSnapshot {
  state: PetState
  controls: EngineControls
  paused: boolean
  variant: VariantProfile
}
