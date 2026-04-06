/**
 * Domain types for War card game.
 */

export type CardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type CardRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Card {
  suit: CardSuit
  rank: CardRank
}

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

  // Player decks (cards owned)
  playerDeck: Card[]
  computerDeck: Card[]

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
