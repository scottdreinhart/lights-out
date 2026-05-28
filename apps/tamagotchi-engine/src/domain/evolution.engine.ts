// Sources: https://tamagotchi.fandom.com/wiki/Care,
// https://tamagotchi.fandom.com/wiki/Training, and
// https://github.com/loociano/tamagotchi-tech-specs/blob/master/index.md

import { isPetAlive } from './afterlife'
import { ANGEL_STAGE_MINUTES, OCEAN_STAGE_MINUTES, ORIGINAL_STAGE_MINUTES } from './constants'
import type { EvolutionResult, LifeStage, PetState, VariantId } from './types'

const LIFE_STAGE_SEQUENCE: readonly LifeStage[] = [
  'egg',
  'baby',
  'child',
  'teen',
  'adult',
  'special',
  'departed',
] as const

function getSchedule(variantId: VariantId): {
  babyToChild: number
  childToTeen: number
  teenToAdult: number
} {
  switch (variantId) {
    case 'angel':
      return ANGEL_STAGE_MINUTES
    case 'ocean':
      return OCEAN_STAGE_MINUTES
    default:
      return ORIGINAL_STAGE_MINUTES
  }
}

function advanceStage(stage: LifeStage): LifeStage {
  const currentIndex = LIFE_STAGE_SEQUENCE.indexOf(stage)
  return LIFE_STAGE_SEQUENCE[Math.min(LIFE_STAGE_SEQUENCE.length - 1, currentIndex + 1)]
}

function buildStageResult(
  nextStage: LifeStage,
  branch: EvolutionResult['branch'],
  reason: string,
): EvolutionResult {
  return {
    evolved: true,
    nextStage,
    branch,
    reason,
  }
}

function getTeenStageResult(state: PetState): EvolutionResult {
  if (state.variantId === 'ocean' && state.meters.discipline < 75) {
    return buildStageResult(
      'departed',
      'ocean-failure',
      'Ocean discipline threshold was not met before adult check',
    )
  }

  if (state.variantId === 'angel' && state.meters.angelPower >= 75) {
    return buildStageResult(
      'special',
      'angel-path',
      'Angel power reached a special evolution branch',
    )
  }

  return buildStageResult('adult', 'standard-adult', 'Teen evolution matured into the adult stage')
}

function getStageEvolutionResult(
  state: PetState,
  schedule: ReturnType<typeof getSchedule>,
  minutesAtStage: number,
): EvolutionResult | null {
  if (state.stage === 'egg') {
    return buildStageResult(
      'baby',
      'hatch',
      'Egg resolves into the first baby stage when the lifecycle begins',
    )
  }

  if (state.stage === 'baby' && minutesAtStage >= schedule.babyToChild) {
    return buildStageResult(
      'child',
      'baby-to-child',
      'Clock-driven baby growth reached the child threshold',
    )
  }

  if (state.stage === 'child' && minutesAtStage >= schedule.childToTeen) {
    return buildStageResult('teen', 'child-to-teen', 'Child stage matured into teen stage')
  }

  if (state.stage === 'teen' && minutesAtStage >= schedule.teenToAdult) {
    return getTeenStageResult(state)
  }

  return null
}

export function evaluateEvolution(state: PetState): EvolutionResult {
  if (!isPetAlive(state)) {
    return {
      evolved: false,
      nextStage: 'departed',
      branch: 'ended',
      reason: 'Pet has already departed',
    }
  }

  const schedule = getSchedule(state.variantId)
  const minutesAtStage = state.lifecycle.ageMinutes - state.lifecycle.stageEnteredAtMinute

  const stageResult = getStageEvolutionResult(state, schedule, minutesAtStage)

  if (stageResult) {
    return stageResult
  }

  return {
    evolved: false,
    nextStage: advanceStage(state.stage),
    branch: 'steady-state',
    reason: 'Current stage has not yet reached its next threshold',
  }
}
