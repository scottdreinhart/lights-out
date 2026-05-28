// Sources: https://patents.google.com/patent/US5966526A/en and
// https://github.com/loociano/tamagotchi-tech-specs/blob/master/index.md

export {
  MEMORIAL_WINDOW_MINUTES,
  advancePetAfterlife,
  applyPetDeparture,
  createPetAfterlife,
  getPetAfterlife,
  isPetAlive,
  isPetInMemorial,
  isPetTombstone,
  resurrectPet,
} from './afterlife'
export {
  arcadePlay,
  cleanPoo,
  feedMeal,
  feedSnack,
  gamePlay,
  playGame,
  treatPet,
} from './care.system'
export {
  ANGEL_STAGE_MINUTES,
  ATTENTION_WINDOW_MINUTES,
  DEFAULT_GENERATION,
  DEFAULT_PET_NAME,
  INITIAL_METERS,
  MAX_DISCIPLINE,
  MAX_HEARTS,
  MAX_WEIGHT,
  OCEAN_STAGE_MINUTES,
  ORIGINAL_STAGE_MINUTES,
  REAL_WORLD_MINUTES_PER_DAY,
  STAGE_ORDER,
  VARIANT_IDS,
} from './constants'
export { disciplinePet, praisePet } from './discipline.system'
export {
  createPetBank,
  createPetGenetics,
  creditPetBank,
  debitPetBank,
  getActionPrice,
  getBankMemo,
  getBankPressure,
  getPetBank,
  getPetGenetics,
} from './economy'
export { evaluateEvolution } from './evolution.engine'
export {
  cureSickness,
  decayHealth,
  getAttentionIncome,
  getAttentionResponseQuality,
  markPoo,
} from './health.system'
export {
  applyLifeExpectancyDeparture,
  applyMemorialProgress,
  getPetAgeInDays,
  getPetDayNumber,
  getPetLifeExpectancyDays,
  getPetLifeProgress,
  shouldPetDepartFromAge,
} from './lifecycle'
export { createPetMemory, getPetMemory, updatePetMemory } from './memory'
export { derivePetMood } from './mood.system'
export { createInitialPetState, createPetCall, createPetEvent } from './pet.model'
export { createPetLifecycle, dispatchPetAction } from './pet.state-machine'
export { buildTamagotchiSignalProfile, getTamagotchiDecisionHint } from './signals'
export { advanceTimer } from './timer.engine'
export type {
  CareMistakes,
  DecayProfile,
  DnaTraitId,
  EvolutionOption,
  EvolutionResult,
  LifeStage,
  PetActionType,
  PetBank,
  PetCall,
  PetCallType,
  PetEvent,
  PetGenetics,
  PetLifecycle,
  PetMemory,
  PetMeters,
  PetMood,
  PetRuntime,
  PetState,
  VariantCapabilities,
  VariantEventTuning,
  VariantHiddenState,
  VariantId,
  VariantUiPage,
} from './types'
export type { VariantProfile, VariantRegistry } from './variant.interface'
export {
  angelVariant,
  getVariantProfile,
  oceanVariant,
  originalVariant,
  variantRegistry,
} from './variants'
