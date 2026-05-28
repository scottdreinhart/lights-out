// Sources: https://tamagotchi.fandom.com/wiki/Care and
// https://tamagotchi.fandom.com/wiki/Tamagotchi_Angel

import { isPetAlive } from './afterlife'
import { ATTENTION_WINDOW_MINUTES, MAX_HEARTS } from './constants'
import { creditPetBank } from './economy'
import { getPetLifeProgress } from './lifecycle'
import { getPetMemory } from './memory'
import { derivePetMood } from './mood.system'
import type {
  AttentionResponseQuality,
  DecayProfile,
  PetCall,
  PetCallType,
  PetRuntime,
  PetState,
} from './types'

function createDecayProfile(elapsedMinutes: number): DecayProfile {
  const base = {
    hungerLoss: Math.max(1, Math.floor(elapsedMinutes / 30)),
    happinessLoss: Math.max(1, Math.floor(elapsedMinutes / 45)),
    weightLoss: Math.floor(elapsedMinutes / 60),
  }

  return base
}

function getDecayMultiplier(state: PetState): number {
  const lifeProgress = getPetLifeProgress(state) / 100
  const memory = getPetMemory(state)
  const variantBase = state.variantId === 'ocean' ? 1.2 : state.variantId === 'angel' ? 0.9 : 1
  const memoryPressure = memory.neglectStreakDays * 0.08
  const memorySupport = memory.careStreakDays * 0.04

  return Math.min(
    2.5,
    Math.max(0.8, variantBase * (1 + lifeProgress * 0.45 + memoryPressure - memorySupport)),
  )
}

function scaleProfile(profile: DecayProfile, multiplier: number): DecayProfile {
  return {
    hungerLoss: Math.max(1, Math.round(profile.hungerLoss * multiplier)),
    happinessLoss: Math.max(1, Math.round(profile.happinessLoss * multiplier)),
    weightLoss: Math.max(0, Math.round(profile.weightLoss * multiplier)),
  }
}

function issueCall(state: PetState, type: PetCallType, minute: number): PetState {
  const callExists = state.calls.some((call) => !call.resolved && call.type === type)

  if (callExists) {
    return state
  }

  const call = {
    type,
    issuedAtMinute: minute,
    expiresAtMinute: minute + ATTENTION_WINDOW_MINUTES,
    resolvedAtMinute: null,
    resolved: false,
  }

  return {
    ...state,
    attentionActive: true,
    calls: [...state.calls, call],
    history: [...state.history, { type: 'call', minute, detail: `${type} attention call started` }],
  }
}

export function getActiveAttentionCall(state: PetState, type: PetCallType): PetCall | null {
  return state.calls.find((call) => !call.resolved && call.type === type) ?? null
}

export function getAttentionResponseQuality(
  call: PetCall,
  minute: number,
): AttentionResponseQuality {
  const elapsedMinutes = Math.max(0, minute - call.issuedAtMinute)
  const callWindow = Math.max(1, call.expiresAtMinute - call.issuedAtMinute)

  if (elapsedMinutes <= callWindow / 3) {
    return 'fast'
  }

  if (elapsedMinutes <= (callWindow * 2) / 3) {
    return 'steady'
  }

  if (elapsedMinutes <= callWindow) {
    return 'late'
  }

  return 'missed'
}

export function getAttentionIncome(call: PetCall, quality: AttentionResponseQuality): number {
  if (quality === 'missed') {
    return 0
  }

  const baseIncome =
    call.type === 'sickness' ? 3 : call.type === 'discipline' ? 2 : call.type === 'praise' ? 1 : 2

  return baseIncome + (quality === 'fast' ? 1 : 0)
}

export function resolveAttentionCall(state: PetState, type: PetCallType, minute: number): PetState {
  if (!isPetAlive(state)) {
    return state
  }

  const activeCall = getActiveAttentionCall(state, type)

  if (!activeCall) {
    return state
  }

  const nextQuality = getAttentionResponseQuality(activeCall, minute)
  const income = getAttentionIncome(activeCall, nextQuality)
  const bank = income > 0 ? creditPetBank(state, income) : state.bank

  return {
    ...state,
    bank,
    calls: state.calls.map((call) =>
      call === activeCall
        ? {
            ...call,
            resolved: true,
            resolvedAtMinute: minute,
            responseQuality: nextQuality,
          }
        : call,
    ),
    attentionActive: state.calls.some((call) => !call.resolved && call !== activeCall),
    history: [
      ...state.history,
      ...[
        {
          type: 'state-change',
          minute,
          detail: `${type} attention resolved with ${nextQuality} response${
            income > 0 ? ` and earned ${income} credit(s)` : ''
          }`,
        },
      ],
    ],
  }
}

export function decayHealth(
  state: PetState,
  elapsedMinutes: number,
  minute: number,
  runtime?: PetRuntime,
): PetState {
  if (!isPetAlive(state)) {
    return state
  }

  const decayProfile =
    runtime?.calculateDecayProfile?.(elapsedMinutes) ??
    scaleProfile(createDecayProfile(elapsedMinutes), getDecayMultiplier(state))

  const meters = {
    ...state.meters,
    hunger: Math.max(0, state.meters.hunger - decayProfile.hungerLoss),
    happiness: Math.max(0, state.meters.happiness - decayProfile.happinessLoss),
    weight: Math.max(0, state.meters.weight - decayProfile.weightLoss),
  }

  let nextState: PetState = {
    ...state,
    meters,
    lifecycle: {
      ...state.lifecycle,
      ageMinutes: state.lifecycle.ageMinutes + elapsedMinutes,
    },
    mood: state.mood,
  }

  if (meters.hunger === 0) {
    nextState = issueCall(nextState, 'hunger', minute)
  }

  if (meters.happiness === 0) {
    nextState = issueCall(nextState, 'effort', minute)
  }

  return {
    ...nextState,
    mood: derivePetMood(nextState),
  }
}

export function resolveCallTimeouts(state: PetState, minute: number): PetState {
  if (!isPetAlive(state)) {
    return state
  }

  let nextState = state
  const nextCalls = state.calls.map((call) => {
    if (call.resolved || minute <= call.expiresAtMinute) {
      return call
    }

    const updatedCall = {
      ...call,
      resolved: true,
      resolvedAtMinute: minute,
      responseQuality: 'missed' as const,
    }

    const care = {
      ...nextState.care,
      physical:
        nextState.care.physical + (call.type === 'hunger' || call.type === 'sickness' ? 1 : 0),
      mental: nextState.care.mental + (call.type === 'effort' || call.type === 'praise' ? 1 : 0),
    }

    care.total = care.physical + care.mental
    care.stage = care.stage + 1

    nextState = {
      ...nextState,
      care,
      history: [
        ...nextState.history,
        { type: 'state-change', minute, detail: `${call.type} call missed the response window` },
      ],
    }

    return updatedCall
  })

  return {
    ...nextState,
    calls: nextCalls,
    attentionActive: nextCalls.some((call) => !call.resolved),
  }
}

export function cureSickness(state: PetState, minute: number): PetState {
  if (!isPetAlive(state)) {
    return state
  }

  const sicknessCount = Math.max(0, state.sicknessCount - 1)

  return {
    ...state,
    sicknessCount,
    meters: {
      ...state.meters,
      discipline: Math.min(MAX_HEARTS * 25, state.meters.discipline + 5),
    },
    mood: derivePetMood({
      ...state,
      sicknessCount,
      meters: {
        ...state.meters,
        discipline: Math.min(MAX_HEARTS * 25, state.meters.discipline + 5),
      },
    }),
    history: [...state.history, { type: 'medicine', minute, detail: 'Medicine cleared sickness' }],
  }
}

export function markPoo(state: PetState, minute: number): PetState {
  if (!isPetAlive(state)) {
    return state
  }

  return {
    ...state,
    poopCount: state.poopCount + 1,
    history: [
      ...state.history,
      { type: 'state-change', minute, detail: 'Poo spawned and needs cleanup' },
    ],
  }
}
