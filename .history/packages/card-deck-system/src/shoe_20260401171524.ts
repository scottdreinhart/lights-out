/**
 * Shoe — Multiple decks combined and tracked as a single unit
 *
 * Used in games like Blackjack where 4-8 decks are shuffled together
 *
 * Responsible for:
 * - Combining multiple decks
 * - Tracking card penetration (% of shoe used)
 * - Detecting when shoe should be reshuffled (burn card threshold)
 * - Managing deals across multiple decks
 */

import { Deck } from './deck'
import type { Card, ShoeConfig, ShoeState } from './types'

export class Shoe {
  private decks: Deck[]
  private currentDeckIndex: number = 0
  private cardsBurned: number = 0
  private config: Required<ShoeConfig>

  constructor(config: ShoeConfig) {
    if (config.deckCount < 1) {
      throw new Error('Shoe must contain at least 1 deck')
    }

    this.config = {
      deckCount: config.deckCount,
      withJokers: config.withJokers ?? false,
      burnCardThreshold: config.burnCardThreshold ?? 0.75, // Default: reshuffle at 75% used
      singleJokerPerDeck: config.singleJokerPerDeck ?? false,
    }

    // Create all decks and shuffle them together
    this.decks = []
    const allCards: Card[] = []

    // Combine all cards from all decks into one
    for (let i = 0; i < config.deckCount; i++) {
      const deck = new Deck({
        withJokers: this.config.withJokers,
        singleJoker: this.config.singleJokerPerDeck,
      })
      allCards.push(...deck.getAllCards())
    }

    // Create a single deck with all combined cards
    this.decks = [this._createCombinedDeck(allCards)]
  }

  /**
   * Create a deck from a pre-built card list (internal use)
   */
  private _createCombinedDeck(cards: Card[]): Deck {
    const deck = new Deck()
    // Replace the deck's internal cards with combined cards
    // This is a hack since Deck class doesn't expose this; consider refactoring
    ; (deck as any).cards = cards
    ; (deck as any).dealtIndex = 0
    return deck
  }

  /**
   * Get total cards in the entire shoe
   */
  getTotalCards(): number {
    return this.decks.reduce((sum, deck) => sum + deck.getSize(), 0)
  }

  /**
   * Get cards remaining to deal
   */
  getCardsRemaining(): number {
    return this.decks.reduce((sum, deck) => sum + deck.getRemaining(), 0)
  }

  /**
   * Get cards already dealt
   */
  getCardsDealt(): number {
    return this.decks.reduce((sum, deck) => sum + deck.getDealt(), 0)
  }

  /**
   * Get current penetration (% of shoe used)
   *
   * @returns Number between 0.0 and 1.0
   */
  getPenetration(): number {
    const total = this.getTotalCards()
    const dealt = this.getCardsDealt()
    return total > 0 ? dealt / total : 0
  }

  /**
   * Check if shoe should be reshuffled based on burn card threshold
   */
  shouldReshuffle(): boolean {
    return this.getPenetration() >= this.config.burnCardThreshold
  }

  /**
   * Deal one card from the shoe
   *
   * Automatically moves to next deck if current deck is exhausted
   *
   * @returns The card, or null if shoe is exhausted
   */
  dealCard(): Card | null {
    // Try to deal from current deck
    let card = this.decks[this.currentDeckIndex].dealCard()

    // If current deck is exhausted and there are more decks, move to next
    if (!card && this.currentDeckIndex < this.decks.length - 1) {
      this.currentDeckIndex++
      card = this.decks[this.currentDeckIndex].dealCard()
    }

    return card
  }

  /**
   * Deal multiple cards
   *
   * @param count Number of cards to deal
   * @returns Array of cards (may be shorter if not enough cards remaining)
   */
  dealCards(count: number): Card[] {
    const dealt: Card[] = []
    for (let i = 0; i < count; i++) {
      const card = this.dealCard()
      if (!card) break
      dealt.push(card)
    }
    return dealt
  }

  /**
   * Burn a card (move it aside without dealing)
   *
   * Tracking this helps calculate true penetration
   */
  burnCard(): void {
    const card = this.dealCard()
    if (card) {
      this.cardsBurned++
    }
  }

  /**
   * Reshuffle the shoe (reset all decks and shuffle)
   *
   * Call this when shouldReshuffle() returns true or by game logic
   */
  reshuffle(): void {
    // Reset all decks
    for (const deck of this.decks) {
      deck.reset()
    }
    this.currentDeckIndex = 0
    this.cardsBurned = 0

    // Reshuffle first deck
    this.decks[0].shuffle()
  }

  /**
   * Get current shoe state (for monitoring/logging)
   */
  getState(): ShoeState {
    return {
      totalCards: this.getTotalCards(),
      cardsRemaining: this.getCardsRemaining(),
      cardsDealt: this.getCardsDealt(),
      cardsBurned: this.cardsBurned,
      penetration: this.getPenetration(),
      shouldReshuffle: this.shouldReshuffle(),
    }
  }

  /**
   * Get all remaining cards without dealing them (for advanced diagnostics)
   */
  peekRemaining(): Card[] {
    const all: Card[] = []
    for (let i = this.currentDeckIndex; i < this.decks.length; i++) {
      all.push(...this.decks[i].peekRemaining())
    }
    return all
  }
}
