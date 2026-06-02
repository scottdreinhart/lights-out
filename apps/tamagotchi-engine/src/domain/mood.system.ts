// Sources: https://tamagotchi.fandom.com/wiki/Care and
// https://tamagotchi.fandom.com/wiki/Tamagotchi_Angel

import { isPetAlive } from './afterlife'
import type { PetMood, PetState } from './types'

type MoodRule = {
  readonly mood: PetMood
  readonly matches: (state: PetState) => boolean
}

const MOOD_RULES: readonly MoodRule[] = [
  {
    mood: 'departed',
    matches: (state) => !isPetAlive(state) || state.stage === 'departed',
  },
  {
    mood: 'sleeping',
    matches: (state) => state.lifecycle.isSleeping || !state.lightsOn,
  },
  {
    mood: 'sick',
    matches: (state) => state.sicknessCount > 0,
  },
  {
    mood: 'very-hungry',
    matches: (state) =>
      state.attentionActive && state.calls.some((call) => !call.resolved && call.type === 'hunger'),
  },
  {
    mood: 'hungry',
    matches: (state) => state.meters.hunger === 0,
  },
  {
    mood: 'exhausted',
    matches: (state) => state.poopCount >= 3,
  },
  {
    mood: 'anxious',
    matches: (state) => state.meters.happiness === 0,
  },
  {
    mood: 'needy',
    matches: (state) => state.meters.happiness === 1,
  },
  {
    mood: 'delighted',
    matches: (state) =>
      state.meters.happiness >= 3 && state.meters.hunger >= 3 && state.care.total === 0,
  },
  {
    mood: 'playful',
    matches: (state) => state.meters.happiness >= 3,
  },
  {
    mood: 'calm',
    matches: (state) => state.meters.hunger >= 3,
  },
  {
    mood: 'curious',
    matches: (state) => state.lifecycle.ageMinutes < 10,
  },
]

export function derivePetMood(state: PetState): PetMood {
  for (const rule of MOOD_RULES) {
    if (rule.matches(state)) {
      return rule.mood
    }
  }

  return 'content'
}
