import { INITIAL_STATE, PROGRESS_TARGET } from './constants'
import type { GameState } from './types'

export type GameAction = 'primary' | 'secondary' | 'tertiary' | 'tick' | 'reset'

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

const withGameOverCheck = (state: GameState): GameState => {
  if (state.lives <= 0) {
    return { ...state, phase: 'gameOver', status: 'System collapse: retry run' }
  }

  if (state.progress >= PROGRESS_TARGET) {
    return {
      ...state,
      phase: 'gameOver',
      status: 'Prototype objective reached',
      score: state.score + 25,
    }
  }

  return state
}

export const reduceGameState = (state: GameState, action: GameAction): GameState => {
  if (action === 'reset') {
    return INITIAL_STATE
  }
  if (state.phase === 'gameOver') {
    return state
  }

  if (action === 'tick') {
    const next = {
      ...state,
      tick: state.tick + 1,
      intensity: clamp(state.intensity + 2, 0, 100),
      focus: clamp(state.focus - 1, 0, 100),
      lives: state.intensity > 92 ? state.lives - 1 : state.lives,
      status: 'Paddle / Rotary pressure rising',
    }
    return withGameOverCheck(next)
  }

  if (action === 'primary') {
    const next = {
      ...state,
      score: state.score + 10,
      progress: state.progress + 4,
      focus: clamp(state.focus + 2, 0, 100),
      status: 'Deflect executed',
    }
    return withGameOverCheck(next)
  }

  if (action === 'secondary') {
    const next = {
      ...state,
      focus: clamp(state.focus + 8, 0, 100),
      intensity: clamp(state.intensity + -4, 0, 100),
      score: state.score + 2,
      status: 'Re-center recovered control',
    }
    return withGameOverCheck(next)
  }

  const next = {
    ...state,
    score: state.score + 16,
    progress: state.progress + 6,
    intensity: clamp(state.intensity + 8, 0, 100),
    focus: clamp(state.focus - 6, 0, 100),
    status: 'Power Spin high-risk burst',
  }
  return withGameOverCheck(next)
}
