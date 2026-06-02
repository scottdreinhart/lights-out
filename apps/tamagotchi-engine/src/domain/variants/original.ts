// Sources: https://patents.google.com/patent/US5966526A/en and
// https://tamagotchi.fandom.com/wiki/Care

import { feedMeal, feedSnack, gamePlay, playGame } from '../care.system'
import {
  DEFAULT_VARIANT_CAPABILITIES,
  DEFAULT_VARIANT_EVENT_TUNING,
  DEFAULT_VARIANT_UI_PAGES,
} from '../constants'
import { disciplinePet } from '../discipline.system'
import { createPetEvent } from '../pet.model'
import type { PetState } from '../types'
import type { VariantProfile } from '../variant.interface'

function tickOriginal(state: PetState, elapsedMinutes: number): PetState {
  const nextMinute = state.lifecycle.ageMinutes + elapsedMinutes
  const hungerDecay = Math.max(1, Math.floor(elapsedMinutes / 30))
  const happinessDecay = Math.max(1, Math.floor(elapsedMinutes / 45))

  const nextState: PetState = {
    ...state,
    lifecycle: {
      ...state.lifecycle,
      ageMinutes: nextMinute,
    },
    meters: {
      ...state.meters,
      hunger: Math.max(0, state.meters.hunger - hungerDecay),
      happiness: Math.max(0, state.meters.happiness - happinessDecay),
      weight: Math.max(0, state.meters.weight - Math.floor(elapsedMinutes / 60)),
    },
  }

  return {
    ...nextState,
    history: [
      ...nextState.history,
      createPetEvent('tick', nextMinute, 'Original variant heart meter advanced'),
    ],
  }
}

export const originalVariant: VariantProfile = {
  id: 'original',
  name: 'Original',
  description: 'Classic hunger, happiness, and discipline loop with care-mistake driven evolution.',
  attentionCallType: 'hunger',
  baseAttentionWindowMinutes: 15,
  capabilities: DEFAULT_VARIANT_CAPABILITIES,
  uiPages: DEFAULT_VARIANT_UI_PAGES,
  eventTuning: DEFAULT_VARIANT_EVENT_TUNING,
  hiddenState: {
    careMistakes: 0,
    hiddenCounters: {},
    hiddenFlags: {},
  },
  performTick: tickOriginal,
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
      case 'discipline':
        return disciplinePet(state, state.lifecycle.ageMinutes)
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
        branch: 'original-baby',
        reason: 'Baby growth uses a clock-driven child threshold',
      }
    }

    if (state.stage === 'child') {
      return {
        evolved: minutes >= 180,
        nextStage: minutes >= 180 ? 'teen' : 'child',
        branch: 'original-child',
        reason: 'Child stage matures into teen based on clock time',
      }
    }

    return {
      evolved: minutes >= 360,
      nextStage: minutes >= 360 ? 'adult' : state.stage,
      branch: 'original-adult',
      reason: 'Teen evolution resolves into the adult branch',
    }
  },
}
