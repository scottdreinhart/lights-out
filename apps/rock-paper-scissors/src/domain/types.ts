/**
 * Central type definitions — pure domain types, no framework dependencies.
 */

export type Move = 'rock' | 'paper' | 'scissors'

export type RoundResult = 'win' | 'loss' | 'draw'

export interface Round {
  readonly playerMove: Move
  readonly cpuMove: Move
  readonly result: RoundResult
}

export interface GameState {
  readonly rounds: Round[]
  readonly playerScore: number
  readonly cpuScore: number
  readonly bestOf: number
  readonly isGameOver: boolean
  readonly gameWinner: 'player' | 'cpu' | null
}

export interface GameStats {
  readonly playerWins: number
  readonly cpuWins: number
  readonly draws: number
  readonly totalRounds: number
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
