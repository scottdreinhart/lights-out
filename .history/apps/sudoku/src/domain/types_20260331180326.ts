// ============== Sudoku Types ==============

export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type Cell = Digit | 0

export interface Board {
  grid: Cell[][]
}

export interface GameState {
  board: Board
  solution: Board
  difficulty: Difficulty
  startedAt: number
  moves: Move[]
}

export interface Move {
  row: number
  col: number
  value: Cell
  timestamp: number
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export interface GameStatistics {
  gamesPlayed: number
  gamesWon: number
  totalPlayTime: number
  averagePlayTime: number
  bestTime: number
  currentStreak: number
}
