import type { GameStats, Token } from './types.ts'

export const TOKENS: { readonly HUMAN: Token; readonly CPU: Token } = {
  HUMAN: 'X',
  CPU: 'O',
} as const

export const BOARD_SIZE = 3
export const CPU_DELAY_MS = 400

export const WIN_LINES: readonly number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // columns
  [0, 4, 8],
  [2, 4, 6], // diagonals
]

export const DEFAULT_STATS: GameStats = {
  wins: 0,
  losses: 0,
  streak: 0,
  bestStreak: 0,
}
