// Sources: https://patents.google.com/patent/US5966526A/en and
// https://github.com/loociano/tamagotchi-tech-specs/blob/master/index.md

import { advancePetAfterlife, applyPetDeparture, isPetAlive } from './afterlife'
import { REAL_WORLD_MINUTES_PER_DAY, VARIANT_LIFE_EXPECTANCY_DAYS } from './constants'
import { creditPetBank, getPetGenetics } from './economy'
import { getPetMemory, updatePetMemory } from './memory'
import { createPetEvent } from './pet.model'
import type { PetState, VariantId } from './types'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function getPetAgeInDays(state: PetState): number {
  return state.lifecycle.ageMinutes / REAL_WORLD_MINUTES_PER_DAY
}

export function getPetDayNumber(state: PetState): number {
  return Math.floor(getPetAgeInDays(state)) + 1
}

export function getPetLifeExpectancyDays(variantId: VariantId): number {
  return VARIANT_LIFE_EXPECTANCY_DAYS[variantId]
}

export function getPetLifeProgress(state: PetState): number {
  const lifeExpectancyDays = getPetLifeExpectancyDays(state.variantId)
  return clamp((getPetAgeInDays(state) / lifeExpectancyDays) * 100, 0, 100)
}

export function shouldPetDepartFromAge(state: PetState): boolean {
  return getPetAgeInDays(state) >= getPetLifeExpectancyDays(state.variantId)
}

export function applyDayTransition(
  state: PetState,
  nextMinute: number,
  dayNumber: number,
): PetState {
  if (!isPetAlive(state)) {
    return state
  }

  const memory = getPetMemory(state)
  const caredWell =
    state.care.total === 0 &&
    state.sicknessCount === 0 &&
    state.poopCount === 0 &&
    !state.attentionActive

  const nextMemory = updatePetMemory(state, dayNumber, caredWell)
  const genetics = getPetGenetics(state)
  const bankBonus = caredWell ? 1 + (nextMemory.careStreakDays >= 3 ? 1 : 0) : 0
  const nextBank =
    bankBonus > 0
      ? creditPetBank(state, bankBonus + (genetics.traitId === 'thrifty' ? 1 : 0))
      : state.bank
  const dayLabel = `Day ${dayNumber}`

  return {
    ...state,
    memory: nextMemory,
    bank: nextBank,
    history: [
      ...state.history,
      createPetEvent(
        'state-change',
        nextMinute,
        `${dayLabel} began; ${caredWell ? 'bank grew and care streak strengthened' : 'pressure carried over'}`,
      ),
      ...(memory.neglectStreakDays > 0 && caredWell
        ? [
            createPetEvent(
              'state-change',
              nextMinute,
              `${dayLabel} recovery streak started after ${memory.neglectStreakDays} neglected day(s)`,
            ),
          ]
        : []),
    ],
  }
}

export function applyLifeExpectancyDeparture(state: PetState, minute: number): PetState {
  if (!isPetAlive(state) || !shouldPetDepartFromAge(state)) {
    return state
  }

  return applyPetDeparture(
    state,
    minute,
    `Life expectancy reached at ${getPetAgeInDays(state).toFixed(1)} day(s)`,
  )
}

export function applyMemorialProgress(state: PetState, minute: number): PetState {
  return advancePetAfterlife(state, minute)
}
