// Sources: https://patents.google.com/patent/US5966526A/en and
// https://github.com/loociano/tamagotchi-tech-specs/blob/master/index.md

export type VariantId = 'original' | 'angel' | 'ocean'

export interface VariantCapabilities {
  supportsPraise: boolean
  supportsSensorTap: boolean
  supportsPredatorEvents: boolean
  supportsInjury: boolean
  supportsGenetics: boolean
  supportsConnection: boolean
  supportsNetworkContent: boolean
  supportsDownloadTickets: boolean
  supportsCamera: boolean
  supportsTouchUi: boolean
}

export interface VariantUiPage {
  id: string
  label: string
  isDefault?: boolean
}

export interface VariantEventTuning {
  attentionWindowMinutes: number
  decayMultiplier: number
  tickIntervalMinutes: number
}

export interface VariantHiddenState {
  careMistakes: number
  hiddenCounters: Record<string, number>
  hiddenFlags: Record<string, boolean>
}

export type LifeStage = 'egg' | 'baby' | 'child' | 'teen' | 'adult' | 'special' | 'departed'

export type PetMood =
  | 'curious'
  | 'content'
  | 'playful'
  | 'delighted'
  | 'calm'
  | 'sleeping'
  | 'hungry'
  | 'very-hungry'
  | 'needy'
  | 'anxious'
  | 'exhausted'
  | 'sick'
  | 'departed'

export type PetCallType = 'hunger' | 'effort' | 'discipline' | 'praise' | 'lights' | 'sickness'

export type PetActionType =
  | 'tick'
  | 'treat'
  | 'feedMeal'
  | 'feedSnack'
  | 'playGame'
  | 'gamePlay'
  | 'arcadePlay'
  | 'discipline'
  | 'praise'
  | 'cleanPoo'
  | 'medicine'
  | 'lightsOn'
  | 'lightsOff'
  | 'resurrect'
  | 'reset'

export interface PetMeters {
  hunger: number
  effort: number
  happiness: number
  discipline: number
  angelPower: number
  weight: number
}

export interface PetMemory {
  careStreakDays: number
  neglectStreakDays: number
  recoveryStreakDays: number
  lastTrackedDay: number
}

export type AttentionResponseQuality = 'fast' | 'steady' | 'late' | 'missed'

export type DnaTraitId = 'thrifty' | 'spark' | 'resilient' | 'steady'

export interface PetBank {
  balance: number
  earned: number
  spent: number
}

export interface PetGenetics {
  traitId: DnaTraitId
  traitLabel: string
  augmentLabel: string
  augmentDetail: string
  costDiscount: number
  pressureBias: number
  rewardBoost: number
  memorialBonusMinutes: number
}

export type AfterlifePhase = 'alive' | 'memorial' | 'tombstone'

export interface PetResurrectionSnapshot {
  id: string
  variantId: VariantId
  name: string
  lifecycle: PetLifecycle
  stage: Exclude<LifeStage, 'egg' | 'departed'>
  mood: Exclude<PetMood, 'departed'>
  meters: PetMeters
  care: CareMistakes
  sicknessCount: number
  poopCount: number
  attentionActive: boolean
  lightsOn: boolean
  calls: PetCall[]
  memory: PetMemory
  bank?: PetBank
  genetics?: PetGenetics
  history: PetEvent[]
}

export interface PetAfterlife {
  phase: AfterlifePhase
  deathMinute: number | null
  memorialUntilMinute: number | null
  resurrectionCount: number
  preservedState: PetResurrectionSnapshot | null
}

export interface CareMistakes {
  physical: number
  mental: number
  total: number
  stage: number
}

export interface PetCall {
  type: PetCallType
  issuedAtMinute: number
  expiresAtMinute: number
  resolvedAtMinute: number | null
  resolved: boolean
  responseQuality?: AttentionResponseQuality | null
}

export interface PetEvent {
  type: PetActionType | 'evolution' | 'departure' | 'call' | 'state-change'
  minute: number
  detail: string
}

export interface PetLifecycle {
  ageMinutes: number
  stageEnteredAtMinute: number
  generation: number
  resurrectionCount: number
  isSleeping: boolean
  isDeparted: boolean
}

export interface PetState {
  id: string
  variantId: VariantId
  name: string
  lifecycle: PetLifecycle
  stage: LifeStage
  mood: PetMood
  meters: PetMeters
  care: CareMistakes
  sicknessCount: number
  poopCount: number
  attentionActive: boolean
  lightsOn: boolean
  calls: PetCall[]
  memory?: PetMemory
  bank?: PetBank
  genetics?: PetGenetics
  afterlife?: PetAfterlife
  history: PetEvent[]
}

export interface EvolutionOption {
  stage: Exclude<LifeStage, 'egg' | 'departed'>
  label: string
  requires: string
  branch: string
}

export interface EvolutionResult {
  evolved: boolean
  nextStage: LifeStage
  branch: string
  reason: string
}

export interface DecayProfile {
  hungerLoss: number
  happinessLoss: number
  weightLoss: number
}

export interface PetRuntime {
  calculateDecayProfile?: (elapsedMinutes: number) => DecayProfile
}
