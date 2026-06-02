// Sources: https://patents.google.com/patent/US5966526A/en and
// https://github.com/loociano/tamagotchi-tech-specs/blob/master/index.md

import type { PetMemory, PetState } from './types'

export function createPetMemory(): PetMemory {
  return {
    careStreakDays: 0,
    neglectStreakDays: 0,
    recoveryStreakDays: 0,
    lastTrackedDay: 0,
  }
}

export function getPetMemory(state: PetState): PetMemory {
  return state.memory ?? createPetMemory()
}

export function updatePetMemory(state: PetState, nextDay: number, caredWell: boolean): PetMemory {
  const memory = getPetMemory(state)

  if (caredWell) {
    return {
      careStreakDays: memory.careStreakDays + 1,
      neglectStreakDays: 0,
      recoveryStreakDays:
        memory.neglectStreakDays > 0 ? memory.recoveryStreakDays + 1 : memory.recoveryStreakDays,
      lastTrackedDay: nextDay,
    }
  }

  return {
    careStreakDays: 0,
    neglectStreakDays: memory.neglectStreakDays + 1,
    recoveryStreakDays: 0,
    lastTrackedDay: nextDay,
  }
}
