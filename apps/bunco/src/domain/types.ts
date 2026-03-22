/**
 * Central type definitions — pure domain types, no framework dependencies.
 */

export type Player = 'human' | 'cpu'
export type DieValue = 1 | 2 | 3 | 4 | 5 | 6

export interface RollResult {
  dice: [DieValue, DieValue, DieValue]
  points: number
  isBunco: boolean
  isMiniBunco: boolean
  matchCount: number
}

export interface RoundResult {
  round: number
  humanScore: number
  cpuScore: number
  winner: Player
}

export interface GameState {
  round: number
  target: DieValue
  humanScore: number
  cpuScore: number
  currentPlayer: Player
  dice: [DieValue, DieValue, DieValue] | null
  lastRoll: RollResult | null
  isRolling: boolean
  roundOver: boolean
  roundWinner: Player | null
  completedRounds: RoundResult[]
  humanRoundWins: number
  cpuRoundWins: number
  humanTotalScore: number
  cpuTotalScore: number
  humanBuncos: number
  cpuBuncos: number
  isGameOver: boolean
  gameWinner: Player | null
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

export interface GameStats {
  wins: number
  losses: number
  streak: number
  bestStreak: number
}
