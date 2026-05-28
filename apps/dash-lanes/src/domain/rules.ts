import { INITIAL_STATE } from './constants'
import { applyRunnerCommand, stepRunnerSimulation } from './simulation'
import type { GameState } from './types'

export type GameAction =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'laneLeft'
  | 'laneRight'
  | 'tick'
  | 'reset'

export const reduceGameState = (state: GameState, action: GameAction): GameState => {
  if (action === 'reset') {
    return INITIAL_STATE
  }
  if (state.phase === 'gameOver') {
    return state
  }

  if (action === 'tick') {
    return stepRunnerSimulation(state)
  }

  return applyRunnerCommand(state, action)
}
