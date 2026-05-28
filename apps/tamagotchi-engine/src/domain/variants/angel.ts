// Sources: https://tamagotchi.fandom.com/wiki/Tamagotchi_Angel and
// https://tamagotchi.fandom.com/wiki/Training

import { feedMeal, feedSnack, gamePlay, playGame } from '../care.system'
import {
  DEFAULT_VARIANT_CAPABILITIES,
  DEFAULT_VARIANT_EVENT_TUNING,
  DEFAULT_VARIANT_UI_PAGES,
} from '../constants'
import { praisePet } from '../discipline.system'
import { createPetEvent } from '../pet.model'
import type { PetState } from '../types'
import type { VariantProfile } from '../variant.interface'

function tickAngel(state: PetState, elapsedMinutes: number): PetState {
  const nextMinute = state.lifecycle.ageMinutes + elapsedMinutes
  const hungerDecay = Math.max(1, Math.floor(elapsedMinutes / 30))
  const effortDecay = Math.max(1, Math.floor(elapsedMinutes / 40))

  const nextState: PetState = {
    ...state,
    lifecycle: {
      ...state.lifecycle,
      ageMinutes: nextMinute,
    },
    meters: {
      ...state.meters,
      hunger: Math.max(0, state.meters.hunger - hungerDecay),
      effort: Math.max(0, state.meters.effort - effortDecay),
      angelPower: Math.max(0, state.meters.angelPower - Math.floor(elapsedMinutes / 60)),
    },
  }

  return {
    ...nextState,
    history: [
      ...nextState.history,
      createPetEvent('tick', nextMinute, 'Angel prayer and effort meter advanced'),
    ],
  }
}

export const angelVariant: VariantProfile = {
  id: 'angel',
  name: 'Angel',
  description: 'Prayer, deeds, and effort replace the usual happiness loop.',
  attentionCallType: 'effort',
  baseAttentionWindowMinutes: 15,
  capabilities: {
    ...DEFAULT_VARIANT_CAPABILITIES,
    supportsPraise: true,
    supportsSensorTap: true,
    supportsTouchUi: true,
  },
  uiPages: [
    ...DEFAULT_VARIANT_UI_PAGES,
    { id: 'praise', label: 'Praise' },
    { id: 'alerts', label: 'Alerts' },
  ],
  eventTuning: {
    ...DEFAULT_VARIANT_EVENT_TUNING,
    decayMultiplier: 0.85,
  },
  hiddenState: {
    careMistakes: 0,
    hiddenCounters: { angelPower: 25, deeds: 0 },
    hiddenFlags: {},
  },
  performTick: tickAngel,
  resolveAction: (state, action) => {
    switch (action) {
      case 'feedMeal':
        return feedMeal(state, state.lifecycle.ageMinutes)
      case 'feedSnack':
        return feedSnack(state, state.lifecycle.ageMinutes)
      case 'playGame':
        return playGame(state, state.lifecycle.ageMinutes, true)
      case 'gamePlay':
        return gamePlay(state, state.lifecycle.ageMinutes)
      case 'praise':
        return praisePet(state, state.lifecycle.ageMinutes)
      default:
        return state
    }
  },
  evaluateEvolution: (state) => {
    const minutes = state.lifecycle.ageMinutes - state.lifecycle.stageEnteredAtMinute

    if (state.stage === 'baby') {
      return {
        evolved: minutes >= 65,
        nextStage: minutes >= 65 ? 'child' : 'baby',
        branch: 'angel-baby',
        reason: 'Angel baby stage promotes to child at the clock threshold',
      }
    }

    if (state.stage === 'child') {
      return {
        evolved: minutes >= 120,
        nextStage: minutes >= 120 ? 'teen' : 'child',
        branch: 'angel-child',
        reason: 'Child stage graduates into a prayer-aware teen branch',
      }
    }

    return {
      evolved: minutes >= 180,
      nextStage: minutes >= 180 && state.meters.angelPower >= 75 ? 'special' : 'adult',
      branch: 'angel-adult',
      reason: 'Angel power and care quality determine the adult branch',
    }
  },
}
