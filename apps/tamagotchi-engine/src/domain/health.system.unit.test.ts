// Health system unit tests
// Validates time decay, attention calls, medical actions, and departed-state protection

import { describe, expect, it } from 'vitest'

import { resolveAttentionCall, resolveCallTimeouts } from './health.system'
import { dispatchPetAction } from './index'
import { createPetCall } from './pet.model'
import {
  advancePetByMinutes,
  createNeglectedPet,
  createTestPet,
  hasEventType,
} from './test-helpers'

describe('health system - decay over time', () => {
  it('time passage reduces hunger and happiness', () => {
    const state = createTestPet('original')

    const after10Minutes = advancePetByMinutes(state, 10)
    const after30Minutes = advancePetByMinutes(state, 30)

    expect(after10Minutes.meters.hunger).toBeLessThanOrEqual(state.meters.hunger)
    expect(after10Minutes.meters.happiness).toBeLessThanOrEqual(state.meters.happiness)
    expect(after30Minutes.meters.hunger).toBeLessThanOrEqual(after10Minutes.meters.hunger)
    expect(after30Minutes.meters.happiness).toBeLessThanOrEqual(after10Minutes.meters.happiness)
  })

  it('repeated advancement keeps moving the lifecycle forward', () => {
    let state = createTestPet('original')
    const ages = [state.lifecycle.ageMinutes]

    for (let i = 0; i < 5; i++) {
      state = advancePetByMinutes(state, 5)
      ages.push(state.lifecycle.ageMinutes)
    }

    for (let i = 1; i < ages.length; i++) {
      expect(ages[i]).toBeGreaterThan(ages[i - 1])
    }
  })
})

describe('health system - medicine action', () => {
  it('medicine reduces sickness and records an event', () => {
    const state = {
      ...createTestPet('original'),
      sicknessCount: 2,
    }

    const nextState = dispatchPetAction(state, { type: 'medicine', minute: 1 })

    expect(nextState.sicknessCount).toBe(1)
    expect(hasEventType(nextState, 'medicine')).toBe(true)
  })

  it('departed pets ignore medicine', () => {
    const state = {
      ...createTestPet('original'),
      stage: 'departed' as const,
      lifecycle: {
        ...createTestPet('original').lifecycle,
        isDeparted: true,
      },
      sicknessCount: 1,
    }

    const nextState = dispatchPetAction(state, { type: 'medicine', minute: 1 })

    expect(nextState).toEqual(state)
  })
})

describe('health system - attention calls', () => {
  it('extended decay can trigger attention calls', () => {
    let state = createNeglectedPet('original')

    for (let i = 0; i < 6; i++) {
      state = advancePetByMinutes(state, 10)
    }

    expect(state.calls.length).toBeGreaterThan(0)
  })

  it('active calls remain visible after additional decay', () => {
    let state = createNeglectedPet('original')
    state = advancePetByMinutes(state, 15)

    expect(state.calls.some((call) => !call.resolved)).toBe(true)

    const nextState = advancePetByMinutes(state, 5)
    expect(nextState.calls.length).toBeGreaterThanOrEqual(state.calls.length)
  })

  it('a fast attention response records the response quality', () => {
    const state = {
      ...createTestPet('original'),
      attentionActive: true,
      calls: [createPetCall('hunger', 10, 25)],
    }

    const nextState = resolveAttentionCall(state, 'hunger', 12)

    expect(nextState.calls[0]?.resolved).toBe(true)
    expect(nextState.calls[0]?.responseQuality).toBe('fast')
    expect(nextState.bank?.balance).toBeGreaterThan(state.bank?.balance ?? 0)
  })

  it('expired calls are marked as missed', () => {
    const state = {
      ...createTestPet('original'),
      attentionActive: true,
      calls: [createPetCall('effort', 1, 5)],
    }

    const nextState = resolveCallTimeouts(state, 8)

    expect(nextState.calls[0]?.resolved).toBe(true)
    expect(nextState.calls[0]?.responseQuality).toBe('missed')
  })
})
