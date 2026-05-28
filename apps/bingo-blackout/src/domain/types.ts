import { DEFAULT_DRAW_SPEED, GRID_SIZE } from './constants'

export type BingoColumn = 'B' | 'I' | 'N' | 'G' | 'O'
export const COLUMNS: BingoColumn[] = ['B', 'I', 'N', 'G', 'O']
export const COLUMN_RANGES: Record<BingoColumn, [number, number]> = {
  B: [1, 18],
  I: [19, 36],
  N: [37, 54],
  G: [55, 72],
  O: [73, 90],
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

export type WinningPattern = 'blackout'

export interface WinnerCheck {
  isWinner: boolean
  patterns: WinningPattern[]
}

export interface BlackoutBingoGameState {
  cards: BingoCard[]
  drawnNumbers: Set<number>
  winners: string[]
  gameActive: boolean
  currentDrawn: number | null
  drawSpeed: number
  isAutoDrawing: boolean
}

export interface DrawResult {
  number: number
  winners: string[]
}

export const MIN_CARDS = 1
export const MAX_CARDS = 4
export { DEFAULT_DRAW_SPEED, GRID_SIZE }
