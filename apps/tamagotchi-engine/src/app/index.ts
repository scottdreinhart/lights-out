// Sources: https://tamagotchi.fandom.com/wiki/Care and
// https://patents.google.com/patent/US5966526A/en

export { clearTamagotchiSession, loadTamagotchiSession, saveTamagotchiSession } from './persistence'
export * from './storageService'
export type { EngineControls, EngineSnapshot } from './types'
export * from './hooks'
