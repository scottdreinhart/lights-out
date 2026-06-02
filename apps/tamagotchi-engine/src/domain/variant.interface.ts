// Sources: https://github.com/loociano/tamagotchi-tech-specs/blob/master/index.md
// and https://patents.google.com/patent/US5966526A/en

import type {
  EvolutionResult,
  PetActionType,
  PetCallType,
  PetState,
  VariantCapabilities,
  VariantEventTuning,
  VariantHiddenState,
  VariantId,
  VariantUiPage,
} from './types'

export interface VariantProfile {
  id: VariantId
  name: string
  description: string
  attentionCallType: PetCallType
  baseAttentionWindowMinutes: number
  capabilities: VariantCapabilities
  uiPages: readonly VariantUiPage[]
  eventTuning: VariantEventTuning
  hiddenState?: VariantHiddenState
  performTick: (state: PetState, elapsedMinutes: number) => PetState
  resolveAction: (state: PetState, action: PetActionType) => PetState
  evaluateEvolution: (state: PetState) => EvolutionResult
}

export interface VariantRegistry {
  original: VariantProfile
  angel: VariantProfile
  ocean: VariantProfile
}
