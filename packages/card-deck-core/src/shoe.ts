/**
 * Card Shoe System
 * Manages multi-deck shoes for games that use multiple decks together
 * Handles penetration checking, burn-out detection, and deck rotation
 */

import {
  burnCards as burnFromDeck,
  createDeck,
  dealCards,
  getDeckStatistics,
  shuffleDeck,
} from './deck'
import type { CardShoe, Deck, DeckConfig } from './types'

/**
 * Create a new card shoe with one or more decks
 * Used in games like blackjack, baccarat, etc. that use multiple decks
 */
export function createShoe(
  deckConfigs: DeckConfig[],
  shuffle: boolean = true,
  seed?: number,
): CardShoe {
  const decks: Deck[] = []

  for (let i = 0; i < deckConfigs.length; i++) {
    const deck = createDeck(deckConfigs[i], i)
    if (shuffle) {
      shuffleDeck(deck, seed)
    }
    decks.push(deck)
  }

  return {
    id: `shoe_${Date.now()}`,
    deckConfigs,
    decks,
    currentDeckIndex: 0,
    totalCardsDealt: 0,
    shoeState: 'active',
  }
}

/**
 * Get the current deck being played from
 */
export function getCurrentDeck(shoe: CardShoe): Deck {
  return shoe.decks[shoe.currentDeckIndex]
}

/**
 * Deal cards from the current deck
 * Automatically advances to next deck if current is exhausted
 */
export function dealFromShoe(
  shoe: CardShoe,
  count: number,
  advanceOnExhaustion: boolean = true,
): { success: boolean; cards: any[]; error?: string } {
  const currentDeck = getCurrentDeck(shoe)

  // Try to deal from current deck
  const result = dealCards(currentDeck, count)

  if (result.success) {
    shoe.totalCardsDealt += count
    return result
  }

  // If current deck exhausted and we can advance
  if (advanceOnExhaustion && shoe.currentDeckIndex < shoe.decks.length - 1) {
    shoe.currentDeckIndex++
    const nextDeck = getCurrentDeck(shoe)
    const nextResult = dealCards(nextDeck, count)

    if (nextResult.success) {
      shoe.totalCardsDealt += count
      return nextResult
    }
  }

  // If we're on the last deck and exhausted
  if (shoe.currentDeckIndex === shoe.decks.length - 1) {
    shoe.shoeState = 'burned-out'
  }

  return {
    success: false,
    cards: [],
    error: `Cannot deal ${count} cards. Shoe exhausted.`,
  }
}

/**
 * Burn cards from the current deck
 * Use at the start of shoes or between rounds
 */
export function burnFromShoe(shoe: CardShoe, count: number): any[] {
  const currentDeck = getCurrentDeck(shoe)
  return burnFromDeck(currentDeck, count)
}

/**
 * Check if shoe needs penetration check
 * Returns true if any deck has exceeded penetration threshold (typically 75%)
 */
export function checkShocePenetration(shoe: CardShoe, threshold: number = 0.75): boolean {
  const currentDeck = getCurrentDeck(shoe)
  return currentDeck.penetration >= threshold
}

/**
 * Get total remaining cards across all decks in shoe
 */
export function getTotalRemainingCards(shoe: CardShoe): number {
  return shoe.decks.reduce((total, deck) => total + deck.remainingCards.length, 0)
}

/**
 * Reshuffle the current deck (common in shoe games)
 */
export function reshuffleCurrentDeck(shoe: CardShoe, seed?: number): void {
  const currentDeck = getCurrentDeck(shoe)

  // Reset the deck
  currentDeck.dealtCards = []
  currentDeck.burnCards = []
  currentDeck.remainingCards = [...currentDeck.cards]
  currentDeck.penetration = 0

  // Shuffle
  shuffleDeck(currentDeck, seed)
}

/**
 * Reset entire shoe (all decks)
 */
export function resetShoe(shoe: CardShoe, shuffle: boolean = true, seed?: number): void {
  shoe.currentDeckIndex = 0
  shoe.totalCardsDealt = 0
  shoe.shoeState = 'active'

  for (const deck of shoe.decks) {
    deck.dealtCards = []
    deck.burnCards = []
    deck.remainingCards = [...deck.cards]
    deck.penetration = 0

    if (shuffle) {
      shuffleDeck(deck, seed)
    }
  }
}

/**
 * Get statistics for all decks in the shoe
 */
export function getShoeStatistics(shoe: CardShoe) {
  return {
    totalDecks: shoe.decks.length,
    currentDeckIndex: shoe.currentDeckIndex,
    totalCardsDealt: shoe.totalCardsDealt,
    totalRemainingCards: getTotalRemainingCards(shoe),
    shoeState: shoe.shoeState,
    deckStatistics: shoe.decks.map((deck, idx) => ({
      deckIndex: idx,
      isCurrent: idx === shoe.currentDeckIndex,
      stats: getDeckStatistics(deck),
    })),
  }
}

/**
 * Automatically advance to next deck if penetration threshold exceeded
 * Returns true if advanced, false if already on last deck or threshold not met
 */
export function advanceIfPenetrationExceeded(shoe: CardShoe, threshold: number = 0.75): boolean {
  const currentDeck = getCurrentDeck(shoe)

  if (currentDeck.penetration >= threshold && shoe.currentDeckIndex < shoe.decks.length - 1) {
    shoe.currentDeckIndex++
    shoe.shoeState = 'active'
    return true
  }

  if (shoe.currentDeckIndex === shoe.decks.length - 1 && currentDeck.penetration >= threshold) {
    shoe.shoeState = 'needs-penetration-check'
  }

  return false
}

/**
 * Get penetration percentage for current deck
 */
export function getCurrentDeckPenetration(shoe: CardShoe): number {
  return getCurrentDeck(shoe).penetration
}
