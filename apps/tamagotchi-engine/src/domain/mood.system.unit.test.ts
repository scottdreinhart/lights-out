// Mood system unit tests
// Validates mood derivation from the current meter model and action responses

import { describe, expect, it } from 'vitest'

import { MAX_HEARTS } from './constants'
import { dispatchPetAction } from './index'
import { derivePetMood } from './mood.system'
import { advancePetByMinutes, createTestPet } from './test-helpers'
import type { PetMood, PetState } from './types'

function makeState(overrides: Partial<PetState> = {}): PetState {
  const base = createTestPet('original')
  return {
    ...base,
    ...overrides,
    meters: {
      ...base.meters,
      ...(overrides.meters ?? {}),
    },
  }
}

describe('mood system - mood derivation from meters', () => {
  it('well cared pets resolve to delighted', () => {
    const state = makeState({
      meters: {
        ...createTestPet('original').meters,
        hunger: MAX_HEARTS,
        happiness: MAX_HEARTS,
      },
      care: {
        physical: 0,
        mental: 0,
        total: 0,
        stage: 0,
      },
    })

    expect(derivePetMood(state)).toBe('delighted')
  })

  it('low hunger resolves to hungry or very-hungry', () => {
    const hungryState = makeState({
      meters: {
        ...createTestPet('original').meters,
        hunger: 1,
      },
    })
    const criticalState = makeState({
      meters: {
        ...createTestPet('original').meters,
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
    })

    expect(['hungry', 'very-hungry']).toContain(derivePetMood(hungryState))
    expect(['hungry', 'very-hungry']).toContain(derivePetMood(criticalState))
  })

  it('low happiness resolves to needy or anxious', () => {
    const state = makeState({
      meters: {
        ...createTestPet('original').meters,
        happiness: 0,
      },
    })

    expect(['needy', 'anxious']).toContain(derivePetMood(state))
  })

  it('sickness and cleaning pressure affect mood', () => {
    const sickState = makeState({
      sicknessCount: 1,
    })
    const messyState = makeState({
      poopCount: 3,
    })

    expect(derivePetMood(sickState)).toBe('sick')
    expect(derivePetMood(messyState)).toBe('exhausted')
  })
})

describe('mood system - mood type validation', () => {
  const validMoods: PetMood[] = [
    'content',
    'curious',
    'playful',
    'delighted',
    'calm',
    'sleeping',
    'hungry',
    'very-hungry',
    'needy',
    'anxious',
    'exhausted',
    'sick',
    'departed',
  ]

  it('returns only valid mood types', () => {
    let state = createTestPet('original')

    for (let i = 0; i < 20; i++) {
      state = advancePetByMinutes(state, 5)
      expect(validMoods).toContain(derivePetMood(state))
    }
  })

  it('mood transitions after direct actions', () => {
    const hungryState = {
      ...createTestPet('original'),
      meters: {
        ...createTestPet('original').meters,
        hunger: 0,
      },
      attentionActive: true,
    }

    const fedState = dispatchPetAction(hungryState, { type: 'feedMeal', minute: 1 })

    expect(derivePetMood(hungryState)).not.toBe(derivePetMood(fedState))
  })
})

describe('mood system - mood reactions to immediate actions', () => {
  it('feeding improves hunger pressure', () => {
    const state = {
      ...createTestPet('original'),
      meters: {
        ...createTestPet('original').meters,
        hunger: 0,
      },
      attentionActive: true,
    }

    const nextState = dispatchPetAction(state, { type: 'feedMeal', minute: 1 })

    expect(derivePetMood(nextState)).not.toBe('very-hungry')
  })

  it('medicine resolves sickness-driven mood pressure', () => {
    const state = {
      ...createTestPet('original'),
      sicknessCount: 1,
    }

    const nextState = dispatchPetAction(state, { type: 'medicine', minute: 1 })

    expect(derivePetMood(nextState)).not.toBe('sick')
  })
})
