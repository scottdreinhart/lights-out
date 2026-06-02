import { DEFAULT_DRAW_SPEED, GRID_SIZE } from './constants'

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

export type WinningPattern =
  | 'horizontal-top'
  | 'horizontal-middle'
  | 'horizontal-bottom'
  | 'vertical-left'
  | 'vertical-center'
  | 'vertical-right'
  | 'diagonal-main'
  | 'diagonal-anti'
  | 'full-house'

export interface WinnerCheck {
  isWinner: boolean
  patterns: WinningPattern[]
}

export interface SpeedBingoGameState {
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
export const MAX_CARDS = 5
export { DEFAULT_DRAW_SPEED, GRID_SIZE }
