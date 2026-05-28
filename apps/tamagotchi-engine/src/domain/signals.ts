// Sources: https://patents.google.com/patent/US5966526A/en and
// https://github.com/loociano/tamagotchi-tech-specs/blob/master/index.md

import { getPetAfterlife, isPetAlive, isPetInMemorial, isPetTombstone } from './afterlife'
import { ATTENTION_WINDOW_MINUTES, STAGE_ORDER } from './constants'
import { getBankPressure, getPetBank, getPetGenetics } from './economy'
import { getPetLifeProgress } from './lifecycle'
import { getPetMemory } from './memory'
import type { PetState, VariantId } from './types'

export interface TamagotchiSignalProfile {
  pressure: number
  intensity: number
  focus: number
  progress: number
}

type StageSchedule = {
  babyToChild: number
  childToTeen: number
  teenToAdult: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function round(value: number): number {
  return Math.round(value)
}

function getSchedule(variantId: VariantId): StageSchedule {
  switch (variantId) {
    case 'angel':
      return { babyToChild: 65, childToTeen: 120, teenToAdult: 180 }
    case 'ocean':
      return { babyToChild: 90, childToTeen: 180, teenToAdult: 300 }
    default:
      return { babyToChild: 65, childToTeen: 180, teenToAdult: 360 }
  }
}

function getStageIndex(stage: PetState['stage']): number {
  return STAGE_ORDER.indexOf(stage)
}

function getStageCompletion(state: PetState): number {
  const schedule = getSchedule(state.variantId)
  const minutesInStage = Math.max(
    0,
    state.lifecycle.ageMinutes - state.lifecycle.stageEnteredAtMinute,
  )

  switch (state.stage) {
    case 'egg':
      return 0
    case 'baby':
      return clamp((minutesInStage / schedule.babyToChild) * 100, 0, 100)
    case 'child':
      return clamp((minutesInStage / schedule.childToTeen) * 100, 0, 100)
    case 'teen':
      return clamp((minutesInStage / schedule.teenToAdult) * 100, 0, 100)
    case 'adult':
    case 'special':
      return 100
    case 'departed':
      return 100
    default:
      return 0
  }
}

export function getTamagotchiDecisionHint(state: PetState): {
  label: string
  reason: string
} {
  if (isPetTombstone(state)) {
    return {
      label: 'New egg',
      reason: 'The lineage is sealed, so the next step is to start from an egg.',
    }
  }

  if (isPetInMemorial(state)) {
    return {
      label: 'Resurrect',
      reason: 'The memorial window is open and the previous baseline can still be restored.',
    }
  }

  if (!isPetAlive(state)) {
    return {
      label: 'Wait',
      reason: 'The pet is not active and the lineage has not yet entered memorial.',
    }
  }

  if (state.sicknessCount > 0) {
    return {
      label: 'Use medicine',
      reason: 'Sickness is active, so recovery has priority over other actions.',
    }
  }

  if (
    state.attentionActive &&
    state.calls.some((call) => !call.resolved && call.type === 'hunger')
  ) {
    return {
      label: 'Feed meal',
      reason: 'A hunger call is active and unresolved.',
    }
  }

  if (state.meters.hunger <= 1) {
    return {
      label: 'Feed meal',
      reason: 'hunger is at the edge and feeding should stabilize the loop.',
    }
  }

  if (
    state.attentionActive &&
    state.calls.some((call) => !call.resolved && call.type === 'effort')
  ) {
    return {
      label: 'Praise or play',
      reason: 'The pet wants engagement and training support.',
    }
  }

  if (state.variantId === 'ocean' && state.meters.discipline < 75) {
    return {
      label: 'Discipline',
      reason: 'Ocean evolution still depends on discipline stability.',
    }
  }

  if (state.meters.happiness <= 1) {
    return {
      label: 'Play game',
      reason: 'Happiness is low and play will restore momentum.',
    }
  }

  return {
    label: 'Maintain streak',
    reason: 'The pet is stable; preserve the current care rhythm.',
  }
}

export function buildTamagotchiSignalProfile(state: PetState): TamagotchiSignalProfile {
  const afterlife = getPetAfterlife(state)
  const memory = getPetMemory(state)
  const bank = getPetBank(state)
  const genetics = getPetGenetics(state)
  const activeCalls = state.calls.filter((call) => !call.resolved)
  const unresolvedCalls = activeCalls.length
  const callUrgency = activeCalls.reduce((sum, call) => {
    const elapsedMinutes = Math.max(0, state.lifecycle.ageMinutes - call.issuedAtMinute)
    return sum + clamp(elapsedMinutes / ATTENTION_WINDOW_MINUTES, 0, 1)
  }, 0)
  const averageNeed = (state.meters.hunger + state.meters.effort + state.meters.happiness) / 3
  const lowNeedPressure = clamp((4 - averageNeed) * 12, 0, 48)
  const carePressure =
    state.care.total * 6 +
    state.care.stage * 3 +
    memory.neglectStreakDays * 6 -
    memory.careStreakDays * 2
  const lifePressure =
    state.sicknessCount * 8 + state.poopCount * 2 + (state.lifecycle.isSleeping ? -4 : 0)
  const callPressure =
    round(callUrgency * 12) + unresolvedCalls * 3 + (state.attentionActive ? 4 : 0)
  const pressure = clamp(
    round(
      lowNeedPressure +
        carePressure +
        lifePressure +
        callPressure +
        getBankPressure(state) +
        genetics.pressureBias,
    ),
    0,
    100,
  )

  const stageIndex = Math.max(0, getStageIndex(state.stage))
  const stageBase = (stageIndex / Math.max(1, STAGE_ORDER.length - 2)) * 100
  const stageCompletion = getStageCompletion(state)
  const lifeProgress = getPetLifeProgress(state)
  const intensity =
    afterlife.phase === 'tombstone'
      ? 0
      : afterlife.phase === 'memorial'
        ? 15
        : clamp(
            round(
              10 +
                stageBase * 0.4 +
                stageCompletion * 0.15 +
                lifeProgress * 0.15 +
                memory.neglectStreakDays * 5 -
                memory.careStreakDays * 2 +
                unresolvedCalls * 10 +
                round(callUrgency * 8) +
                (state.attentionActive ? 10 : 0) +
                (state.lightsOn ? 4 : 0),
            ),
            0,
            100,
          )

  const focus =
    afterlife.phase === 'tombstone'
      ? 0
      : afterlife.phase === 'memorial'
        ? 20
        : clamp(
            round(
              100 -
                pressure * 0.5 +
                state.meters.discipline * 0.3 +
                lifeProgress * 0.15 +
                memory.careStreakDays * 2 -
                memory.neglectStreakDays * 4 +
                (state.mood === 'calm' || state.mood === 'content' ? 10 : 0) +
                (state.mood === 'curious' ? 4 : 0) -
                unresolvedCalls * 3 -
                round(callUrgency * 6) +
                bank.balance * 0.2,
            ),
            0,
            100,
          )

  const progress = clamp(
    round(
      stageBase +
        stageCompletion * 0.4 +
        lifeProgress * 0.2 +
        afterlife.resurrectionCount * 6 +
        Math.max(0, bank.balance - 8) * 0.1,
    ),
    0,
    100,
  )

  return {
    pressure,
    intensity,
    focus,
    progress,
  }
}
