// Sources: https://tamagotchi.fandom.com/wiki/Care and
// https://patents.google.com/patent/US5966526A/en

import { isPetAlive } from './afterlife'
import { MAX_DISCIPLINE, MAX_HEARTS, MAX_WEIGHT } from './constants'
import { debitPetBank, getActionPrice, getPetGenetics } from './economy'
import {
  getActiveAttentionCall,
  getAttentionResponseQuality,
  resolveAttentionCall,
} from './health.system'
import { derivePetMood } from './mood.system'
import { appendEvent } from './pet.model'
import type { AttentionResponseQuality, PetState } from './types'

function clampHeart(value: number): number {
  return Math.max(0, Math.min(MAX_HEARTS, value))
}

function spendCredits(
  state: PetState,
  action: 'treat' | 'feedMeal' | 'feedSnack' | 'gamePlay' | 'arcadePlay',
  minute: number,
): PetState {
  const price = getActionPrice(state, action)

  if (price <= 0) {
    return state
  }

  return appendEvent(
    {
      ...state,
      bank: debitPetBank(state, price),
    },
    {
      type: 'state-change',
      minute,
      detail: `${action} spent ${price} credit(s)`,
    },
  )
}

export function treatPet(state: PetState, minute: number): PetState {
  if (!isPetAlive(state)) {
    return state
  }

  const meters = {
    ...state.meters,
    happiness: clampHeart(state.meters.happiness + 1),
  }

  const nextState = {
    ...state,
    meters,
  }

  return appendEvent(
    {
      ...nextState,
      mood: derivePetMood(nextState),
    },
    { type: 'treat', minute, detail: 'Treat improved mood' },
  )
}

function getResponseBonus(
  quality: AttentionResponseQuality | null,
  fastBonus: number,
  steadyBonus: number,
  lateBonus: number,
): number {
  switch (quality) {
    case 'fast':
      return fastBonus
    case 'steady':
      return steadyBonus
    case 'late':
      return lateBonus
    default:
      return 0
  }
}

function resolveEffortCallResponse(
  state: PetState,
  minute: number,
): {
  state: PetState
  responseQuality: AttentionResponseQuality | null
} {
  const activeCall = getActiveAttentionCall(state, 'effort')

  if (!activeCall) {
    return { state, responseQuality: null }
  }

  const responseQuality = getAttentionResponseQuality(activeCall, minute)

  return {
    state: resolveAttentionCall(state, 'effort', minute),
    responseQuality,
  }
}

function resolveHungerCallResponse(
  state: PetState,
  minute: number,
): {
  state: PetState
  responseQuality: AttentionResponseQuality | null
} {
  const activeCall = getActiveAttentionCall(state, 'hunger')

  if (!activeCall) {
    return { state, responseQuality: null }
  }

  const responseQuality = getAttentionResponseQuality(activeCall, minute)

  return {
    state: resolveAttentionCall(state, 'hunger', minute),
    responseQuality,
  }
}

export function feedMeal(state: PetState, minute: number): PetState {
  if (!isPetAlive(state)) {
    return state
  }

  const chargedState = spendCredits(state, 'feedMeal', minute)
  const response = resolveHungerCallResponse(chargedState, minute)

  const meters = {
    ...response.state.meters,
    hunger: clampHeart(response.state.meters.hunger + 2),
    weight: Math.min(
      MAX_WEIGHT,
      response.state.meters.weight + 2 + getResponseBonus(response.responseQuality, 1, 0, 0),
    ),
    happiness: Math.min(
      MAX_HEARTS,
      response.state.meters.happiness + getResponseBonus(response.responseQuality, 1, 0, 0),
    ),
  }

  const nextState = {
    ...response.state,
    meters,
  }

  return appendEvent(
    {
      ...nextState,
      mood: derivePetMood(nextState),
    },
    { type: 'feedMeal', minute, detail: 'Meal restored hunger' },
  )
}

export function feedSnack(state: PetState, minute: number): PetState {
  if (!isPetAlive(state)) {
    return state
  }

  const chargedState = spendCredits(state, 'feedSnack', minute)

  const meters = {
    ...state.meters,
    hunger: clampHeart(state.meters.hunger + 1),
    happiness: clampHeart(state.meters.happiness + 1),
    weight: Math.min(MAX_WEIGHT, state.meters.weight + 1),
  }

  const nextState = {
    ...chargedState,
    meters,
  }

  return appendEvent(
    {
      ...nextState,
      mood: derivePetMood(nextState),
    },
    { type: 'feedSnack', minute, detail: 'Snack restored happiness' },
  )
}

export function playGame(state: PetState, minute: number, won: boolean): PetState {
  if (!isPetAlive(state)) {
    return state
  }

  const response = resolveEffortCallResponse(state, minute)
  const meters = {
    ...response.state.meters,
    happiness: won
      ? clampHeart(
          response.state.meters.happiness + 1 + getResponseBonus(response.responseQuality, 1, 0, 0),
        )
      : response.state.meters.happiness,
    weight: Math.max(0, response.state.meters.weight - 1),
  }

  const nextState = {
    ...response.state,
    meters,
  }

  return appendEvent(
    {
      ...nextState,
      mood: won ? 'playful' : derivePetMood(nextState),
    },
    {
      type: 'playGame',
      minute,
      detail: won
        ? 'Game improved happiness'
        : 'Game was lost and only boosted training indirectly',
    },
  )
}

export function gamePlay(state: PetState, minute: number): PetState {
  if (!isPetAlive(state)) {
    return state
  }

  const chargedState = spendCredits(state, 'gamePlay', minute)
  const response = resolveEffortCallResponse(chargedState, minute)

  const meters = {
    ...response.state.meters,
    happiness: clampHeart(
      response.state.meters.happiness + 1 + getResponseBonus(response.responseQuality, 1, 0, 0),
    ),
    weight: response.state.meters.weight,
  }

  const nextState = {
    ...response.state,
    meters,
  }

  return appendEvent(
    {
      ...nextState,
      mood: derivePetMood(nextState),
    },
    {
      type: 'gamePlay',
      minute,
      detail: 'Game play spent a credit for a smaller morale boost',
    },
  )
}

export function arcadePlay(state: PetState, minute: number): PetState {
  if (!isPetAlive(state)) {
    return state
  }

  const genetics = getPetGenetics(state)
  const chargedState = spendCredits(state, 'arcadePlay', minute)
  const response = resolveEffortCallResponse(chargedState, minute)

  const meters = {
    ...response.state.meters,
    happiness: clampHeart(
      response.state.meters.happiness +
        2 +
        genetics.rewardBoost +
        getResponseBonus(response.responseQuality, 1, 0, 0),
    ),
    discipline: Math.min(
      MAX_DISCIPLINE,
      response.state.meters.discipline + 1 + getResponseBonus(response.responseQuality, 1, 0, 0),
    ),
    weight: Math.max(0, response.state.meters.weight - 1),
  }

  const nextState = {
    ...response.state,
    meters,
  }

  return appendEvent(
    {
      ...nextState,
      mood: 'playful',
    },
    {
      type: 'arcadePlay',
      minute,
      detail: 'Arcade play spent credits for a stronger reward',
    },
  )
}

export function cleanPoo(state: PetState, minute: number): PetState {
  if (!isPetAlive(state)) {
    return state
  }

  return appendEvent(
    {
      ...state,
      poopCount: Math.max(0, state.poopCount - 1),
      mood: derivePetMood({
        ...state,
        poopCount: Math.max(0, state.poopCount - 1),
      }),
    },
    { type: 'cleanPoo', minute, detail: 'Cleaned the room' },
  )
}
