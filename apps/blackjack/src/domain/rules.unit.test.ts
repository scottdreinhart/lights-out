/**
 * Blackjack Domain Rules - Unit Tests
 * Tests core game logic: hand values, winning conditions, valid actions
 */

import { describe, expect, it } from 'vitest'
import {
  calculateHandValue,
  canDoubleDown,
  canHit,
  canSplit,
  canStand,
  determineOutcome,
  getBestHandValue,
  isBust,
  isNaturalBlackjack,
} from './rules'
import type { Card, Hand, Rank, Suit } from './types'

const createCard = (suit: string, rank: string): Card => ({
  id: `${suit}-${rank}`,
  suit: suit as Suit,
  rank: rank as Rank,
})

const createHand = (cards: Card[], bet: number = 10): Hand => ({
  id: Math.random().toString(36),
  cards,
  status: 'playing',
  bet,
})

describe('Blackjack Domain Rules', () => {
  describe('calculateHandValue', () => {
    it('should sum numeric cards correctly', () => {
      const hand = createHand([createCard('H', '5'), createCard('D', '7')])
      expect(calculateHandValue(hand)).toBe(12)
    })

    it('should count face cards as 10', () => {
      const hand = createHand([createCard('H', 'K'), createCard('D', 'Q')])
      expect(calculateHandValue(hand)).toBe(20)
    })

    it('should count Ace as 11 when possible', () => {
      const hand = createHand([createCard('H', 'A'), createCard('D', '5')])
      expect(calculateHandValue(hand)).toBe(16) // Ace as 11 would bust
    })

    it('should count Ace as 1 when needed to avoid bust', () => {
      const hand = createHand([createCard('H', 'A'), createCard('D', 'K'), createCard('C', '5')])
      expect(calculateHandValue(hand)).toBe(16) // Ace=1, K=10, 5=5
    })

    it('should prioritize highest valid value', () => {
      const hand = createHand([createCard('H', 'A'), createCard('D', '9')])
      expect(calculateHandValue(hand)).toBe(20) // Ace=11
    })

    it('should handle multiple aces', () => {
      const hand = createHand([createCard('H', 'A'), createCard('D', 'A'), createCard('C', '9')])
      expect(calculateHandValue(hand)).toBe(21) // One Ace=11, one Ace=1, 9=9
    })

    it('should return 0 for empty hand', () => {
      const hand = createHand([])
      expect(calculateHandValue(hand)).toBe(0)
    })
  })

  describe('isBust', () => {
    it('should return true for hand > 21', () => {
      const hand = createHand([createCard('H', 'K'), createCard('D', 'Q'), createCard('C', '5')])
      expect(isBust(hand)).toBe(true)
    })

    it('should return false for hand = 21', () => {
      const hand = createHand([createCard('H', 'K'), createCard('D', 'A')])
      expect(isBust(hand)).toBe(false)
    })

    it('should return false for hand < 21', () => {
      const hand = createHand([createCard('H', '5'), createCard('D', '7')])
      expect(isBust(hand)).toBe(false)
    })
  })

  describe('isNaturalBlackjack', () => {
    it('should return true for Ace + 10-value card with 2 cards', () => {
      const hand = createHand([createCard('H', 'A'), createCard('D', 'K')])
      expect(isNaturalBlackjack(hand)).toBe(true)
    })

    it('should return false for 21 with 3+ cards', () => {
      const hand = createHand([createCard('H', '7'), createCard('D', '7'), createCard('C', '7')])
      expect(isNaturalBlackjack(hand)).toBe(false)
    })

    it('should return false for Ace + non-10-value card', () => {
      const hand = createHand([createCard('H', 'A'), createCard('D', '9')])
      expect(isNaturalBlackjack(hand)).toBe(false)
    })

    it('should return false for < 21', () => {
      const hand = createHand([createCard('H', '5'), createCard('D', '7')])
      expect(isNaturalBlackjack(hand)).toBe(false)
    })
  })

  describe('canHit', () => {
    it('should allow hit when hand < 17', () => {
      const hand = createHand([createCard('H', '5'), createCard('D', '7')])
      expect(canHit(hand)).toBe(true)
    })

    it('should allow hit when hand = 17', () => {
      const hand = createHand([createCard('H', '10'), createCard('D', '7')])
      expect(canHit(hand)).toBe(true)
    })

    it('should not allow hit when bust', () => {
      const hand = createHand([createCard('H', 'K'), createCard('D', 'Q'), createCard('C', '5')])
      expect(canHit(hand)).toBe(false)
    })

    it('should not allow hit when 21', () => {
      const hand = createHand([createCard('H', 'A'), createCard('D', 'K')])
      expect(canHit(hand)).toBe(false)
    })
  })

  describe('canStand', () => {
    it('should allow stand for any non-bust hand', () => {
      const hand = createHand([createCard('H', '5'), createCard('D', '7')])
      expect(canStand(hand)).toBe(true)
    })

    it('should not allow stand when bust', () => {
      const hand = createHand([createCard('H', 'K'), createCard('D', 'Q'), createCard('C', '5')])
      expect(canStand(hand)).toBe(false)
    })
  })

  describe('canDoubleDown', () => {
    it('should allow double for 9-11 on first two cards', () => {
      const hand = createHand([createCard('H', '5'), createCard('D', '6')])
      expect(canDoubleDown(hand)).toBe(true)
    })

    it('should not allow double with 3+ cards', () => {
      const hand = createHand([createCard('H', '5'), createCard('D', '6'), createCard('C', '2')])
      expect(canDoubleDown(hand)).toBe(false)
    })

    it('should not allow double for < 9', () => {
      const hand = createHand([createCard('H', '3'), createCard('D', '5')])
      expect(canDoubleDown(hand)).toBe(false)
    })
  })

  describe('canSplit', () => {
    it('should allow split for matching cards', () => {
      const hand = createHand([createCard('H', '8'), createCard('D', '8')])
      expect(canSplit(hand)).toBe(true)
    })

    it('should allow split for matching face cards', () => {
      const hand = createHand([createCard('H', 'K'), createCard('D', 'Q')])
      expect(canSplit(hand)).toBe(true)
    })

    it('should not allow split for non-matching cards', () => {
      const hand = createHand([createCard('H', '8'), createCard('D', '9')])
      expect(canSplit(hand)).toBe(false)
    })

    it('should not allow split with 3+ cards', () => {
      const hand = createHand([createCard('H', '8'), createCard('D', '8'), createCard('C', '5')])
      expect(canSplit(hand)).toBe(false)
    })
  })

  describe('getBestHandValue', () => {
    it('should return highest value for valid hand', () => {
      const hand = createHand([createCard('H', 'A'), createCard('D', '9')])
      expect(getBestHandValue(hand)).toBe(20)
    })

    it('should return 0 for empty hand', () => {
      const hand = createHand([])
      expect(getBestHandValue(hand)).toBe(0)
    })
  })

  describe('determineOutcome', () => {
    it('should return bust for bust hand', () => {
      const playerHand = createHand([
        createCard('H', 'K'),
        createCard('D', 'Q'),
        createCard('C', '5'),
      ])
      const dealerHand = createHand([createCard('H', '7'), createCard('D', '8')])
      expect(determineOutcome(playerHand, dealerHand)).toBe('bust')
    })

    it('should return blackjack for natural blackjack', () => {
      const playerHand = createHand([createCard('H', 'A'), createCard('D', 'K')])
      const dealerHand = createHand([createCard('H', '7'), createCard('D', '8')])
      expect(determineOutcome(playerHand, dealerHand)).toBe('blackjack')
    })

    it('should return win when player > dealer', () => {
      const playerHand = createHand([createCard('H', 'K'), createCard('D', 'Q')])
      const dealerHand = createHand([createCard('H', '7'), createCard('D', '8')])
      expect(determineOutcome(playerHand, dealerHand)).toBe('win')
    })

    it('should return loss when player < dealer', () => {
      const playerHand = createHand([createCard('H', '7'), createCard('D', '8')])
      const dealerHand = createHand([createCard('H', 'K'), createCard('D', 'Q')])
      expect(determineOutcome(playerHand, dealerHand)).toBe('loss')
    })

    it('should return push when player = dealer', () => {
      const playerHand = createHand([createCard('H', 'K'), createCard('D', 'Q')])
      const dealerHand = createHand([createCard('H', 'A'), createCard('D', '9')])
      expect(determineOutcome(playerHand, dealerHand)).toBe('push')
    })

    it('should return loss when dealer blackjack and player does not', () => {
      const playerHand = createHand([createCard('H', 'K'), createCard('D', 'Q')])
      const dealerHand = createHand([createCard('H', 'A'), createCard('D', 'K')])
      expect(determineOutcome(playerHand, dealerHand)).toBe('loss')
    })
  })
})
