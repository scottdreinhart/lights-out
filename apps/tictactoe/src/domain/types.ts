export type Token = 'X' | 'O'
export type CellValue = Token | null
export type Board = CellValue[]
export type Difficulty = 'easy' | 'medium' | 'hard' | 'unbeatable'
export type SwipeDirection = 'up' | 'down' | 'left' | 'right'
export type Outcome = 'win' | 'loss' | 'draw'

export interface GameState {
  winner: Token | null
  winLine: number[] | null
  isDraw: boolean
  isOver: boolean
}

export interface WinResult {
  token: Token
  line: number[]
}

export interface Score {
  X: number
  O: number
  draws: number
}

export interface SeriesScore {
  X: number
  O: number
}

export interface ThemeSettings {
  colorTheme: string
  mode: string
  colorblind: string
}

export interface ColorTheme {
  id: string
  label: string
  accent: string
}

export interface ColorblindMode {
  id: string
  label: string
  description?: string
}

export interface Notification {
  id: number
  message: string
  variant: string
  duration: number
  hasAction?: boolean | undefined
}

export interface WorkerMessage {
  board: Board
  difficulty: Difficulty
  cpuToken: Token
  humanToken: Token
}

export interface WorkerResponse {
  index?: number
  error?: string
  engine?: 'wasm' | 'js'
}

export interface GameOutcome {
  result: 'human-win' | 'ai-win' | 'draw'
}

export interface GameStats {
  wins: number
  losses: number
  streak: number
  bestStreak: number
}
