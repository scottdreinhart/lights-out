import type { GameState } from './types'

export interface GameMeta {
  slug: string
  title: string
  family: string
  summary: string
  primaryLabel: string
  secondaryLabel: string
  tertiaryLabel: string
}

export const GAME_META: GameMeta = {
  slug: 'beat-grid',
  title: 'Beat Grid',
  family: 'Rhythm Timing',
  summary: 'Hit timing windows and sustain combo chains as beat density ramps upward.',
  primaryLabel: 'Hit Window',
  secondaryLabel: 'Re-sync',
  tertiaryLabel: 'Combo Push',
}

export const PROGRESS_TARGET = 110

export const INITIAL_STATE: GameState = {
  phase: 'playing',
  tick: 0,
  score: 0,
  lives: 3,
  intensity: 10,
  progress: 0,
  focus: 50,
  status: 'Ready for rhythm timing loop',
}
