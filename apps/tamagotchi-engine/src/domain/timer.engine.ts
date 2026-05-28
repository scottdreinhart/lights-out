// Sources: https://tamagotchi.fandom.com/wiki/Tamagotchi_Angel and
// https://github.com/loociano/tamagotchi-tech-specs/blob/master/index.md

import { isPetAlive, isPetInMemorial } from './afterlife'
import { REAL_WORLD_MINUTES_PER_DAY } from './constants'
import { decayHealth, resolveCallTimeouts } from './health.system'
import { applyDayTransition, applyMemorialProgress } from './lifecycle'
import { appendEvent } from './pet.model'
import type { PetRuntime, PetState } from './types'

export function advanceTimer(
  state: PetState,
  elapsedMinutes: number,
  minute: number,
  runtime?: PetRuntime,
): PetState {
  if (!isPetAlive(state) && !isPetInMemorial(state)) {
    return state
  }

  if (isPetInMemorial(state)) {
    const memorialState = {
      ...state,
      lifecycle: {
        ...state.lifecycle,
        ageMinutes: state.lifecycle.ageMinutes + elapsedMinutes,
      },
    }

    return appendEvent(applyMemorialProgress(memorialState, minute), {
      type: 'tick',
      minute,
      detail: `Memorial aged by ${elapsedMinutes} minute(s)`,
    })
  }

  let nextState = decayHealth(state, elapsedMinutes, minute, runtime)
  nextState = resolveCallTimeouts(nextState, minute)

  const startDay = Math.floor(state.lifecycle.ageMinutes / REAL_WORLD_MINUTES_PER_DAY) + 1
  const endDay = Math.floor(nextState.lifecycle.ageMinutes / REAL_WORLD_MINUTES_PER_DAY) + 1

  for (let day = startDay + 1; day <= endDay; day += 1) {
    nextState = applyDayTransition(nextState, minute, day)
  }

  return appendEvent(nextState, {
    type: 'tick',
    minute,
    detail: `Advanced lifecycle by ${elapsedMinutes} minute(s)`,
  })
}
