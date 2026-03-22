/**
 * Central type definitions — pure domain types, no framework dependencies.
 */

export type Player = 'human' | 'cpu'
export type GameMode = 'normal' | 'misere'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type Opponent = 'cpu' | 'local'

export interface Pile {
  id: number
  count: number
}

export interface Move {
  pileId: number
  removeCount: number
}

export interface GameState {
  piles: Pile[]
  currentPlayer: Player
  winner: Player | null
  isGameOver: boolean
  mode: GameMode
  lastMove: LastMove | null
}

export interface LastMove {
  pileId: number
  removeCount: number
  player: Player
}

export interface GameSetup {
  name: string
  initialCounts: number[]
}

export interface GamePreset {
  readonly name: string
  readonly counts: number[]
}

export interface GameStats {
  wins: number
  losses: number
  streak: number
  bestStreak: number
  pvp1Wins: number
  pvp2Wins: number
  streakWinner: 'player1' | 'player2'
  streakCount: number
  bestStreakWinner: 'player1' | 'player2'
  bestStreakCount: number
}

/** Shared theme types — identical across all games */

export interface ColorTheme {
  readonly id: string
  readonly label: string
  readonly accent: string
}

export interface ColorblindMode {
  readonly id: string
  readonly label: string
  readonly description?: string
}

export interface ThemeSettings {
  colorTheme: string
  mode: string
  colorblind: string
}
