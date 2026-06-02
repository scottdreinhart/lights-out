// Sources: https://patents.google.com/patent/US5966526A/en and
// https://tamagotchi.fandom.com/wiki/Training

import { applyPetDeparture, isPetAlive, isPetInMemorial, resurrectPet } from './afterlife'
import {
  arcadePlay,
  cleanPoo,
  feedMeal,
  feedSnack,
  gamePlay,
  playGame,
  treatPet,
} from './care.system'
import { disciplinePet, praisePet, registerMissedTraining } from './discipline.system'
import { evaluateEvolution } from './evolution.engine'
import { cureSickness } from './health.system'
import { applyLifeExpectancyDeparture } from './lifecycle'
import { createInitialPetState } from './pet.model'
import { advanceTimer } from './timer.engine'
import type { PetActionType, PetRuntime, PetState, VariantId } from './types'

export interface PetAction {
  type: PetActionType
  minute: number
  elapsedMinutes?: number
  payload?: {
    won?: boolean
    variantId?: VariantId
    petName?: string
  }
}

function finalizeEvolution(state: PetState, minute: number): PetState {
  const departedState = applyLifeExpectancyDeparture(state, minute)

  if (!isPetAlive(departedState)) {
    return departedState
  }

  const evolution = evaluateEvolution(state)

  if (!evolution.evolved || state.stage === evolution.nextStage) {
    return state
  }

  if (evolution.nextStage === 'departed') {
    return applyPetDeparture(state, minute, evolution.reason)
  }

  return {
    ...state,
    stage: evolution.nextStage,
    lifecycle: {
      ...state.lifecycle,
      stageEnteredAtMinute: state.lifecycle.ageMinutes,
    },
    history: [
      ...state.history,
      {
        type: 'evolution',
        minute,
        detail: `${state.stage} evolved to ${evolution.nextStage} (${evolution.branch})`,
      },
    ],
  }
}

type ActionHandler = (state: PetState, action: PetAction) => PetState

function toggleLights(state: PetState, minute: number, lightsOn: boolean): PetState {
  if (!isPetAlive(state)) {
    return state
  }

  return {
    ...state,
    lightsOn,
    history: [
      ...state.history,
      {
        type: lightsOn ? 'lightsOn' : 'lightsOff',
        minute,
        detail: lightsOn ? 'Lights were turned on' : 'Lights were turned off',
      },
    ],
  }
}

const actionHandlers: Partial<Record<Exclude<PetActionType, 'reset' | 'tick'>, ActionHandler>> = {
  treat: (state, action) => treatPet(state, action.minute),
  feedMeal: (state, action) => feedMeal(state, action.minute),
  feedSnack: (state, action) => feedSnack(state, action.minute),
  playGame: (state, action) => playGame(state, action.minute, action.payload?.won ?? true),
  gamePlay: (state, action) => gamePlay(state, action.minute),
  arcadePlay: (state, action) => arcadePlay(state, action.minute),
  discipline: (state, action) => disciplinePet(state, action.minute),
  praise: (state, action) => praisePet(state, action.minute),
  cleanPoo: (state, action) => cleanPoo(state, action.minute),
  medicine: (state, action) => cureSickness(state, action.minute),
  lightsOn: (state, action) => toggleLights(state, action.minute, true),
  lightsOff: (state, action) => toggleLights(state, action.minute, false),
}

function applyTickAction(state: PetState, action: PetAction, runtime?: PetRuntime): PetState {
  const advancedState = advanceTimer(state, action.elapsedMinutes ?? 1, action.minute, runtime)
  return finalizeEvolution(registerMissedTraining(advancedState, action.minute), action.minute)
}

function applyStandardAction(state: PetState, action: PetAction): PetState {
  return applyAction(state, action)
}

function applyAction(state: PetState, action: PetAction): PetState {
  const handler = actionHandlers[action.type as Exclude<PetActionType, 'reset' | 'tick'>]

  if (!handler) {
    return state
  }

  return handler(state, action)
}

export function dispatchPetAction(
  state: PetState,
  action: PetAction,
  runtime?: PetRuntime,
): PetState {
  if (action.type === 'reset') {
    return createInitialPetState(
      action.payload?.variantId ?? state.variantId,
      action.payload?.petName ?? state.name,
    )
  }

  if (!isPetAlive(state) && !isPetInMemorial(state)) {
    return state
  }

  if (action.type === 'resurrect') {
    return resurrectPet(state, action.minute)
  }

  if (action.type === 'tick') {
    return applyTickAction(state, action, runtime)
  }

  return applyStandardAction(state, action)
}

export function createPetLifecycle(variantId: VariantId, petName?: string): PetState {
  return createInitialPetState(variantId, petName)
}
