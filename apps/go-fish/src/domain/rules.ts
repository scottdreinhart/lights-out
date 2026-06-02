/**
 * Go Fish domain rules — pure functions for game mechanics.
 */

import { CARD_RANKS, INITIAL_HAND_SIZE, SUITS_PER_RANK } from './constants'
import type { Card, CardRank, GameState } from './types'

/** Generate a complete shuffled 52-card deck. */
export function generateDeck(): Card[] {
  const deck: Card[] = []
  for (const rank of CARD_RANKS) {
    for (let suit = 0; suit < SUITS_PER_RANK; suit++) {
      deck.push({ rank })
    }
  }
  return shuffle(deck)
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Create the initial game state. */
export function createGameState(): GameState {
  const deck = generateDeck()
  const playerHand = deck.splice(0, INITIAL_HAND_SIZE)
  const computerHand = deck.splice(0, INITIAL_HAND_SIZE)
  return {
    phase: 'playing',
    playerHand,
    computerHand,
    deck,
    playerSets: 0,
    computerSets: 0,
    currentPlayer: 'player',
    gameOver: false,
  }
}

/** Count cards of a given rank in a hand. */
export function countRankInHand(hand: Card[], rank: CardRank): number {
  return hand.filter((c) => c.rank === rank).length
}

/** Check if a hand contains a book (4 cards of the same rank). */
export function findBooks(hand: Card[]): CardRank[] {
  const counts = new Map<CardRank, number>()
  for (const card of hand) {
    counts.set(card.rank, (counts.get(card.rank) ?? 0) + 1)
  }
  return CARD_RANKS.filter((r) => (counts.get(r) ?? 0) === SUITS_PER_RANK)
}

/** Remove all books from a hand and return cleaned hand + count. */
export function collectBooks(hand: Card[]): { hand: Card[]; booksFound: number } {
  const books = findBooks(hand)
  const booksFound = books.length
  const cleaned = hand.filter((c) => !books.includes(c.rank))
  return { hand: cleaned, booksFound }
}

/** Process an "ask" — transfer matching cards from target hand to asking hand. */
export function processAsk(
  askerHand: Card[],
  targetHand: Card[],
  rank: CardRank,
): { askerHand: Card[]; targetHand: Card[]; gained: number; goFish: boolean } {
  const matching = targetHand.filter((c) => c.rank === rank)
  if (matching.length === 0) {
    return { askerHand, targetHand, gained: 0, goFish: true }
  }
  return {
    askerHand: [...askerHand, ...matching],
    targetHand: targetHand.filter((c) => c.rank !== rank),
    gained: matching.length,
    goFish: false,
  }
}

/** Check if the game is over (deck empty and one player has no cards). */
export function isGameOver(state: GameState): boolean {
  return (
    state.deck.length === 0 && (state.playerHand.length === 0 || state.computerHand.length === 0)
  )
}
