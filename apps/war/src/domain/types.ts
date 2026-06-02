/**
 * Domain types for War card game.
 * Shares standard playing card definitions with card-deck-core package.
 */

import type { Card } from '@games/card-deck-core'

export type { Card }

export type GamePhase =
  | 'playing' // Normal play (both players reveal cards)
  | 'war' // War in progress (face-down + face-up cards)
  | 'warResolution' // Determining war winner
  | 'gameOver' // Game complete

/**
 * Represents cards on the table during a war sequence
 */
export interface WarSequence {
  player: Card[]
  computer: Card[]
}

/**
 * Game state for War card game
 */
export interface GameState {
  // Current game phase
  phase: GamePhase

  // Active draw piles (players draw from top)
  playerDeck: Card[]
  computerDeck: Card[]

  // Captured piles (won cards, shuffled back into draw pile when draw pile is empty)
  playerWonPile: Card[]
  computerWonPile: Card[]

  // Cards currently being played
  playerCard: Card | null
  computerCard: Card | null

  // Cards on the table during war
  tableCards: WarSequence

  // War history (for multi-phase wars)
  warHistory: WarSequence[]

  // Number of cards won in current round
  roundCardsWon: number

  // Total rounds played
  roundsPlayed: number

  // Game statistics
  playerWins: number
  computerWins: number
  ties: number
  warsPlayed: number

  // Game status
  gameOver: boolean
  winner: 'player' | 'computer' | null

  // Error/message state
  message?: string
  error?: string
}
