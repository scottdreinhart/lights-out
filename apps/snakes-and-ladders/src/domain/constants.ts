import type { PlayerState } from './types'

export const BOARD_SIZE = 100
export const DICE_MIN = 1
export const DICE_MAX = 6
export const INITIAL_POSITION = 1

export const DEFAULT_PLAYERS: readonly PlayerState[] = [
  { id: 'human', name: 'You', position: INITIAL_POSITION },
  { id: 'cpu', name: 'CPU', position: INITIAL_POSITION },
]

// Canonical 10x10 board mapping used by the widely adopted modern ruleset.
export const LADDERS: Readonly<Record<number, number>> = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100,
}

export const SNAKES: Readonly<Record<number, number>> = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78,
}
