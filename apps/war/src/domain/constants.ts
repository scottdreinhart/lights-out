import type { Card, GameState } from './types'
import type { Rank } from '@games/card-deck-core'
import { createDeck as createCardDeck, shuffleDeck as shuffleCardDeck } from '@games/card-deck-core'
import { WAR_DECK } from '@games/card-deck-core'

export function createDeck(): Card[] {
  const deck = createCardDeck(WAR_DECK)
  return shuffleCardDeck(deck)
}

export function getRankValue(rank: Rank): number {
  const rankMap: Record<Rank, number> = {
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
  return shuffleCardDeck(deck)
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
