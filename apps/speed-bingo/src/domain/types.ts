/**
 * Speed Bingo domain types and constants.
 * Fast-paced bingo with rapid number drawing.
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

export interface SpeedBingoGameState {
  cards: BingoCard[]
  drawnNumbers: Set<number>
  winners: string[]
  gameActive: boolean
  currentDrawn: number | null
  drawSpeed: number // milliseconds between auto-draws
  isAutoDrawing: boolean
}

export interface DrawResult {
  number: number
  winners: string[]
}

export const GRID_SIZE = 5
export const MIN_CARDS = 1
export const MAX_CARDS = 5 // Fewer cards for speed
export const WINNING_PATTERNS = [
  'horizontal',
  'vertical',
  'diagonal-left',
  'diagonal-right',
] as const

// Speed bingo settings
export const DEFAULT_DRAW_SPEED = 2000 // 2 seconds between draws
export const FAST_DRAW_SPEED = 1000 // 1 second for ultra-fast
export const SLOW_DRAW_SPEED = 3000 // 3 seconds for slower pace