/**
 * Monchola — Domain Types
 * Pure domain types with no framework dependencies.
 */

export type Player = 'human' | 'cpu'
export type GamePhase = 'idle' | 'playing' | 'game-over'
export type CellOwner = 0 | 1 | 2 // 0=empty, 1=human, 2=cpu

export interface MoncholaBoard {
  cells: CellOwner[]
  size: number
}

export interface GameState {
  phase: GamePhase
  board: MoncholaBoard
  currentPlayer: Player
  humanScore: number
  cpuScore: number
  winner: Player | 'draw' | null
  turnCount: number
}

export interface GameStats {
  wins: number
  losses: number
  draws: number
  gamesPlayed: number
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

export interface ThemeSettings {
  colorTheme: string
  mode: 'system' | 'light' | 'dark'
  colorblind: string
}
