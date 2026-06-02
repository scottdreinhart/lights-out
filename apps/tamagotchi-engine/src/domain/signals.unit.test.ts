import { describe, expect, it } from 'vitest'

import { buildTamagotchiSignalProfile, createInitialPetState, getTamagotchiDecisionHint } from '.'

describe('buildTamagotchiSignalProfile', () => {
  it('keeps the initial egg state calm and low pressure', () => {
    const profile = buildTamagotchiSignalProfile(createInitialPetState('original'))

    expect(profile.pressure).toBeLessThan(20)
    expect(profile.intensity).toBeGreaterThan(0)
    expect(profile.focus).toBeGreaterThan(profile.pressure)
    expect(profile.progress).toBe(0)
  })

  it('raises pressure when care mistakes, sickness, and calls stack up', () => {
    const state = createInitialPetState('original')

    state.meters.hunger = 1
    state.meters.effort = 1
    state.meters.happiness = 1
    state.care.total = 5
    state.care.stage = 2
    state.sicknessCount = 2
    state.poopCount = 3
    state.attentionActive = true
    state.calls = [
      {
        type: 'hunger',
        issuedAtMinute: 2,
        expiresAtMinute: 6,
        resolvedAtMinute: null,
        resolved: false,
      },
      {
        type: 'discipline',
        issuedAtMinute: 3,
        expiresAtMinute: 7,
        resolvedAtMinute: null,
        resolved: false,
      },
    ]

    const profile = buildTamagotchiSignalProfile(state)

    expect(profile.pressure).toBeGreaterThan(60)
    expect(profile.intensity).toBeGreaterThan(30)
    expect(profile.focus).toBeLessThan(60)
  })

  it('pushes progress upward as the pet matures', () => {
    const state = createInitialPetState('original')
    state.stage = 'teen'
    state.lifecycle.ageMinutes = 240
    state.lifecycle.stageEnteredAtMinute = 180
    state.meters.discipline = 85
    state.mood = 'calm'

    const profile = buildTamagotchiSignalProfile(state)

    expect(profile.progress).toBeGreaterThan(60)
    expect(profile.focus).toBeGreaterThan(50)
  })

  it('returns a pressure-aware care hint', () => {
    const state = createInitialPetState('ocean')
    state.meters.hunger = 0
    state.attentionActive = true

    const hint = getTamagotchiDecisionHint(state)

    expect(hint.label).toContain('Feed')
    expect(hint.reason).toContain('hunger')
  })

  it('suggests resurrection during memorial and a fresh egg after tombstone', () => {
    const memorial = createInitialPetState('original')
    memorial.afterlife = {
      phase: 'memorial',
      deathMinute: 100,
      memorialUntilMinute: 200,
      resurrectionCount: 0,
      preservedState: null,
    }

    const tombstone = createInitialPetState('original')
    tombstone.afterlife = {
      phase: 'tombstone',
      deathMinute: 100,
      memorialUntilMinute: 200,
      resurrectionCount: 0,
      preservedState: null,
    }

    expect(getTamagotchiDecisionHint(memorial).label).toBe('Resurrect')
    expect(getTamagotchiDecisionHint(tombstone).label).toBe('New egg')
  })
})
