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
  slug: 'block-fall',
  title: 'Block Fall',
  family: 'Falling Block Puzzle',
  summary: 'Place and stabilize falling pieces while pace and collapse pressure intensify.',
  primaryLabel: 'Drop Piece',
  secondaryLabel: 'Settle Board',
  tertiaryLabel: 'Hard Drop',
}

export const PROGRESS_TARGET = 125

export const INITIAL_STATE: GameState = {
  phase: 'playing',
  tick: 0,
  score: 0,
  lives: 3,
  intensity: 10,
  progress: 0,
  focus: 50,
  status: 'Ready for falling block puzzle loop',
}
