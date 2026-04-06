/**
 * Pattern Bingo types
 * 5x5 grid with special winning patterns (X, T, L, U, H, corners, outer frame)
 */

export type Cell = {
  number: number
  marked: boolean
  hinted: boolean
}

export type Grid = Cell[][]

export type PatternType = 
  | 'row'
  | 'column'
  | 'diagonalMain'
  | 'diagonalAnti'
  | 'corners'
  | 'x'
  | 't'
  | 'l'
  | 'u'
  | 'h'
  | 'outerFrame'

export interface GameState {
  card: Grid
  drawnNumbers: Set<number>
  currentNumber: number | null
  winners: string[]
  gameActive: boolean
}

export interface CardCount {
  count: number
}
