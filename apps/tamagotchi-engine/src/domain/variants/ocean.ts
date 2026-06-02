// Sources: https://gotchi-garden.blogspot.com/p/tamagotchi-umino-ocean-care-sheet.html and
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

function tickOcean(state: PetState, elapsedMinutes: number): PetState {
  const nextMinute = state.lifecycle.ageMinutes + elapsedMinutes
  const hungerDecay = Math.max(1, Math.floor(elapsedMinutes / 20))
  const happinessDecay = Math.max(1, Math.floor(elapsedMinutes / 35))

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
      discipline: Math.max(0, state.meters.discipline - Math.floor(elapsedMinutes / 90)),
    },
  }

  return {
    ...nextState,
    history: [
      ...nextState.history,
      createPetEvent('tick', nextMinute, 'Ocean heart-rate loop advanced'),
    ],
  }
}

export const oceanVariant: VariantProfile = {
  id: 'ocean',
  name: 'Ocean',
  description: 'Higher care pressure with a discipline gate before the adult stage.',
  attentionCallType: 'discipline',
  baseAttentionWindowMinutes: 15,
  capabilities: {
    ...DEFAULT_VARIANT_CAPABILITIES,
    supportsPredatorEvents: true,
    supportsInjury: true,
    supportsSensorTap: true,
    supportsTouchUi: true,
  },
  uiPages: [...DEFAULT_VARIANT_UI_PAGES, { id: 'alerts', label: 'Alerts' }],
  eventTuning: {
    ...DEFAULT_VARIANT_EVENT_TUNING,
    decayMultiplier: 1.15,
  },
  hiddenState: {
    careMistakes: 0,
    hiddenCounters: { injuryCount: 0 },
    hiddenFlags: {},
  },
  performTick: tickOcean,
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
        evolved: minutes >= 90,
        nextStage: minutes >= 90 ? 'child' : 'baby',
        branch: 'ocean-baby',
        reason: 'Ocean baby stage is slower and more sensitive to care',
      }
    }

    if (state.stage === 'child') {
      return {
        evolved: minutes >= 180,
        nextStage: minutes >= 180 ? 'teen' : 'child',
        branch: 'ocean-child',
        reason: 'Ocean child stage requires steady feeding and cleanup',
      }
    }

    return {
      evolved: minutes >= 300,
      nextStage: minutes >= 300 && state.meters.discipline >= 75 ? 'adult' : 'departed',
      branch: 'ocean-adult',
      reason: 'Ocean adult evolution is gated by a strict discipline threshold',
    }
  },
}
