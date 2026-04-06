import type { Card, CardRank, CardSuit, GameState } from './types'

export const SUITS: readonly CardSuit[] = ['hearts', 'diamonds', 'clubs', 'spades']
export const RANKS: readonly CardRank[] = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
]

export function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank })
    }
  }

  // Shuffle deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }

  return deck
}

export function getRankValue(rank: CardRank): number {
  const rankMap: Record<CardRank, number> = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    '10': 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2,
  }
  return rankMap[rank]
}

export function compareCards(card1: Card, card2: Card): 1 | 2 | 0 {
  const val1 = getRankValue(card1.rank)
  const val2 = getRankValue(card2.rank)

  if (val1 > val2) return 1
  if (val2 > val1) return 2
  return 0 // Tie
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function createInitialGameState(): GameState {
  const fullDeck = createDeck()
  const mid = Math.floor(fullDeck.length / 2)

  return {
    phase: 'playing',
    playerDeck: fullDeck.slice(0, mid),
    computerDeck: fullDeck.slice(mid),
    playerCard: null,
    computerCard: null,
    tableCards: {
      player: [],
      computer: [],
    },
    warHistory: [],
    roundCardsWon: 0,
    roundsPlayed: 0,
    playerWins: 0,
    computerWins: 0,
    ties: 0,
    warsPlayed: 0,
    gameOver: false,
    winner: null,
  }
}

/**
 * Calculate the deck size for a player (total cards they own)
 */
export function getDeckSize(deck: Card[]): number {
  return deck.length
}

/**
 * Determine if a player has enough cards for a war
 */
export function hasEnoughCardsForWar(deck: Card[], warCardCount: number): boolean {
  return deck.length > warCardCount
}

/**
 * Get cards to place in war (face-down cards)
 */
export function getWarCards(
  deck: Card[],
  count: number
): { cards: Card[]; remaining: Card[] } {
  const cards = deck.slice(0, Math.min(count, deck.length))
  const remaining = deck.slice(cards.length)
  return { cards, remaining }
}

/**
 * Calculate winner of a single round based on revealed cards
 */
export function determineRoundWinner(
  playerCard: Card,
  computerCard: Card
): 1 | 2 | 0 {
  return compareCards(playerCard, computerCard)
}
