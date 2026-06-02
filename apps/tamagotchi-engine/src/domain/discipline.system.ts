// Sources: https://tamagotchi.fandom.com/wiki/Training and
// https://tamagotchi.fandom.com/wiki/Tamagotchi_Angel

import { isPetAlive } from './afterlife'
import { MAX_DISCIPLINE, MAX_HEARTS } from './constants'
import { derivePetMood } from './mood.system'
import { appendEvent } from './pet.model'
import type { PetState } from './types'

function clampDiscipline(value: number): number {
  return Math.max(0, Math.min(MAX_DISCIPLINE, value))
}

export function disciplinePet(state: PetState, minute: number): PetState {
  if (!isPetAlive(state)) {
    return state
  }

  const meters = {
    ...state.meters,
    discipline: clampDiscipline(state.meters.discipline + 10),
    happiness: Math.max(0, state.meters.happiness - 1),
  }

  const nextState = {
    ...state,
    meters,
    care: {
      ...state.care,
      physical: Math.max(0, state.care.physical - 1),
    },
  }

  return appendEvent(
    {
      ...nextState,
      mood: derivePetMood(nextState),
    },
    { type: 'discipline', minute, detail: 'Discipline corrected a misbehavior call' },
  )
}

export function praisePet(state: PetState, minute: number): PetState {
  if (!isPetAlive(state)) {
    return state
  }

  const meters = {
    ...state.meters,
    discipline: clampDiscipline(state.meters.discipline + 5),
    happiness: Math.min(MAX_HEARTS, state.meters.happiness + 1),
  }

  const nextState = {
    ...state,
    meters,
    care: {
      ...state.care,
      mental: Math.max(0, state.care.mental - 1),
    },
  }

  return appendEvent(
    {
      ...nextState,
      mood: derivePetMood(nextState),
    },
    { type: 'praise', minute, detail: 'Praise improved training and mood' },
  )
}

export function registerMissedTraining(state: PetState, minute: number): PetState {
  if (!isPetAlive(state)) {
    return state
  }

  return appendEvent(
    {
      ...state,
      care: {
        ...state.care,
        total: state.care.total + 1,
        stage: state.care.stage + 1,
      },
    },
    { type: 'state-change', minute, detail: 'Training call was missed' },
  )
}
