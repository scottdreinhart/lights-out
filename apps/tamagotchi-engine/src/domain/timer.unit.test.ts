// Sources: https://github.com/loociano/tamagotchi-tech-specs/blob/master/index.md

import { describe, expect, it } from 'vitest'

import { advanceTimer, createInitialPetState } from './index'

describe('timer engine', () => {
  it('reduces hunger over elapsed time', () => {
    const state = createInitialPetState('original')
    const nextState = advanceTimer(state, 60, 60)

    expect(nextState.meters.hunger).toBeLessThan(state.meters.hunger)
    expect(nextState.lifecycle.ageMinutes).toBe(60)
  })

  it('issues attention when hunger becomes empty', () => {
    const state = {
      ...createInitialPetState('original'),
      meters: {
        ...createInitialPetState('original').meters,
        hunger: 1,
      },
    }

    const nextState = advanceTimer(state, 120, 120)

    expect(nextState.attentionActive).toBe(true)
    expect(nextState.calls.length).toBeGreaterThan(0)
  })
})
