import { describe, expect, it } from 'vitest'

/**
 * Unit tests for War card game rules
 * Tests card deck, comparison logic, and win conditions
 */

interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'
  rank: number // 2-14 (where 14 is Ace)
}

interface WarRound {
  player1Card: Card
  player2Card: Card
  winner: 1 | 2 | 0 // 0 = tie
}

const getCardValue = (card: Card): number => card.rank
const compareCards = (card1: Card, card2: Card): 1 | 2 | 0 => {
  const val1 = getCardValue(card1)
  const val2 = getCardValue(card2)
  if (val1 > val2) return 1
  if (val2 > val1) return 2
  return 0
}

describe('War Card Game', () => {
  it('should correctly compare two cards where player 1 wins', () => {
    const card1: Card = { suit: 'hearts', rank: 14 } // Ace
    const card2: Card = { suit: 'spades', rank: 10 }

    const winner = compareCards(card1, card2)
    expect(winner).toBe(1)
  })

  it('should correctly compare two cards where player 2 wins', () => {
    const card1: Card = { suit: 'hearts', rank: 5 }
    const card2: Card = { suit: 'spades', rank: 12 } // Queen

    const winner = compareCards(card1, card2)
    expect(winner).toBe(2)
  })

  it('should detect a tie when both cards have same rank', () => {
    const card1: Card = { suit: 'hearts', rank: 10 }
    const card2: Card = { suit: 'spades', rank: 10 }

    const winner = compareCards(card1, card2)
    expect(winner).toBe(0)
  })

  it('should initialize a deck with 52 cards (13 ranks × 4 suits)', () => {
    const suits: Array<'hearts' | 'diamonds' | 'clubs' | 'spades'> = [
      'hearts',
      'diamonds',
      'clubs',
      'spades',
    ]
    const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] // 2-Ace

    const deck = suits.flatMap((suit) => ranks.map((rank) => ({ suit, rank })))

    expect(deck).toHaveLength(52)
  })

  it('should track card ranks correctly (2 is lowest, 14/Ace is highest)', () => {
    const card2 = { suit: 'hearts' as const, rank: 2 }
    const cardAce = { suit: 'hearts' as const, rank: 14 }

    expect(getCardValue(card2)).toBeLessThan(getCardValue(cardAce))
  })
})
