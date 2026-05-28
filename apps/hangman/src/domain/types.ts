/**
 * Hangman — Domain Types
 * Pure domain types with no framework dependencies.
 */

export type GamePhase = 'idle' | 'playing' | 'won' | 'lost'
export type Difficulty = 'easy' | 'medium' | 'hard'

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

/** Letters the player has guessed */
export type GuessedLetter = string // single uppercase letter

export interface GameState {
  word: string // the secret word (uppercase)
  guessedLetters: Set<string> // letters already guessed
  wrongGuesses: number // count of incorrect guesses
  maxWrongGuesses: number // threshold for loss
  phase: GamePhase
}

export interface GameStats {
  wins: number
  losses: number
  streak: number
  bestStreak: number
}
