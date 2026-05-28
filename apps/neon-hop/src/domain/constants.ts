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
  slug: 'neon-hop',
  title: 'Neon Hop',
  family: 'Platform Physics',
  summary: 'Time jumps and recoveries with precision to keep a kinetic platform run alive.',
  primaryLabel: 'Jump',
  secondaryLabel: 'Balance',
  tertiaryLabel: 'Chain Hop',
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
  status: 'Ready for platform physics loop',
}
