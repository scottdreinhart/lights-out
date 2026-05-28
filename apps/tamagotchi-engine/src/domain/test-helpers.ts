/**
 * Test helpers for tamagotchi-engine domain tests.
 * Provides factory functions and test data builders for consistent test setup.
 *
 * Usage:
 * - Use `createTestPet()` variants to set up pet state with specific conditions
 * - Use `advancePet()` to simulate time passing and state changes
 * - Use `assertMeterRange()` to validate meters are within expected bounds
 */

import { MAX_HEARTS, MAX_WEIGHT } from './constants'
import { createInitialPetState, dispatchPetAction } from './index'
import type { PetMood, PetState, VariantId } from './types'

/**
 * Create a fresh pet in the egg stage (default test starting point)
 */
export function createTestPet(variant: VariantId = 'original', name: string = 'TestPet'): PetState {
  return createInitialPetState(variant, name)
}

/**
 * Create a hungry pet (hunger meter at 0, active hunger call)
 */
export function createHungryPet(variant: VariantId = 'original'): PetState {
  const state = createInitialPetState(variant)
  return {
    ...state,
    meters: {
      ...state.meters,
      hunger: 0,
    },
    attentionActive: true,
    calls: [
      {
        type: 'hunger',
        issuedAtMinute: 0,
        expiresAtMinute: 15,
        resolvedAtMinute: null,
        resolved: false,
      },
    ],
  }
}

/**
 * Create a happy, well-fed pet with good discipline
 */
export function createHealthyPet(variant: VariantId = 'original'): PetState {
  const state = createInitialPetState(variant)
  return {
    ...state,
    meters: {
      hunger: MAX_HEARTS,
      effort: MAX_HEARTS,
      happiness: MAX_HEARTS,
      discipline: 75,
      angelPower: 25,
      weight: 20,
    },
    lifecycle: {
      ...state.lifecycle,
      ageMinutes: 50, // Close to baby stage for original
    },
  }
}

/**
 * Create a neglected pet with low meters and active calls
 */
export function createNeglectedPet(variant: VariantId = 'original'): PetState {
  const state = createInitialPetState(variant)
  return {
    ...state,
    meters: {
      hunger: 0,
      effort: 0,
      happiness: 1,
      discipline: 0,
      angelPower: 0,
      weight: 3,
    },
    attentionActive: true,
    calls: [
      {
        type: 'hunger',
        issuedAtMinute: 0,
        expiresAtMinute: 15,
        resolvedAtMinute: null,
        resolved: false,
      },
      {
        type: 'effort',
        issuedAtMinute: 0,
        expiresAtMinute: 15,
        resolvedAtMinute: null,
        resolved: false,
      },
    ],
    lifecycle: {
      ...state.lifecycle,
      careMistakes: {
        physical: 10,
        mental: 10,
        total: 20,
        stage: 2,
      },
    },
  }
}

/**
 * Create a pet in a specific life stage (for testing evolution)
 */
export function createPetInStage(
  variant: VariantId = 'original',
  stage: 'egg' | 'baby' | 'child' | 'teen' | 'adult',
): PetState {
  const stageAges = {
    egg: 0,
    baby: 5, // After hatching
    child: 70, // After baby evolution
    teen: 260, // After child evolution
    adult: 620, // After teen evolution
  }

  const state = createInitialPetState(variant)
  return {
    ...state,
    stage,
    lifecycle: {
      ...state.lifecycle,
      ageMinutes: stageAges[stage],
      stageEnteredAtMinute: stageAges[stage] - 5,
    },
  }
}

/**
 * Simulate time passing and pet decay
 * @param state Current pet state
 * @param minutesElapsed Minutes to advance
 * @returns Updated pet state after time passage
 */
export function advancePetByMinutes(state: PetState, minutesElapsed: number): PetState {
  const finalMinute = state.lifecycle.ageMinutes + minutesElapsed
  return dispatchPetAction(state, {
    type: 'tick',
    minute: finalMinute,
    elapsedMinutes: minutesElapsed,
  })
}

/**
 * Feed a pet and return updated state
 */
export function feedPetMeal(
  state: PetState,
  minute: number = state.lifecycle.ageMinutes,
): PetState {
  return dispatchPetAction(state, {
    type: 'feedMeal',
    minute,
  })
}

/**
 * Give pet a snack and return updated state
 */
export function feedPetSnack(
  state: PetState,
  minute: number = state.lifecycle.ageMinutes,
): PetState {
  return dispatchPetAction(state, {
    type: 'feedSnack',
    minute,
  })
}

/**
 * Play with pet and return updated state
 */
export function playWithPet(
  state: PetState,
  minute: number = state.lifecycle.ageMinutes,
): PetState {
  return dispatchPetAction(state, {
    type: 'playGame',
    minute,
  })
}

/**
 * Discipline pet and return updated state
 */
export function disciplinePet(
  state: PetState,
  minute: number = state.lifecycle.ageMinutes,
): PetState {
  return dispatchPetAction(state, {
    type: 'discipline',
    minute,
  })
}

/**
 * Give medicine to pet
 */
export function giveMedicine(
  state: PetState,
  minute: number = state.lifecycle.ageMinutes,
): PetState {
  return dispatchPetAction(state, {
    type: 'medicine',
    minute,
  })
}

/**
 * Clean poop
 */
export function cleanPoop(state: PetState, minute: number = state.lifecycle.ageMinutes): PetState {
  return dispatchPetAction(state, {
    type: 'cleanPoo',
    minute,
  })
}

/**
 * Assert meter value is within expected range
 */
export function assertMeterInRange(
  value: number,
  min: number,
  max: number,
  meterName: string,
): void {
  if (value < min || value > max) {
    throw new Error(`${meterName} ${value} is out of range [${min}, ${max}]`)
  }
}

/**
 * Assert all meters are within their valid ranges
 */
export function assertMetersValid(state: PetState): void {
  const { meters } = state
  assertMeterInRange(meters.hunger, 0, MAX_HEARTS, 'hunger')
  assertMeterInRange(meters.effort, 0, MAX_HEARTS, 'effort')
  assertMeterInRange(meters.happiness, 0, MAX_HEARTS, 'happiness')
  assertMeterInRange(meters.discipline, 0, 100, 'discipline')
  assertMeterInRange(meters.angelPower, 0, 100, 'angelPower')
  assertMeterInRange(meters.weight, 0, MAX_WEIGHT, 'weight')
}

/**
 * Get the last N events from pet history
 */
export function getRecentEvents(state: PetState, count: number = 5) {
  return state.history.slice(-count)
}

/**
 * Check if a specific event type exists in history
 */
export function hasEventType(state: PetState, eventType: string): boolean {
  return state.history.some((event) => event.type === eventType)
}

/**
 * Get the most recent event of a specific type
 */
export function getLastEventOfType(state: PetState, eventType: string) {
  return state.history
    .slice()
    .reverse()
    .find((event) => event.type === eventType)
}

/**
 * Assert pet has expected mood (for behavior validation)
 */
export function assertMood(state: PetState, expectedMood: PetMood, context: string = ''): void {
  if (state.mood !== expectedMood) {
    throw new Error(
      `Expected mood ${expectedMood} but got ${state.mood}${context ? ` (${context})` : ''}`,
    )
  }
}

/**
 * Assert pet is in expected stage
 */
export function assertStage(state: PetState, expectedStage: string, context: string = ''): void {
  if (state.stage !== expectedStage) {
    throw new Error(
      `Expected stage ${expectedStage} but got ${state.stage}${context ? ` (${context})` : ''}`,
    )
  }
}

/**
 * Assert pet has N active attention calls
 */
export function assertActiveCallCount(state: PetState, expectedCount: number): void {
  const activeCallCount = state.calls.filter((call) => !call.resolved).length
  if (activeCallCount !== expectedCount) {
    throw new Error(`Expected ${expectedCount} active calls but found ${activeCallCount}`)
  }
}

/**
 * Assert specific call type is active
 */
export function assertCallActive(state: PetState, callType: string): void {
  const hasCall = state.calls.some((call) => !call.resolved && call.type === callType)
  if (!hasCall) {
    throw new Error(`Expected active ${callType} call but none found`)
  }
}

/**
 * Create a pet with partial happiness (useful for testing happiness increment).
 * Initial happiness is 4 (MAX_HEARTS), so tests need initial happiness < MAX_HEARTS to see increment.
 */
export function createPartiallyHappyPet(
  variant: VariantId = 'original',
  happinessLevel: number = 3,
): PetState {
  const state = createInitialPetState(variant)
  return {
    ...state,
    meters: {
      ...state.meters,
      happiness: Math.min(happinessLevel, MAX_HEARTS),
    },
  }
}

/**
 * Resolve all active calls (simulate quick attention)
 */
export function resolveAllCalls(
  state: PetState,
  minute: number = state.lifecycle.ageMinutes,
): PetState {
  return {
    ...state,
    calls: state.calls.map((call) =>
      call.resolved
        ? call
        : {
            ...call,
            resolved: true,
            resolvedAtMinute: minute,
          },
    ),
    attentionActive: false,
  }
}
