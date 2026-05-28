/**
 * Memory Game — Domain Types
 * Pure domain types with no framework dependencies.
 */

export type CardSymbol = '🎮' | '🎲' | '🎯' | '🏆' | '🎸' | '🎨' | '🎭' | '🎪'

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

export type GamePhase = 'idle' | 'playing' | 'checking' | 'won'

export interface MemoryCard {
  id: number
  symbol: CardSymbol
  isFlipped: boolean
  isMatched: boolean
}

export interface GameState {
  cards: MemoryCard[]
  flippedIds: number[]
  matchedPairs: number
  moves: number
  phase: GamePhase
}

export interface GameStats {
  wins: number
  losses: number
  streak: number
  bestStreak: number
  bestMoves: number | null
  gamesPlayed: number
}
