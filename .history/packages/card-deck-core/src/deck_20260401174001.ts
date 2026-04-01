/**
 * Deck Operations
 * Core functionality for creating, shuffling, dealing, and managing card decks
 */

import { getAllSuits, getStandardRankOrder } from './card-values'
import type { Card, Deck, DeckConfig, DeckStatistics, DrawResult, Suit } from './types'

/**
 * Create a unique card ID
 * Format: suit_rank_deckIndex_cardIndex
 * Examples: "hearts_5_0_1", "joker_red_0_52"
 */
function createCardId(
  suit: Suit | null,
  rank: string,
  deckIndex: number,
  cardIndex: number,
  color?: string,
): string {
  if (rank === 'joker') {
    return `joker_${color || 'uncolored'}_${deckIndex}_${cardIndex}`
  }
  return `${suit}_${rank}_${deckIndex}_${cardIndex}`
}

/**
 * Create a single card object
 */
function createCard(
  suit: Suit | null,
  rank: string,
  deckIndex: number,
  cardIndex: number,
  color?: string,
): Card {
  if (rank === 'joker') {
    return {
      suit: null,
      rank: 'joker' as const,
      color: (color as 'red' | 'black') || undefined,
      id: createCardId(null, rank, deckIndex, cardIndex, color),
    }
  }

  return {
    suit,
    rank: rank as any, // Already validated
    id: createCardId(suit, rank, deckIndex, cardIndex),
  }
}

/**
 * Create a complete deck with standard 52 cards (+ optional jokers)
 * Each card has a unique ID to track it across the deck
 */
export function createDeck(config: DeckConfig, deckIndex: number = 0): Deck {
  const cards: Card[] = []
  let cardIndex = 0
  const ranks = getStandardRankOrder()
  const suits = getAllSuits()

  // Add all standard cards from each deck
  for (let d = 0; d < config.deckCount; d++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        cards.push(createCard(suit, rank, deckIndex, cardIndex))
        cardIndex++
      }
    }
  }

  // Add jokers if requested
  if (config.includeJokers) {
    const jokerCount = config.jokerCount || 2
    const colors: ('red' | 'black')[] = ['red', 'black']

    for (let i = 0; i < jokerCount; i++) {
      const color = colors[i % colors.length]
      cards.push(createCard(null, 'joker', deckIndex, cardIndex, color))
      cardIndex++
    }
  }

  const deck: Deck = {
    id: `deck_${deckIndex}`,
    config,
    totalCards: cards.length,
    cards,
    dealtCards: [],
    remainingCards: [...cards],
    burnCards: [],
    penetration: 0,
  }

  return deck
}

/**
 * Fisher-Yates shuffle algorithm
 * Shuffles the deck in-place and returns the same deck reference
 */
export function shuffleDeck(deck: Deck, seed?: number): Deck {
  const cards = deck.remainingCards
  let random = seededRandom(seed)

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }

  return deck
}

/**
 * Simple seeded random number generator
 * If no seed, uses Math.random()
 */
function seededRandom(seed?: number) {
  if (!seed) {
    return () => Math.random()
  }

  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

/**
 * Deal cards from the deck
 * Removes from remainingCards, adds to dealtCards
 */
export function dealCards(deck: Deck, count: number): DrawResult {
  if (count <= 0) {
    return {
      success: false,
      cards: [],
      remaining: deck.remainingCards.length,
      error: 'Count must be > 0',
    }
  }

  if (deck.remainingCards.length < count) {
    return {
      success: false,
      cards: [],
      remaining: deck.remainingCards.length,
      error: `Insufficient cards. Requested ${count}, have ${deck.remainingCards.length}`,
    }
  }

  const dealt: Card[] = []
  for (let i = 0; i < count; i++) {
    const card = deck.remainingCards.shift()!
    dealt.push(card)
    deck.dealtCards.push(card)
  }

  updateDeckPenetration(deck)

  return {
    success: true,
    cards: dealt,
    remaining: deck.remainingCards.length,
  }
}

/**
 * Peek at the next N cards without dealing them
 */
export function peekCards(deck: Deck, count: number): Card[] {
  return deck.remainingCards.slice(0, Math.min(count, deck.remainingCards.length))
}

/**
 * Burn cards from the deck (remove from play without dealing to a player)
 * Used in shoe games to mark cut point, etc.
 */
export function burnCards(deck: Deck, count: number): Card[] {
  const burned: Card[] = []
  for (let i = 0; i < count && deck.remainingCards.length > 0; i++) {
    const card = deck.remainingCards.shift()!
    burned.push(card)
    deck.burnCards.push(card)
  }

  updateDeckPenetration(deck)
  return burned
}

/**
 * Reset deck (return all dealt/burned cards to remaining)
 * Does NOT reshuffle - call shuffleDeck() after reset
 */
export function resetDeck(deck: Deck): Deck {
  const allCards = [...deck.dealtCards, ...deck.burnCards, ...deck.remainingCards]
  deck.dealtCards = []
  deck.burnCards = []
  deck.remainingCards = allCards
  deck.penetration = 0
  return deck
}

/**
 * Update penetration percentage (% of deck that has been dealt)
 */
function updateDeckPenetration(deck: Deck): void {
  const dealt = deck.dealtCards.length + deck.burnCards.length
  deck.penetration = dealt / deck.totalCards
}

/**
 * Get statistics about the deck
 */
export function getDeckStatistics(deck: Deck): DeckStatistics {
  const cardsByRank: Record<string, number> = {}
  const cardsBySuit: Record<string, number> = {}

  const ranks = getStandardRankOrder()
  for (const rank of ranks) {
    cardsByRank[rank] = 0
  }
  cardsByRank['joker'] = 0
  cardsBySuit['diamonds'] = 0
  cardsBySuit['clubs'] = 0
  cardsBySuit['spades'] = 0
  cardsBySuit['hearts'] = 0

  // Count remaining cards by rank and suit
  for (const card of deck.remainingCards) {
    cardsByRank[card.rank]++
    if (card.suit) {
      cardsBySuit[card.suit]++
    } else {
      cardsBySuit['joker']++
    }
  }

  return {
    totalCards: deck.totalCards,
    cardsDealt: deck.dealtCards.length,
    cardsRemaining: deck.remainingCards.length,
    penetrationPercent: Math.round(deck.penetration * 10000) / 100, // 2 decimals
    cardsByRank: cardsByRank as any,
    cardsBySuit: cardsBySuit as any,
    burnedCards: deck.burnCards.length,
  }
}

/**
 * Check if a card exists in remaining deck (for validation)
 */
export function cardExists(deck: Deck, cardId: string): boolean {
  return deck.remainingCards.some((c) => c.id === cardId)
}

/**
 * Find a specific card in the remaining deck
 */
export function findCard(deck: Deck, cardId: string): Card | undefined {
  return deck.remainingCards.find((c) => c.id === cardId)
}

/**
 * Get all remaining cards of a specific rank
 */
export function getCardsByRank(deck: Deck, rank: string): Card[] {
  return deck.remainingCards.filter((c) => c.rank === rank)
}

/**
 * Get all remaining cards of a specific suit
 */
export function getCardsBySuit(deck: Deck, suit: Suit): Card[] {
  return deck.remainingCards.filter((c) => c.suit === suit)
}
