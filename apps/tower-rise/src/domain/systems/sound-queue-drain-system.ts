import type { GameState } from '../core/game-state'

export function applySoundQueueDrainSystem(state: GameState): GameState {
  if (state.soundEvents.length === 0) {
    return state
  }

  return {
    ...state,
    soundEvents: [],
  }
}
