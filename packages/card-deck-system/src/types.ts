/**
 * Card Suit — The four standard playing card suits
 */
export enum CardSuit {
  DIAMONDS = 'diamonds',
  CLUBS = 'clubs',
  SPADES = 'spades',
  HEARTS = 'hearts',
}

/**
 * Card Rank — Standard playing card ranks (2-10, Face cards, Ace)
 *
 * Order reflects standard deck order: 2 through Ace
 * Numeric value is derived from position and special rules per game
 */
export enum CardRank {
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K',
  ACE = 'A',
}

/**
 * Card — A single playing card
 *
 * Uniquely identified by suit + rank, or by joker designation
 * isJoker: true means this is a joker (no suit/rank apply)
 */
export interface Card {
  suit?: CardSuit
  rank?: CardRank
  isJoker: boolean
  /** Unique card ID for tracking across shoe operations */
  id: string
}

/**
 * Card Numeric Value Configuration
 *
 * Maps each rank to a numeric value.
 * Games may apply different rules (e.g., Ace can be 1 or 11 in Blackjack)
 * This provides the base value; games can override as needed.
 */
export interface CardNumericValue {
  rank: CardRank
  baseValue: number
  /** Some ranks have alternate values per game rules (e.g., Ace) */
  alternateValues?: number[]
}

/**
 * Deck Configuration
 *
 * Controls how a single deck is created and what special cards (jokers) are included
 */
export interface DeckConfig {
  /** Include jokers in the deck (true = add 2 jokers for 54-card deck) */
  withJokers?: boolean
  /** Use only 1 joker (53-card deck) instead of 2 (default: false → 2 jokers if enabled) */
  singleJoker?: boolean
}

/**
 * Shoe Configuration
 *
 * Controls how multiple decks are combined and tracked
 */
export interface ShoeConfig {
  /** Number of decks in the shoe (e.g., 1, 2, 4, 6, 8) */
  deckCount: number
  /** Include jokers in all decks */
  withJokers?: boolean
  /** Burn card threshold (% of deck before reshuffle) — e.g., 0.75 = shuffle at 75% used */
  burnCardThreshold?: number
  /** Single joker per deck (53 cards) instead of 2 (54 cards) */
  singleJokerPerDeck?: boolean
}

/**
 * Shoe State — Current state of a multi-deck shoe
 *
 * Tracks which cards have been dealt and burned, allowing games to track penetration
 */
export interface ShoeState {
  /** Total cards in the shoe initially */
  totalCards: number
  /** Cards remaining to be dealt */
  cardsRemaining: number
  /** Cards that have been dealt */
  cardsDealt: number
  /** Burned/discarded cards */
  cardsBurned: number
  /** Percentage of decks used (0.0 to 1.0) */
  penetration: number
  /** Whether shoe should be reshuffled */
  shouldReshuffle: boolean
}
