import { describe, expect, it } from 'vitest'

/**
 * Unit tests for Blackjack game rules and scoring
 * Tests hand calculation, bust detection, and win conditions
 */

interface BlackjackCard {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'
  rank: string // 'A', '2'-'10', 'J', 'Q', 'K'
}

const _getCardValue = (card: BlackjackCard): number => {
  if (card.rank === 'A') {
    return 11
  }
  if (['J', 'Q', 'K'].includes(card.rank)) {
    return 10
  }
  return parseInt(card.rank, 10)
}

const calculateHandValue = (cards: BlackjackCard[]): { value: number; isBlackjack: boolean } => {
  let value = 0
  let aces = 0

  for (const card of cards) {
    if (card.rank === 'A') {
      aces += 1
      value += 11
    } else if (['J', 'Q', 'K'].includes(card.rank)) {
      value += 10
    } else {
      value += parseInt(card.rank, 10)
    }
  }

  // Adjust for aces if needed
  while (value > 21 && aces > 0) {
    value -= 10
    aces -= 1
  }

  const isBlackjack = cards.length === 2 && value === 21
  return { value, isBlackjack }
}

describe('Blackjack Game Rules', () => {
  it('should correctly calculate simple hand value (number cards)', () => {
    const hand: BlackjackCard[] = [
      { suit: 'hearts', rank: '5' },
      { suit: 'diamonds', rank: '7' },
    ]

    const { value } = calculateHandValue(hand)
    expect(value).toBe(12)
  })

  it('should correctly calculate hand with face cards', () => {
    const hand: BlackjackCard[] = [
      { suit: 'hearts', rank: 'K' },
      { suit: 'diamonds', rank: 'Q' },
    ]

    const { value } = calculateHandValue(hand)
    expect(value).toBe(20)
  })

  it('should detect blackjack (Ace + 10-value card)', () => {
    const hand: BlackjackCard[] = [
      { suit: 'hearts', rank: 'A' },
      { suit: 'diamonds', rank: 'K' },
    ]

    const { value, isBlackjack } = calculateHandValue(hand)
    expect(value).toBe(21)
    expect(isBlackjack).toBe(true)
  })

  it('should correctly handle Ace as 1 when necessary to avoid bust', () => {
    const hand: BlackjackCard[] = [
      { suit: 'hearts', rank: 'A' },
      { suit: 'diamonds', rank: '5' },
      { suit: 'clubs', rank: '7' },
    ]

    const { value } = calculateHandValue(hand)
    expect(value).toBe(13) // Ace counted as 1
  })

  it('should detect bust when hand exceeds 21', () => {
    const hand: BlackjackCard[] = [
      { suit: 'hearts', rank: '10' },
      { suit: 'diamonds', rank: 'K' },
      { suit: 'clubs', rank: '5' },
    ]

    const { value } = calculateHandValue(hand)
    expect(value).toBeGreaterThan(21)
  })

  it('should handle multiple Aces correctly', () => {
    const hand: BlackjackCard[] = [
      { suit: 'hearts', rank: 'A' },
      { suit: 'diamonds', rank: 'A' },
      { suit: 'clubs', rank: '9' },
    ]

    const { value } = calculateHandValue(hand)
    expect(value).toBe(21) // One Ace as 11, one as 1
  })
})
