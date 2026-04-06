/**
 * Card Deck Core Types
 * Defines all types for playing cards, suits, ranks, and deck operations
 * Supports standard 52-card decks, jokers (53-54 card decks), and multi-deck shoes
 */

/**
 * Standard suit in a playing deck
 * Diamonds (♦), Clubs (♣), Spades (♠), Hearts (♥)
 */
export type Suit = 'diamonds' | 'clubs' | 'spades' | 'hearts'

/**
 * Standard card rank in a 52-card deck plus jokers
 * Ace (A), 2-10, Jack (J), Queen (Q), King (K)
 * Joker is optional (53rd or 54th card)
 */
export type Rank =
  | 'A'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'
  | 'joker'

/**
 * Joker color/variant for games that distinguish between jokers
 * 'red' and 'black' jokers are commonly used in multi-joker decks
 */
export type JokerColor = 'red' | 'black'

/**
 * Card back type — selects which back design asset to display
 * Used for face-down cards
 *
 * - '1B' = Black-backed cards (standard Bicycle/poker-style black back)
 * - '2B' = Red-backed cards (alternative variant)
 *
 * Reference: CARD_NOMENCLATURE_STANDARD.md
 */
export type CardBackType = '1B' | '2B'

/**
 * Joker variant — selects which joker design asset to display
 * Used only when rendering joker cards
 *
 * - '1J' = Joker variant #1 (primary joker design)
 * - '2J' = Joker variant #2 (alternate joker design)
 *
 * Reference: CARD_NOMENCLATURE_STANDARD.md
 */
export type JokerVariant = '1J' | '2J'

/**
 * Asset identifier for cards, backs, and jokers
 * Can be a rank, card back type, or joker variant
 */
export type CardAssetId = Rank | CardBackType | JokerVariant

/**
 * Unique Card identifier
 * Combines suit, rank, and optional joker variant
 * Examples: { suit: 'hearts', rank: '5'}, { rank: 'joker', color: 'red' }
 */
export interface Card {
  readonly suit: Suit | null // null for jokers (no suit)
  readonly rank: Rank
  readonly color?: JokerColor // Optional, only for jokers
  readonly id: string // Unique identifier across entire shoe
}

/**
 * Numeric value of a card for games that care about card values
 * Typically: 2-10 = face value, A = 1 or 11, J/Q/K = 10, Joker = varies
 */
export interface CardValue {
  card: Card
  primaryValue: number // Primary value (usually pip value)
  alternateValue?: number // Alternate value (e.g., Ace = 1 or 11)
  isJoker: boolean
  isFaceCard: boolean
}

/**
 * Configuration for creating a deck
 */
export interface DeckConfig {
  includeJokers: boolean // Add 2 jokers (53-card deck) or 4 jokers (54-card)
  jokerCount?: 2 | 4 // Number of jokers (only if includeJokers=true)
  deckCount: number // Number of standard decks (1 = 52 cards, 2 = 104 cards, etc.)
}

/**
 * A complete playing deck or shoe (multi-deck combination)
 * Tracks all cards, dealt/remaining status, and burn tracking
 */
export interface Deck {
  readonly id: string // Unique deck/shoe identifier
  readonly config: DeckConfig
  readonly totalCards: number // Total cards in this deck/shoe (52, 53, 54, 104, etc.)
  readonly cards: Card[] // All cards in deck
  dealtCards: Card[] // Cards that have been dealt/removed from play
  remainingCards: Card[] // Cards still available to deal
  readonly burnCards: Card[] // Cards burned in shoe (sometimes dealt from deck cut but not used)
  penetration: number // % of deck dealt (0.0 to 1.0)
}

/**
 * Multi-shoe tracking for games using card shoes with multiple decks
 * Allows burn-out detection and shoe reset
 */
export interface CardShoe {
  readonly id: string
  readonly deckConfigs: DeckConfig[] // Configuration for each deck in shoe
  decks: Deck[] // All decks in the shoe
  currentDeckIndex: number // Which deck is being played from
  totalCardsDealt: number // Running total across all decks
  shoeState: 'active' | 'needs-penetration-check' | 'burned-out'
}

/**
 * Result of drawing/dealing cards
 */
export interface DrawResult {
  success: boolean
  cards: Card[]
  remaining: number // Cards left in current deck
  error?: string
}

/**
 * Statistics about a deck's usage
 */
export interface DeckStatistics {
  totalCards: number
  cardsDealt: number
  cardsRemaining: number
  penetrationPercent: number
  cardsByRank: Record<Rank, number>
  cardsBySuit: Record<Suit | 'joker', number>
  burnedCards: number
}
