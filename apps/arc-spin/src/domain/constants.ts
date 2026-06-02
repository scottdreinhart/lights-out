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
  slug: 'arc-spin',
  title: 'Arc Spin',
  family: 'Paddle / Rotary',
  summary: 'Deflect incoming vectors with precision and build combo pressure on clean returns.',
  primaryLabel: 'Deflect',
  secondaryLabel: 'Re-center',
  tertiaryLabel: 'Power Spin',
}

export const PROGRESS_TARGET = 115

export const INITIAL_STATE: GameState = {
  phase: 'playing',
  tick: 0,
  score: 0,
  lives: 3,
  intensity: 10,
  progress: 0,
  focus: 50,
  status: 'Ready for paddle / rotary loop',
}
