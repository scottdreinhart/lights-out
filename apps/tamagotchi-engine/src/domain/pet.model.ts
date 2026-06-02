// Sources: https://patents.google.com/patent/US5966526A/en and
// https://tamagotchi.fandom.com/wiki/Care

import { createPetAfterlife } from './afterlife'
import { DEFAULT_GENERATION, DEFAULT_PET_NAME, INITIAL_METERS } from './constants'
import { createPetBank, createPetGenetics } from './economy'
import { createPetMemory } from './memory'
import type {
  CareMistakes,
  PetCall,
  PetEvent,
  PetLifecycle,
  PetMeters,
  PetMood,
  PetState,
  VariantId,
} from './types'

function createEmptyCare(): CareMistakes {
  return {
    physical: 0,
    mental: 0,
    total: 0,
    stage: 0,
  }
}

export function createPetCall(
  type: PetCall['type'],
  issuedAtMinute: number,
  expiresAtMinute: number,
): PetCall {
  return {
    type,
    issuedAtMinute,
    expiresAtMinute,
    resolvedAtMinute: null,
    resolved: false,
    responseQuality: null,
  }
}

export function createPetEvent(type: PetEvent['type'], minute: number, detail: string): PetEvent {
  return { type, minute, detail }
}

export function cloneMeters(meters: PetMeters): PetMeters {
  return { ...meters }
}

export function cloneLifecycle(lifecycle: PetLifecycle): PetLifecycle {
  return { ...lifecycle }
}

export function createInitialPetState(
  variantId: VariantId,
  petName: string = DEFAULT_PET_NAME,
): PetState {
  return {
    id: `${variantId}-generation-${DEFAULT_GENERATION}`,
    variantId,
    name: petName,
    lifecycle: {
      ageMinutes: 0,
      stageEnteredAtMinute: 0,
      generation: DEFAULT_GENERATION,
      resurrectionCount: 0,
      isSleeping: false,
      isDeparted: false,
    },
    stage: 'egg',
    mood: 'content',
    meters: cloneMeters(INITIAL_METERS),
    care: createEmptyCare(),
    sicknessCount: 0,
    poopCount: 0,
    attentionActive: false,
    lightsOn: true,
    calls: [],
    memory: createPetMemory(),
    bank: createPetBank(),
    genetics: createPetGenetics(variantId, petName),
    afterlife: createPetAfterlife(),
    history: [createPetEvent('state-change', 0, `Created ${variantId} lifecycle for ${petName}`)],
  }
}

export function appendEvent(state: PetState, event: PetEvent): PetState {
  return {
    ...state,
    history: [...state.history, event],
  }
}

export function replaceMeters(state: PetState, meters: PetMeters): PetState {
  return {
    ...state,
    meters,
  }
}

export type { PetState } from './types'
export type MoodType = PetMood
