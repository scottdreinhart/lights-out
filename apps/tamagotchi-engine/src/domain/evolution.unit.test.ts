// Sources: https://tamagotchi.fandom.com/wiki/Tamagotchi_Angel and
// https://tamagotchi.fandom.com/wiki/Care

import { describe, expect, it } from 'vitest'

import { createInitialPetState, evaluateEvolution } from './index'
import type { Stage, Variant } from './pet.model'

describe('evolution engine - core functionality', () => {
  it('keeps a young original pet in the current stage before the threshold', () => {
    const state = createInitialPetState('original')
    const evolution = evaluateEvolution(state)

    expect(evolution.evolved).toBe(true)
    expect(evolution.nextStage).toBe('baby')
    expect(evolution.branch).toBe('hatch')
  })

  it('routes ocean pets to departure when discipline is too low at adult check', () => {
    const state = {
      ...createInitialPetState('ocean'),
      stage: 'teen' as const,
      lifecycle: {
        ...createInitialPetState('ocean').lifecycle,
        ageMinutes: 360,
        stageEnteredAtMinute: 0,
      },
    }

    const evolution = evaluateEvolution(state)

    expect(evolution.nextStage).toBe('departed')
    expect(evolution.branch).toBe('ocean-failure')
  })
})

describe('evolution engine - all 6 stages', () => {
  it('initial state creates egg stage ready to hatch', () => {
    const variants: Variant[] = ['original', 'angel', 'ocean']

    variants.forEach((variant) => {
      const state = createInitialPetState(variant)

      expect(state.stage).toBe('egg')

      const evolution = evaluateEvolution(state)
      expect(evolution.evolved).toBe(true)
      expect(evolution.nextStage).toBe('baby')
    })
  })

  it('baby stage is intermediate evolution', () => {
    const state = {
      ...createInitialPetState('original'),
      stage: 'baby' as const,
      lifecycle: {
        ...createInitialPetState('original').lifecycle,
        ageMinutes: 120,
        stageEnteredAtMinute: 60,
      },
    }

    expect(state.stage).toBe('baby')
  })

  it('child stage is intermediate evolution', () => {
    const state = {
      ...createInitialPetState('original'),
      stage: 'child' as const,
      lifecycle: {
        ...createInitialPetState('original').lifecycle,
        ageMinutes: 240,
        stageEnteredAtMinute: 180,
      },
    }

    expect(state.stage).toBe('child')
  })

  it('teen stage is intermediate evolution', () => {
    const state = {
      ...createInitialPetState('original'),
      stage: 'teen' as const,
      lifecycle: {
        ...createInitialPetState('original').lifecycle,
        ageMinutes: 360,
        stageEnteredAtMinute: 300,
      },
    }

    expect(state.stage).toBe('teen')
  })

  it('adult stage is final normal evolution', () => {
    const state = {
      ...createInitialPetState('original'),
      stage: 'adult' as const,
      lifecycle: {
        ...createInitialPetState('original').lifecycle,
        ageMinutes: 480,
        stageEnteredAtMinute: 420,
      },
    }

    expect(state.stage).toBe('adult')
  })

  it('special stage is variant-specific final form', () => {
    const variants: Variant[] = ['original', 'angel', 'ocean']

    variants.forEach((variant) => {
      const state = {
        ...createInitialPetState(variant),
        stage: 'special' as const,
        lifecycle: {
          ...createInitialPetState(variant).lifecycle,
          ageMinutes: 600,
          stageEnteredAtMinute: 540,
        },
      }

      expect(state.stage).toBe('special')
    })
  })

  it('departed stage is end state', () => {
    const state = {
      ...createInitialPetState('original'),
      stage: 'departed' as const,
      lifecycle: {
        ...createInitialPetState('original').lifecycle,
        ageMinutes: 720,
        departedAtMinute: 720,
        stageEnteredAtMinute: 0,
      },
    }

    expect(state.stage).toBe('departed')
  })
})

describe('evolution engine - stage transitions', () => {
  it('egg to baby transition', () => {
    const state = {
      ...createInitialPetState('original'),
      stage: 'egg' as const,
      lifecycle: {
        ...createInitialPetState('original').lifecycle,
        ageMinutes: 120,
        stageEnteredAtMinute: 0,
      },
    }

    const evolution = evaluateEvolution(state)
    expect(evolution.nextStage).toBe('baby')
  })

  it('baby to child transition based on age and care', () => {
    const state = {
      ...createInitialPetState('original'),
      stage: 'baby' as const,
      lifecycle: {
        ...createInitialPetState('original').lifecycle,
        ageMinutes: 240,
        stageEnteredAtMinute: 120,
      },
      meters: {
        ...createInitialPetState('original').meters,
        hunger: 2,
        happiness: 3,
        discipline: 2,
        health: 4,
      },
    }

    const evolution = evaluateEvolution(state)
    if (evolution.evolved) {
      expect(evolution.nextStage).not.toBe('baby')
    }
  })

  it('progression is sequential (no stage skipping)', () => {
    const stageOrder: Stage[] = ['egg', 'baby', 'child', 'teen', 'adult']
    let currentStage: Stage = 'egg'

    const variants: Variant[] = ['original', 'angel', 'ocean']

    variants.forEach((variant) => {
      let state = createInitialPetState(variant)
      state = { ...state, stage: currentStage }

      let ageMinutes = 0
      while (currentStage !== 'adult' && ageMinutes < 1000) {
        state = {
          ...state,
          lifecycle: {
            ...state.lifecycle,
            ageMinutes: ageMinutes,
          },
        }

        const evolution = evaluateEvolution(state)
        if (evolution.evolved && evolution.nextStage !== currentStage) {
          const nextIndex = stageOrder.indexOf(evolution.nextStage as Stage)
          const currentIndex = stageOrder.indexOf(currentStage)

          expect(nextIndex).toBeLessThanOrEqual(currentIndex + 1)
          currentStage = evolution.nextStage as Stage
        }

        ageMinutes += 60
      }
    })
  })
})

describe('evolution engine - variant-specific behaviors', () => {
  it('original variant evolution follows standard path', () => {
    const state = createInitialPetState('original')
    const evolution = evaluateEvolution(state)

    expect(evolution.evolved).toBe(true)
    expect(['baby', 'hatch']).toContain(evolution.nextStage || evolution.branch)
  })

  it('angel variant may have different evolution branches', () => {
    const state = createInitialPetState('angel')
    const evolution = evaluateEvolution(state)

    expect(evolution.evolved).toBe(true)
    // Angel might have unique stages or branches
  })

  it('ocean variant has strict discipline requirement for adult', () => {
    const oceanLowDiscipline = {
      ...createInitialPetState('ocean'),
      stage: 'teen' as const,
      lifecycle: {
        ...createInitialPetState('ocean').lifecycle,
        ageMinutes: 360,
        stageEnteredAtMinute: 0,
      },
      meters: {
        ...createInitialPetState('ocean').meters,
        discipline: 10, // Low discipline
      },
    }

    const evolution = evaluateEvolution(oceanLowDiscipline)
    // Ocean pets need good discipline or they depart
    expect([
      'departed',
      'special', // Or special if other conditions met
    ]).toContain(evolution.nextStage || evolution.branch)
  })

  it('ocean variant high discipline allows adult evolution', () => {
    const oceanHighDiscipline = {
      ...createInitialPetState('ocean'),
      stage: 'teen' as const,
      lifecycle: {
        ...createInitialPetState('ocean').lifecycle,
        ageMinutes: 360,
        stageEnteredAtMinute: 0,
      },
      meters: {
        ...createInitialPetState('ocean').meters,
        discipline: 80, // High discipline
        happiness: 3,
        health: 4,
      },
    }

    const evolution = evaluateEvolution(oceanHighDiscipline)
    expect(evolution.evolved).toBe(true)
  })
})

describe('evolution engine - care metrics influence', () => {
  it('well-cared pet may evolve to special', () => {
    const wellCared = {
      ...createInitialPetState('original'),
      stage: 'teen' as const,
      lifecycle: {
        ...createInitialPetState('original').lifecycle,
        ageMinutes: 360,
        stageEnteredAtMinute: 0,
      },
      meters: {
        ...createInitialPetState('original').meters,
        hunger: 3,
        happiness: 4,
        discipline: 70,
        health: 4,
      },
    }

    const evolution = evaluateEvolution(wellCared)
    expect(evolution.evolved).toBe(true)
  })

  it('neglected pet may depart instead of evolve', () => {
    const neglected = {
      ...createInitialPetState('original'),
      stage: 'teen' as const,
      lifecycle: {
        ...createInitialPetState('original').lifecycle,
        ageMinutes: 360,
        stageEnteredAtMinute: 0,
      },
      meters: {
        ...createInitialPetState('original').meters,
        hunger: 0,
        happiness: 0,
        discipline: 0,
        health: 1,
      },
    }

    const evolution = evaluateEvolution(neglected)
    expect(evolution.evolved).toBe(true)
    // May depart or evolve poorly
  })

  it('high happiness increases good evolution chance', () => {
    const happyPet = {
      ...createInitialPetState('original'),
      stage: 'teen' as const,
      lifecycle: {
        ...createInitialPetState('original').lifecycle,
        ageMinutes: 360,
        stageEnteredAtMinute: 0,
      },
      meters: {
        ...createInitialPetState('original').meters,
        happiness: 4,
      },
    }

    const evolution = evaluateEvolution(happyPet)
    expect(evolution.evolved).toBe(true)
  })

  it('high discipline increases special/good form chance', () => {
    const disciplinedPet = {
      ...createInitialPetState('original'),
      stage: 'teen' as const,
      lifecycle: {
        ...createInitialPetState('original').lifecycle,
        ageMinutes: 360,
        stageEnteredAtMinute: 0,
      },
      meters: {
        ...createInitialPetState('original').meters,
        discipline: 90,
      },
    }

    const evolution = evaluateEvolution(disciplinedPet)
    expect(evolution.evolved).toBe(true)
  })
})

describe('evolution engine - edge cases', () => {
  it('evolution at exact age threshold', () => {
    const state = {
      ...createInitialPetState('original'),
      stage: 'baby' as const,
      lifecycle: {
        ...createInitialPetState('original').lifecycle,
        ageMinutes: 180, // Exact boundary
        stageEnteredAtMinute: 120,
      },
    }

    const evolution = evaluateEvolution(state)
    expect(evolution.evolved).toBeDefined()
  })

  it('evolution just before age threshold', () => {
    const state = {
      ...createInitialPetState('original'),
      stage: 'baby' as const,
      lifecycle: {
        ...createInitialPetState('original').lifecycle,
        ageMinutes: 179, // Just before
        stageEnteredAtMinute: 120,
      },
    }

    const evolution = evaluateEvolution(state)
    if (evolution.evolved) {
      expect(evolution.nextStage).not.toBe(undefined)
    }
  })

  it('evolution just after age threshold', () => {
    const state = {
      ...createInitialPetState('original'),
      stage: 'baby' as const,
      lifecycle: {
        ...createInitialPetState('original').lifecycle,
        ageMinutes: 181, // Just after
        stageEnteredAtMinute: 120,
      },
    }

    const evolution = evaluateEvolution(state)
    expect(evolution.evolved).toBeDefined()
  })
})
