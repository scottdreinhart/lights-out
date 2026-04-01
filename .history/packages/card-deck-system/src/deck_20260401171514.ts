/**
 * Deck — Standard 52-card deck (or 53/54 with jokers)
 *
 * Responsible for:
 * - Creating a complete deck
 * - Shuffling cards
 * - Dealing cards
 * - Tracking dealt vs remaining
 * - Supporting multiple deck shoes
 */

import { CardRank, CardSuit, type Card, type DeckConfig } from './types'

export class Deck {
  private cards: Card[] = []
  private dealtIndex: number = 0

  constructor(config: DeckConfig = {}) {
    this.createDeck(config)
  }

  /**
   * Create a fresh standard deck
   *
   * Standard: 52 cards (4 suits × 13 ranks)
   * With jokers: 53 cards (1 joker) or 54 cards (2 jokers)
   */
  private createDeck(config: DeckConfig): void {
    const cards: Card[] = []
    let cardId = 0

    // Create all standard cards (52)
    for (const suit of Object.values(CardSuit)) {
      for (const rank of Object.values(CardRank)) {
        cards.push({
          suit,
          rank,
          isJoker: false,
          id: `std_${cardId++}`,
        })
      }
    }

    // Add jokers if configured
    if (config.withJokers) {
      const jokerCount = config.singleJoker ? 1 : 2
      for (let i = 0; i < jokerCount; i++) {
        cards.push({
          isJoker: true,
          id: `joker_${i}`,
        })
      }
    }

    this.cards = cards
    this.dealtIndex = 0
  }

  /**
   * Get the total number of cards in this deck
   */
  getSize(): number {
    return this.cards.length
  }

  /**
   * Get number of cards remaining to deal
   */
  getRemaining(): number {
    return this.cards.length - this.dealtIndex
  }

  /**
   * Get number of cards already dealt
   */
  getDealt(): number {
    return this.dealtIndex
  }

  /**
   * Shuffle the deck using Fisher-Yates algorithm
   *
   * Only shuffles cards that haven't been dealt yet
   */
  shuffle(): void {
    const undealtCards = this.cards.slice(this.dealtIndex)

    // Fisher-Yates shuffle
    for (let i = undealtCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[undealtCards[i], undealtCards[j]] = [undealtCards[j], undealtCards[i]]
    }

    // Replace undealt cards with shuffled version
    this.cards.splice(this.dealtIndex, undealtCards.length, ...undealtCards)
  }

  /**
   * Deal one card from the deck
   *
   * @returns The card, or null if no cards remaining
   */
  dealCard(): Card | null {
    if (this.dealtIndex >= this.cards.length) {
      return null
    }
    return this.cards[this.dealtIndex++]
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
   * Reset the deck (send all dealt cards back to undealt)
   */
  reset(): void {
    this.dealtIndex = 0
  }

  /**
   * Get all cards (for advanced use: testing, validation, etc.)
   */
  getAllCards(): Card[] {
    return [...this.cards]
  }

  /**
   * Get remaining cards without dealing them
   */
  peekRemaining(): Card[] {
    return this.cards.slice(this.dealtIndex)
  }
}
