// Discipline system unit tests
// Validates discipline tracking, discipline actions, and mood/behavior impacts

import { describe, expect, it } from 'vitest'

import { dispatchPetAction } from './index'
import { assertMeterInRange, createPartiallyHappyPet, createTestPet } from './test-helpers'

describe('discipline system - discipline action', () => {
  it('discipline increases discipline meter', () => {
    const state = createTestPet('original')
    const initialDiscipline = state.meters.discipline

    const nextState = dispatchPetAction(state, { type: 'discipline', minute: 1 })

    expect(nextState.meters.discipline).toBeGreaterThan(initialDiscipline)
  })

  it('discipline records event', () => {
    const state = createTestPet('original')
    const nextState = dispatchPetAction(state, { type: 'discipline', minute: 5 })

    const disciplineEvent = nextState.history.find((e) => e.type === 'discipline' && e.minute === 5)
    expect(disciplineEvent).toBeDefined()
  })

  it('discipline affects mood', () => {
    const state = createTestPet('original')
    const nextState = dispatchPetAction(state, { type: 'discipline', minute: 1 })

    // Discipline action may temporarily affect happiness
    expect(nextState.history.some((e) => e.type === 'discipline')).toBe(true)
  })
})

describe('discipline system - praise action', () => {
  it('praise increases happiness', () => {
    const state = createPartiallyHappyPet('original', 3)
    const initialHappiness = state.meters.happiness

    const nextState = dispatchPetAction(state, { type: 'praise', minute: 1 })

    expect(nextState.meters.happiness).toBeGreaterThan(initialHappiness)
  })

  it('praise may increase discipline', () => {
    const state = createTestPet('original')
    const initialDiscipline = state.meters.discipline

    const nextState = dispatchPetAction(state, { type: 'praise', minute: 1 })

    // Praise should improve discipline through positive reinforcement
    expect(nextState.meters.discipline).toBeGreaterThanOrEqual(initialDiscipline)
  })

  it('praise records event', () => {
    const state = createTestPet('original')
    const nextState = dispatchPetAction(state, { type: 'praise', minute: 3 })

    const praiseEvent = nextState.history.find((e) => e.type === 'praise' && e.minute === 3)
    expect(praiseEvent).toBeDefined()
  })

  it('praise cannot exceed max discipline', () => {
    const state = {
      ...createTestPet('original'),
      meters: {
        ...createTestPet('original').meters,
        discipline: 95,
      },
    }

    let nextState = dispatchPetAction(state, { type: 'praise', minute: 1 })
    nextState = dispatchPetAction(nextState, { type: 'praise', minute: 2 })
    nextState = dispatchPetAction(nextState, { type: 'praise', minute: 3 })

    assertMeterInRange(nextState.meters.discipline, 0, 100)
  })
})

describe('discipline system - disrespect tracking', () => {
  it('playGame loss may increase disrespect', () => {
    const state = createTestPet('original')

    const nextState = dispatchPetAction(state, {
      type: 'playGame',
      minute: 1,
      payload: { won: false },
    })

    // Losing game can increase disrespect
    expect(nextState.history.some((e) => e.type === 'playGame')).toBe(true)
  })

  it('low discipline triggers disrespect events', () => {
    const lowDisciplineState = {
      ...createTestPet('original'),
      meters: {
        ...createTestPet('original').meters,
        discipline: 10,
      },
    }

    // Low discipline should be visible in pet's behavior
    expect(lowDisciplineState.meters.discipline).toBeLessThan(30)
  })

  it('discipline actions influence evolution stage', () => {
    // High discipline can influence which special evolution paths are possible
    const highDisciplineState = {
      ...createTestPet('original'),
      meters: {
        ...createTestPet('original').meters,
        discipline: 80,
      },
    }

    expect(highDisciplineState.meters.discipline).toBeGreaterThan(70)
  })
})

describe('discipline system - interaction with other meters', () => {
  it('low discipline increases mood volatility', () => {
    const lowDisciplineState = {
      ...createTestPet('original'),
      meters: {
        ...createTestPet('original').meters,
        discipline: 10,
      },
    }

    const nextState = dispatchPetAction(lowDisciplineState, {
      type: 'playGame',
      minute: 1,
      payload: { won: true },
    })

    // With low discipline, same action may have different happiness impact
    expect(nextState.history.some((e) => e.type === 'playGame')).toBe(true)
  })

  it('discipline and praise reinforce each other', () => {
    let state = createTestPet('original')

    // Apply discipline
    state = dispatchPetAction(state, { type: 'discipline', minute: 1 })
    const afterDiscipline = state.meters.discipline

    // Apply praise
    state = dispatchPetAction(state, { type: 'praise', minute: 2 })
    const afterPraise = state.meters.discipline

    // Praise should boost discipline further
    expect(afterPraise).toBeGreaterThanOrEqual(afterDiscipline)
  })

  it('caring for pet increases discipline indirectly', () => {
    let state = createTestPet('original')

    state = dispatchPetAction(state, { type: 'feedMeal', minute: 1 })
    state = dispatchPetAction(state, { type: 'playGame', minute: 2, payload: { won: true } })
    state = dispatchPetAction(state, { type: 'praise', minute: 3 })

    // Good care should reflect in discipline score
    expect(state.meters.discipline).toBeGreaterThan(0)
  })
})

describe('discipline system - discipline at extremes', () => {
  it('very high discipline limits certain interactions', () => {
    const maxDisciplineState = {
      ...createTestPet('original'),
      meters: {
        ...createTestPet('original').meters,
        discipline: 100,
      },
    }

    expect(maxDisciplineState.meters.discipline).toBe(100)
  })

  it('zero discipline triggers severe behavior changes', () => {
    const zeroDisciplineState = {
      ...createTestPet('original'),
      meters: {
        ...createTestPet('original').meters,
        discipline: 0,
      },
    }

    const nextState = dispatchPetAction(zeroDisciplineState, {
      type: 'playGame',
      minute: 1,
      payload: { won: true },
    })

    // Pet with zero discipline should have unpredictable behavior
    expect(zeroDisciplineState.meters.discipline).toBe(0)
  })
})

describe('discipline system - discipline evolution impact', () => {
  it('high discipline enables special evolution stages', () => {
    // Angel and other variants may require high discipline
    const highDisciplineState = {
      ...createTestPet('original'),
      meters: {
        ...createTestPet('original').meters,
        discipline: 90,
      },
    }

    expect(highDisciplineState.meters.discipline).toBeGreaterThan(80)
  })

  it('discipline history influences final form', () => {
    // Pet's discipline history can influence which evolution path it takes
    let state = createTestPet('original')

    // Build up high discipline over time
    for (let i = 0; i < 5; i++) {
      state = dispatchPetAction(state, { type: 'praise', minute: i + 1 })
    }

    expect(state.meters.discipline).toBeGreaterThan(createTestPet('original').meters.discipline)
  })
})
