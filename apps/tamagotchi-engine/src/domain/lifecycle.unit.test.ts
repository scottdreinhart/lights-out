import { describe, expect, it } from 'vitest'

import {
  applyLifeExpectancyDeparture,
  createInitialPetState,
  getPetAgeInDays,
  getPetDayNumber,
  getPetLifeExpectancyDays,
  shouldPetDepartFromAge,
} from '.'

describe('lifecycle helpers', () => {
  it('converts age minutes into real-world days', () => {
    const state = createInitialPetState('original')
    state.lifecycle.ageMinutes = 24 * 60

    expect(getPetAgeInDays(state)).toBe(1)
    expect(getPetDayNumber(state)).toBe(2)
  })

  it('exposes variant life expectancy in days', () => {
    expect(getPetLifeExpectancyDays('original')).toBeGreaterThan(0)
    expect(getPetLifeExpectancyDays('angel')).toBeLessThanOrEqual(
      getPetLifeExpectancyDays('original'),
    )
  })

  it('marks the pet as departed once life expectancy is reached', () => {
    const state = createInitialPetState('ocean')
    state.lifecycle.ageMinutes = getPetLifeExpectancyDays('ocean') * 24 * 60

    expect(shouldPetDepartFromAge(state)).toBe(true)

    const departed = applyLifeExpectancyDeparture(state, state.lifecycle.ageMinutes)

    expect(departed.stage).toBe('departed')
    expect(departed.lifecycle.isDeparted).toBe(false)
    expect(departed.afterlife?.phase).toBe('memorial')
  })
})
