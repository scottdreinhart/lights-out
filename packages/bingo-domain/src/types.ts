/**
 * Bingo domain types and constants.
 */

export type BingoColumn = 'B' | 'I' | 'N' | 'G' | 'O'
export const COLUMNS: BingoColumn[] = ['B', 'I', 'N', 'G', 'O']
export const COLUMN_RANGES: Record<BingoColumn, [number, number]> = {
  B: [1, 15],
  I: [16, 30],
  N: [31, 45],
  G: [46, 60],
  O: [61, 75],
}

export interface BingoCell {
  number: number | null
  marked: boolean
  isFreeSpace: boolean
}

export interface BingoCard {
  id: string
  grid: BingoCell[][]
}

export interface BingoGameState {
  cards: BingoCard[]
  drawnNumbers: Set<number>
  winners: string[]
  gameActive: boolean
  currentDrawn: number | null
}

export interface DrawResult {
  number: number
  winners: string[]
}

export const GRID_SIZE = 5
export const MIN_CARDS = 1
export const MAX_CARDS = 10
export const WINNING_PATTERNS = [
  'horizontal',
  'vertical',
  'diagonal-left',
  'diagonal-right',
  'four-corners',
  'blackout',
] as const

export type WinningPattern = (typeof WINNING_PATTERNS)[number]
