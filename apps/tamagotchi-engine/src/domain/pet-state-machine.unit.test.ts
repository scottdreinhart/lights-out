// Sources: https://patents.google.com/patent/US5966526A/en and
// https://tamagotchi.fandom.com/wiki/Care & Training

import { describe, expect, it } from 'vitest'

import { createInitialPetState, dispatchPetAction } from './index'
import {
  advancePetByMinutes,
  assertMetersValid,
  createHealthyPet,
  createHungryPet,
  createNeglectedPet,
  createPartiallyHappyPet,
  createTestPet,
} from './test-helpers'

describe('pet state machine - initialization', () => {
  it('creates a fresh original pet with egg stage', () => {
    const state = createInitialPetState('original', 'Mochi')
    expect(state.stage).toBe('egg')
    expect(state.name).toBe('Mochi')
    expect(state.meters.hunger).toBe(4)
  })

  it('creates fresh angel pet with egg stage', () => {
    const state = createInitialPetState('angel', 'Halo')
    expect(state.stage).toBe('egg')
    expect(state.name).toBe('Halo')
    expect(state.variantId).toBe('angel')
  })

  it('creates fresh ocean pet with egg stage', () => {
    const state = createInitialPetState('ocean', 'Wave')
    expect(state.stage).toBe('egg')
    expect(state.name).toBe('Wave')
    expect(state.variantId).toBe('ocean')
  })
})

describe('pet state machine - care actions', () => {
  it('feedMeal increases hunger meter by 1', () => {
    const state = createHungryPet('original')
    expect(state.meters.hunger).toBe(0)

    const nextState = dispatchPetAction(state, { type: 'feedMeal', minute: 1 })

    // feedMeal() adds 1 to hunger (not fills to MAX)
    expect(nextState.meters.hunger).toBe(1)
    expect(nextState.meters.weight).toBe(state.meters.weight + 3)
    expect(nextState.history.some((e) => e.type === 'feedMeal')).toBe(true)
    expect(nextState.calls[0]?.responseQuality).toBe('fast')
  })

  it('feedSnack increases happiness (not hunger)', () => {
    const state = createPartiallyHappyPet('original', 3)
    const initialHappiness = state.meters.happiness
    const initialHunger = state.meters.hunger

    const nextState = dispatchPetAction(state, { type: 'feedSnack', minute: 1 })

    // feedSnack() increases happiness by 1, not hunger
    expect(nextState.meters.hunger).toBe(initialHunger)
    expect(nextState.meters.happiness).toBe(initialHappiness + 1)
    expect(nextState.meters.weight).toBe(state.meters.weight + 1)
    expect(nextState.history.some((e) => e.type === 'feedSnack')).toBe(true)
  })

  it('treat is free and gives a small morale boost', () => {
    const state = createPartiallyHappyPet('original', 3)
    const initialBalance = state.bank?.balance ?? 0
    const initialHappiness = state.meters.happiness

    const nextState = dispatchPetAction(state, { type: 'treat', minute: 1 })

    expect(nextState.bank?.balance).toBe(initialBalance)
    expect(nextState.meters.happiness).toBe(initialHappiness + 1)
    expect(nextState.history.some((e) => e.type === 'treat')).toBe(true)
  })

  it('playGame (won) increases happiness and decreases weight', () => {
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
    expect(nextState.history.some((e) => e.type === 'playGame')).toBe(true)
  })

  it('playGame (lost) decreases weight but not happiness', () => {
    const state = createTestPet('original')
    const initialHappiness = state.meters.happiness
    const initialWeight = state.meters.weight

    const nextState = dispatchPetAction(state, {
      type: 'playGame',
      minute: 1,
      payload: { won: false },
    })

    expect(nextState.meters.happiness).toBe(initialHappiness)
    expect(nextState.meters.weight).toBe(initialWeight - 1)
    expect(nextState.history.some((e) => e.type === 'playGame')).toBe(true)
  })

  it('gamePlay spends a credit for a smaller game reward', () => {
    const baseState = createTestPet('original')
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
    expect(nextState.history.some((e) => e.type === 'gamePlay')).toBe(true)
  })

  it('cleanPoo decreases poopCount and logs event', () => {
    const state = createTestPet('original')
    const stateWithPoo = {
      ...state,
      poopCount: 2,
    }

    const nextState = dispatchPetAction(stateWithPoo, { type: 'cleanPoo', minute: 1 })

    expect(nextState.poopCount).toBe(stateWithPoo.poopCount - 1)
    expect(nextState.history.some((e) => e.type === 'cleanPoo')).toBe(true)
  })
})

describe('pet state machine - discipline actions', () => {
  it('discipline increases discipline meter and affects mood', () => {
    const state = createTestPet('original')
    const initialDiscipline = state.meters.discipline

    const nextState = dispatchPetAction(state, { type: 'discipline', minute: 1 })

    expect(nextState.meters.discipline).toBeGreaterThan(initialDiscipline)
    expect(nextState.history.some((e) => e.type === 'discipline')).toBe(true)
  })

  it('praise reinforces good behavior', () => {
    const state = createTestPet('original')
    const nextState = dispatchPetAction(state, { type: 'praise', minute: 1 })

    expect(nextState.history.some((e) => e.type === 'praise')).toBe(true)
  })
})

describe('pet state machine - medical actions', () => {
  it('medicine cures illness', () => {
    const state = {
      ...createNeglectedPet('original'),
      sicknessCount: 1,
    }
    // Verify pet is in sick/unhealthy state
    expect(state.sicknessCount).toBeGreaterThan(0)

    const nextState = dispatchPetAction(state, { type: 'medicine', minute: 1 })

    expect(nextState.sicknessCount).toBeLessThan(state.sicknessCount)
    expect(nextState.history.some((e) => e.type === 'medicine')).toBe(true)
  })
})

describe('pet state machine - environment actions', () => {
  it('lightsOn toggles light state', () => {
    const state = createTestPet('original')
    const nextState = dispatchPetAction(state, { type: 'lightsOn', minute: 1 })

    expect(nextState.lightsOn).toBe(true)
    expect(nextState.history.some((e) => e.type === 'lightsOn')).toBe(true)
  })

  it('lightsOff toggles light state', () => {
    const state = createTestPet('original')
    let nextState = dispatchPetAction(state, { type: 'lightsOn', minute: 1 })
    expect(nextState.lightsOn).toBe(true)

    nextState = dispatchPetAction(nextState, { type: 'lightsOff', minute: 2 })
    expect(nextState.lightsOn).toBe(false)
    expect(nextState.history.some((e) => e.type === 'lightsOff')).toBe(true)
  })
})

describe('pet state machine - time advancement', () => {
  it('advances time and records tick event', () => {
    const state = createInitialPetState('original')
    const nextState = dispatchPetAction(state, { type: 'tick', minute: 1, elapsedMinutes: 60 })

    expect(nextState.lifecycle.ageMinutes).toBe(60)
    expect(nextState.history.some((e) => e.type === 'tick')).toBe(true)
  })

  it('evolves pet after sufficient time in egg stage', () => {
    let state = createInitialPetState('original')
    expect(state.stage).toBe('egg')

    // Advance enough minutes to trigger evolution from egg to baby
    state = advancePetByMinutes(state, 60)

    expect(state.stage).not.toBe('egg')
    expect(state.history.some((e) => e.type === 'evolution')).toBe(true)
  })

  it('decays meters over time', () => {
    const state = createHealthyPet('original')
    const initialHunger = state.meters.hunger
    const initialHappiness = state.meters.happiness

    const nextState = advancePetByMinutes(state, 120)

    // Meters should have decayed
    expect(nextState.meters.hunger).toBeLessThanOrEqual(initialHunger)
    expect(nextState.meters.happiness).toBeLessThanOrEqual(initialHappiness)
  })
})

describe('pet state machine - reset action', () => {
  it('reset creates a fresh pet in egg stage', () => {
    let state = createInitialPetState('original', 'OldName')
    state = advancePetByMinutes(state, 120)

    // Verify state has aged
    expect(state.lifecycle.ageMinutes).toBeGreaterThan(0)

    const resetState = dispatchPetAction(state, {
      type: 'reset',
      minute: 200,
      payload: { variantId: 'original', petName: 'NewName' },
    })

    expect(resetState.stage).toBe('egg')
    expect(resetState.name).toBe('NewName')
    expect(resetState.lifecycle.ageMinutes).toBe(0)
  })

  it('reset preserves variant when not specified', () => {
    let state = createInitialPetState('angel', 'OldAngel')
    state = advancePetByMinutes(state, 60)

    const resetState = dispatchPetAction(state, {
      type: 'reset',
      minute: 100,
    })

    expect(resetState.variantId).toBe('angel')
  })
})

describe('pet state machine - departed state', () => {
  it('prevents actions after pet departs', () => {
    const state = createNeglectedPet('original')
    const departedState = {
      ...state,
      lifecycle: {
        ...state.lifecycle,
        isDeparted: true,
      },
      stage: 'departed',
    }

    const nextState = dispatchPetAction(departedState, { type: 'feedMeal', minute: 1 })

    // Action should be ignored
    expect(nextState).toEqual(departedState)
  })
})

describe('pet state machine - state immutability', () => {
  it('does not mutate original state when dispatching actions', () => {
    const state = createTestPet('original')
    const originalState = JSON.parse(JSON.stringify(state))

    dispatchPetAction(state, { type: 'feedMeal', minute: 1 })

    expect(state).toEqual(originalState)
  })
})

describe('pet state machine - meter validation', () => {
  it('maintains valid meter ranges after actions', () => {
    let state = createTestPet('original')

    const actions: Array<{ type: any; payload?: any }> = [
      { type: 'feedMeal' },
      { type: 'playGame', payload: { won: true } },
      { type: 'discipline' },
      { type: 'praise' },
    ]

    for (const action of actions) {
      state = dispatchPetAction(state, { ...action, minute: 1 })
      assertMetersValid(state)
    }
  })
})

describe('pet state machine - all variants', () => {
  const variants = ['original', 'angel', 'ocean'] as const

  for (const variant of variants) {
    describe(`${variant} variant`, () => {
      it(`creates fresh ${variant} pet`, () => {
        const state = createInitialPetState(variant)
        expect(state.variantId).toBe(variant)
        expect(state.stage).toBe('egg')
        assertMetersValid(state)
      })

      it(`${variant} pet can be fed and respond`, () => {
        const state = createHungryPet(variant)
        const nextState = dispatchPetAction(state, { type: 'feedMeal', minute: 1 })

        expect(nextState.meters.hunger).toBe(1)
      })

      it(`${variant} pet evolves over time`, () => {
        let state = createInitialPetState(variant)
        state = advancePetByMinutes(state, 60)

        expect(state.stage).not.toBe('egg')
      })
    })
  }
})
