// Sources: https://patents.google.com/patent/US5966526A/en and
// https://github.com/loociano/tamagotchi-tech-specs/blob/master/index.md

import { getPetGenetics } from './economy'
import type { PetAfterlife, PetResurrectionSnapshot, PetState } from './types'

export const MEMORIAL_WINDOW_MINUTES = 24 * 60

function createAfterlifeEvent(
  type: 'departure' | 'resurrect' | 'state-change',
  minute: number,
  detail: string,
) {
  return { type, minute, detail }
}

export function createPetAfterlife(): PetAfterlife {
  return {
    phase: 'alive',
    deathMinute: null,
    memorialUntilMinute: null,
    resurrectionCount: 0,
    preservedState: null,
  }
}

export function getPetAfterlife(state: PetState): PetAfterlife {
  if (state.lifecycle.isDeparted) {
    return {
      phase: 'tombstone',
      deathMinute: state.lifecycle.ageMinutes,
      memorialUntilMinute: state.lifecycle.ageMinutes,
      resurrectionCount: state.lifecycle.resurrectionCount,
      preservedState: null,
    }
  }

  if (state.afterlife) {
    return state.afterlife
  }

  return createPetAfterlife()
}

export function isPetAlive(state: PetState): boolean {
  return getPetAfterlife(state).phase === 'alive'
}

export function isPetInMemorial(state: PetState): boolean {
  return getPetAfterlife(state).phase === 'memorial'
}

export function isPetTombstone(state: PetState): boolean {
  return getPetAfterlife(state).phase === 'tombstone'
}

function buildResurrectionSnapshot(state: PetState): PetResurrectionSnapshot {
  return {
    id: state.id,
    variantId: state.variantId,
    name: state.name,
    lifecycle: {
      ...state.lifecycle,
    },
    stage: state.stage === 'departed' ? 'adult' : state.stage,
    mood: state.stage === 'departed' ? 'content' : state.mood,
    meters: {
      ...state.meters,
    },
    care: {
      ...state.care,
    },
    sicknessCount: state.sicknessCount,
    poopCount: state.poopCount,
    attentionActive: state.attentionActive,
    lightsOn: state.lightsOn,
    calls: state.calls.map((call) => ({ ...call })),
    memory: {
      ...(state.memory ?? {
        careStreakDays: 0,
        neglectStreakDays: 0,
        recoveryStreakDays: 0,
        lastTrackedDay: 0,
      }),
    },
    bank: state.bank ? { ...state.bank } : undefined,
    genetics: state.genetics ? { ...state.genetics } : undefined,
    history: state.history.map((event) => ({ ...event })),
  }
}

export function applyPetDeparture(state: PetState, minute: number, detail: string): PetState {
  const afterlife = getPetAfterlife(state)

  if (afterlife.phase !== 'alive') {
    return state
  }

  return {
    ...state,
    stage: 'departed',
    lifecycle: {
      ...state.lifecycle,
      isDeparted: false,
    },
    afterlife: {
      phase: 'memorial',
      deathMinute: minute,
      memorialUntilMinute:
        minute + MEMORIAL_WINDOW_MINUTES + getPetGenetics(state).memorialBonusMinutes,
      resurrectionCount: state.lifecycle.resurrectionCount,
      preservedState: buildResurrectionSnapshot(state),
    },
    history: [...state.history, createAfterlifeEvent('departure', minute, detail)],
  }
}

export function advancePetAfterlife(state: PetState, minute: number): PetState {
  const afterlife = getPetAfterlife(state)

  if (afterlife.phase !== 'memorial' || afterlife.memorialUntilMinute === null) {
    return state
  }

  if (minute < afterlife.memorialUntilMinute) {
    return state
  }

  return {
    ...state,
    lifecycle: {
      ...state.lifecycle,
      isDeparted: true,
    },
    afterlife: {
      ...afterlife,
      phase: 'tombstone',
    },
    history: [
      ...state.history,
      createAfterlifeEvent('state-change', minute, 'Memorial window ended; tombstone remains'),
    ],
  }
}

export function resurrectPet(state: PetState, minute: number): PetState {
  const afterlife = getPetAfterlife(state)

  if (afterlife.phase !== 'memorial' || !afterlife.preservedState) {
    return state
  }

  const revivedState = {
    ...afterlife.preservedState,
    lifecycle: {
      ...afterlife.preservedState.lifecycle,
      resurrectionCount: afterlife.preservedState.lifecycle.resurrectionCount + 1,
      isDeparted: false,
    },
    afterlife: createPetAfterlife(),
  }

  return {
    ...revivedState,
    history: [
      ...revivedState.history,
      createAfterlifeEvent(
        'resurrect',
        minute,
        `Resurrected from memorial after ${afterlife.deathMinute ?? minute} minute(s)`,
      ),
    ],
  }
}
