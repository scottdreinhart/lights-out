import {
  advanceTimer,
  createPetLifecycle,
  type PetRuntime,
  type PetState,
  type VariantId,
} from '@/domain'

import { load, remove, save } from './storageService'

const STORAGE_KEY = 'tamagotchi-engine-session'
const REAL_WORLD_MINUTE_MS = 60_000
const PERSISTENCE_VERSION = 1

export interface PersistedTamagotchiSession {
  version: number
  savedAtMs: number
  state: PetState
}

export interface LoadedTamagotchiSession {
  state: PetState
  savedAtMs: number
  offlineCatchUpMinutes: number
}

export function loadTamagotchiSession(
  initialVariantId: VariantId,
  runtime?: PetRuntime,
): LoadedTamagotchiSession {
  const fallbackState = createPetLifecycle(initialVariantId)
  const stored = load<PersistedTamagotchiSession>(STORAGE_KEY, null)

  if (!stored || stored.version !== PERSISTENCE_VERSION) {
    return {
      state: fallbackState,
      savedAtMs: Date.now(),
      offlineCatchUpMinutes: 0,
    }
  }

  const offlineCatchUpMinutes = Math.max(
    0,
    Math.floor((Date.now() - stored.savedAtMs) / REAL_WORLD_MINUTE_MS),
  )

  if (offlineCatchUpMinutes <= 0) {
    return {
      state: stored.state,
      savedAtMs: stored.savedAtMs,
      offlineCatchUpMinutes: 0,
    }
  }

  const nextState = advanceTimer(
    stored.state,
    offlineCatchUpMinutes,
    stored.state.lifecycle.ageMinutes + offlineCatchUpMinutes,
    runtime,
  )

  return {
    state: nextState,
    savedAtMs: Date.now(),
    offlineCatchUpMinutes,
  }
}

export function saveTamagotchiSession(state: PetState, savedAtMs: number = Date.now()): void {
  save(STORAGE_KEY, {
    version: PERSISTENCE_VERSION,
    savedAtMs,
    state,
  } satisfies PersistedTamagotchiSession)
}

export function clearTamagotchiSession(): void {
  remove(STORAGE_KEY)
}
