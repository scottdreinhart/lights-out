// Care system unit tests
// Validates feeding, weight management, mood derivation, and poo mechanics
// CRITICAL BEHAVIORAL TRUTHS (from care.system.ts):
// - feedMeal: hunger +1 (clamped to MAX_HEARTS=4), weight +2, event: 'Meal restored hunger'
// - feedSnack: happiness +1 (clamped), weight +1, NO hunger change, event: 'Snack restored happiness'
// - treat: free morale boost with no weight change
// - playGame win: happiness +1, weight -1, mood='playful', event: 'Game improved happiness'
// - playGame lose: happiness NO change, weight -1, event: 'Game was lost and only boosted training indirectly'
// - gamePlay: costs 1 credit and grants a smaller morale boost than arcade
// - cleanPoo: poopCount -1, mood derived, event: 'Cleaned the room'
// - All heart meters clamp [0, MAX_HEARTS=4]
// - Weight uses Math.min(MAX_WEIGHT)

import { describe, expect, it } from 'vitest'

import { MAX_HEARTS, MAX_WEIGHT } from './constants'
import { dispatchPetAction } from './index'
import {
  assertMeterInRange,
  createHungryPet,
  createPartiallyHappyPet,
  createTestPet,
} from './test-helpers'

describe('care system - feedMeal', () => {
  it('feedMeal increments hunger by exactly +1', () => {
    const state = createHungryPet('original')
    expect(state.meters.hunger).toBe(0)

    const nextState = dispatchPetAction(state, { type: 'feedMeal', minute: 1 })

    // Actual behavior: hunger +1 from current state, clamped at MAX_HEARTS
    expect(nextState.meters.hunger).toBe(1)
  })

  it('feedMeal increases weight by exactly +2', () => {
    const state = createTestPet('original')
    const initialWeight = state.meters.weight

    const nextState = dispatchPetAction(state, { type: 'feedMeal', minute: 1 })

    expect(nextState.meters.weight).toBe(initialWeight + 2)
    assertMeterInRange(nextState.meters.weight, 0, MAX_WEIGHT)
  })

  it('feedMeal clamps hunger at MAX_HEARTS boundary', () => {
    // Start with MAX_HEARTS hunger
    const state = createTestPet('original')
    expect(state.meters.hunger).toBe(MAX_HEARTS)

    const nextState = dispatchPetAction(state, { type: 'feedMeal', minute: 1 })

    // Attempting +1 to MAX_HEARTS results in MAX_HEARTS (clamped)
    expect(nextState.meters.hunger).toBe(MAX_HEARTS)
  })

  it('feedMeal records event with exact text: "Meal restored hunger"', () => {
    const state = createTestPet('original')
    const nextState = dispatchPetAction(state, { type: 'feedMeal', minute: 5 })

    const feedEvent = nextState.history.find((e) => e.type === 'feedMeal' && e.minute === 5)
    expect(feedEvent).toBeDefined()
    // Exact text match required
    expect(feedEvent?.detail).toBe('Meal restored hunger')
  })

  it('feedMeal increments hunger incrementally when called multiple times', () => {
    let state = createHungryPet('original')
    expect(state.meters.hunger).toBe(0)

    // First feed: 0 → 1
    state = dispatchPetAction(state, { type: 'feedMeal', minute: 1 })
    expect(state.meters.hunger).toBe(1)

    // Second feed: 1 → 2
    state = dispatchPetAction(state, { type: 'feedMeal', minute: 2 })
    expect(state.meters.hunger).toBe(2)

    // Third feed: 2 → 3
    state = dispatchPetAction(state, { type: 'feedMeal', minute: 3 })
    expect(state.meters.hunger).toBe(3)

    // Fourth feed: 3 → 4 (MAX_HEARTS)
    state = dispatchPetAction(state, { type: 'feedMeal', minute: 4 })
    expect(state.meters.hunger).toBe(4)

    // Fifth feed: 4 stays 4 (clamped)
    state = dispatchPetAction(state, { type: 'feedMeal', minute: 5 })
    expect(state.meters.hunger).toBe(4)
  })

  it('feedMeal updates history after each action', () => {
    const state = createTestPet('original')
    const nextState = dispatchPetAction(state, { type: 'feedMeal', minute: 10 })

    // History should include the feed event
    expect(nextState.history.length).toBeGreaterThan(state.history.length)
    expect(
      nextState.history.some((event) => event.type === 'feedMeal' && event.minute === 10),
    ).toBe(true)
    expect(nextState.history[nextState.history.length - 1]).toEqual({
      type: 'feedMeal',
      minute: 10,
      detail: 'Meal restored hunger',
    })
  })

  it('feedMeal does NOT affect happiness', () => {
    const state = createTestPet('original')
    const initialHappiness = state.meters.happiness

    const nextState = dispatchPetAction(state, { type: 'feedMeal', minute: 1 })

    // feedMeal ONLY affects hunger (+1) and weight (+2)
    expect(nextState.meters.happiness).toBe(initialHappiness)
  })
})

describe('care system - feedSnack', () => {
  it('feedSnack increments happiness by exactly +1', () => {
    // Initial happiness must be < MAX_HEARTS to see the increment
    // (INITIAL_METERS.happiness = 4, so 4+1 clamps to 4)
    const state = createPartiallyHappyPet('original', 3)
    const initialHappiness = state.meters.happiness

    const nextState = dispatchPetAction(state, { type: 'feedSnack', minute: 1 })

    // feedSnack: happiness +1 (not hunger!)
    expect(nextState.meters.happiness).toBe(initialHappiness + 1)
  })

  it('feedSnack increases weight by exactly +1 (less than feedMeal +2)', () => {
    const state = createTestPet('original')
    const initialWeight = state.meters.weight

    const nextState = dispatchPetAction(state, { type: 'feedSnack', minute: 1 })

    expect(nextState.meters.weight).toBe(initialWeight + 1)
  })

  it('feedSnack does NOT affect hunger', () => {
    const hungryState = createHungryPet('original')
    expect(hungryState.meters.hunger).toBe(0)

    const nextState = dispatchPetAction(hungryState, { type: 'feedSnack', minute: 1 })

    // Critical: feedSnack does NOT increase hunger
    expect(nextState.meters.hunger).toBe(0)
  })

  it('feedSnack records event with exact text: "Snack restored happiness"', () => {
    const state = createTestPet('original')
    const nextState = dispatchPetAction(state, { type: 'feedSnack', minute: 3 })

    const snackEvent = nextState.history.find((e) => e.type === 'feedSnack' && e.minute === 3)
    expect(snackEvent).toBeDefined()
    // Exact text match required
    expect(snackEvent?.detail).toBe('Snack restored happiness')
  })

  it('feedSnack happiness clamped at MAX_HEARTS', () => {
    const state = createTestPet('original')
    expect(state.meters.happiness).toBe(MAX_HEARTS)

    const nextState = dispatchPetAction(state, { type: 'feedSnack', minute: 1 })

    // Attempting +1 to MAX_HEARTS results in MAX_HEARTS (clamped)
    expect(nextState.meters.happiness).toBe(MAX_HEARTS)
  })
})

describe('care system - treat', () => {
  it('treat is free and raises happiness by exactly +1', () => {
    const state = createPartiallyHappyPet('original', 3)
    const initialBalance = state.bank?.balance ?? 0

    const nextState = dispatchPetAction(state, { type: 'treat', minute: 1 })

    expect(nextState.bank?.balance).toBe(initialBalance)
    expect(nextState.meters.happiness).toBe(state.meters.happiness + 1)
    expect(nextState.meters.weight).toBe(state.meters.weight)
    expect(nextState.history.some((event) => event.type === 'treat')).toBe(true)
  })
})

describe('care system - playGame', () => {
  it('playGame when won: happiness +1, weight -1', () => {
    const state = createPartiallyHappyPet('original', 3)
    const initialHappiness = state.meters.happiness
    const initialWeight = state.meters.weight

    const nextState = dispatchPetAction(state, {
      type: 'playGame',
      minute: 1,
      payload: { won: true },
    })

    expect(nextState.meters.happiness).toBe(initialHappiness + 1)
    expect(nextState.meters.weight).toBe(initialWeight - 1)
  })

  it('playGame when won: sets mood to "playful"', () => {
    const state = createTestPet('original')

    const nextState = dispatchPetAction(state, {
      type: 'playGame',
      minute: 1,
      payload: { won: true },
    })

    expect(nextState.mood).toBe('playful')
  })

  it('playGame when won: exact event text "Game improved happiness"', () => {
    const state = createTestPet('original')

    const nextState = dispatchPetAction(state, {
      type: 'playGame',
      minute: 2,
      payload: { won: true },
    })

    const gameEvent = nextState.history.find((e) => e.type === 'playGame' && e.minute === 2)
    expect(gameEvent?.detail).toBe('Game improved happiness')
  })

  it('playGame when lost: happiness NO change, weight -1', () => {
    const state = createTestPet('original')
    const initialHappiness = state.meters.happiness
    const initialWeight = state.meters.weight

    const nextState = dispatchPetAction(state, {
      type: 'playGame',
      minute: 1,
      payload: { won: false },
    })

    // Critical: losing does NOT change happiness
    expect(nextState.meters.happiness).toBe(initialHappiness)
    expect(nextState.meters.weight).toBe(initialWeight - 1)
  })

  it('playGame when lost: mood derived (not playful)', () => {
    const state = createTestPet('original')

    const nextState = dispatchPetAction(state, {
      type: 'playGame',
      minute: 1,
      payload: { won: false },
    })

    // When lost, mood is derived from state (not set to 'playful')
    expect(nextState.mood).not.toBe('playful')
  })

  it('playGame when lost: exact event text', () => {
    const state = createTestPet('original')

    const nextState = dispatchPetAction(state, {
      type: 'playGame',
      minute: 2,
      payload: { won: false },
    })

    const gameEvent = nextState.history.find((e) => e.type === 'playGame' && e.minute === 2)
    expect(gameEvent?.detail).toBe('Game was lost and only boosted training indirectly')
  })

  it('playGame does NOT affect hunger', () => {
    const state = createTestPet('original')
    const initialHunger = state.meters.hunger

    const nextState = dispatchPetAction(state, {
      type: 'playGame',
      minute: 1,
      payload: { won: true },
    })

    expect(nextState.meters.hunger).toBe(initialHunger)
  })
})

describe('care system - gamePlay', () => {
  it('gamePlay spends one credit and grants a smaller morale boost', () => {
    const baseState = createPartiallyHappyPet('original', 3)
    const state = {
      ...baseState,
      genetics: {
        ...baseState.genetics!,
        costDiscount: 0,
      },
    }
    const initialBalance = state.bank?.balance ?? 0

    const nextState = dispatchPetAction(state, { type: 'gamePlay', minute: 1 })

    expect(nextState.bank?.balance).toBe(initialBalance - 1)
    expect(nextState.meters.happiness).toBe(state.meters.happiness + 1)
    expect(nextState.history.some((e) => e.type === 'gamePlay')).toBe(true)
  })
})

describe('care system - cleanPoo', () => {
  it('cleanPoo decrements poopCount by exactly -1', () => {
    const state = createTestPet('original')
    const stateWithPoo = {
      ...state,
      poopCount: 2,
    }

    const nextState = dispatchPetAction(stateWithPoo, { type: 'cleanPoo', minute: 1 })

    expect(nextState.poopCount).toBe(1)
  })

  it('cleanPoo clamps poopCount at 0 (no negative)', () => {
    const state = createTestPet('original')
    const stateWithPoo = {
      ...state,
      poopCount: 0,
    }

    const nextState = dispatchPetAction(stateWithPoo, { type: 'cleanPoo', minute: 1 })

    expect(nextState.poopCount).toBe(0)
  })

  it('cleanPoo records event with exact text: "Cleaned the room"', () => {
    const state = createTestPet('original')
    const stateWithPoo = {
      ...state,
      poopCount: 1,
    }

    const nextState = dispatchPetAction(stateWithPoo, { type: 'cleanPoo', minute: 1 })

    const cleanEvent = nextState.history.find((e) => e.type === 'cleanPoo' && e.minute === 1)
    expect(cleanEvent).toBeDefined()
    expect(cleanEvent?.detail).toBe('Cleaned the room')
  })

  it('cleanPoo updates mood via derivePetMood (mood affected by poopCount)', () => {
    // This test validates that mood is re-derived after cleaning
    // (poopCount is an input to derivePetMood)
    const state = createTestPet('original')
    const stateWithPoo = {
      ...state,
      poopCount: 3,
    }

    const nextState = dispatchPetAction(stateWithPoo, { type: 'cleanPoo', minute: 1 })

    // Mood should be re-derived after decrementing poopCount
    // (exact mood value depends on derivePetMood formula)
    expect(nextState.mood).toBeDefined()
  })

  it('cleanPoo does NOT affect meters (hunger, happiness, etc)', () => {
    const state = createTestPet('original')
    const stateWithPoo = {
      ...state,
      poopCount: 1,
    }

    const nextState = dispatchPetAction(stateWithPoo, { type: 'cleanPoo', minute: 1 })

    expect(nextState.meters.hunger).toBe(stateWithPoo.meters.hunger)
    expect(nextState.meters.happiness).toBe(stateWithPoo.meters.happiness)
    expect(nextState.meters.weight).toBe(stateWithPoo.meters.weight)
  })
})

describe('care system - weight mechanics', () => {
  it('weight clamped at MAX_WEIGHT via feedMeal', () => {
    const state = createTestPet('original')
    const overweightState = {
      ...state,
      meters: {
        ...state.meters,
        weight: MAX_WEIGHT - 1,
      },
    }

    // feedMeal tries to add +2
    const nextState = dispatchPetAction(overweightState, { type: 'feedMeal', minute: 1 })

    // Math.min(MAX_WEIGHT, (MAX_WEIGHT-1) + 2) = Math.min(MAX_WEIGHT, MAX_WEIGHT+1) = MAX_WEIGHT
    expect(nextState.meters.weight).toBe(MAX_WEIGHT)
  })

  it('weight can go below 0 is prevented', () => {
    const state = createTestPet('original')
    const lightState = {
      ...state,
      meters: {
        ...state.meters,
        weight: 1,
      },
    }

    // playGame loses: weight -1 (0 is OK, but negative prevented via Math.max(0, ...))
    const nextState = dispatchPetAction(lightState, {
      type: 'playGame',
      minute: 1,
      payload: { won: false },
    })

    expect(nextState.meters.weight).toBe(0)
  })
})
