/**
 * memory-game — domain unit tests.
 * Tests deck creation, card flipping, match checking, and game over detection.
 */

import { describe, expect, it } from 'vitest'
import { checkMatch, createDeck, createInitialState, flipCard, SYMBOLS, TOTAL_PAIRS } from './board'
import { efficiencyScore, isCardVisible, isWon, remainingPairs } from './rules'

describe('memory-game domain', () => {
  describe('createDeck', () => {
    it('creates 16 cards (8 pairs)', () => {
      expect(createDeck()).toHaveLength(SYMBOLS.length * 2)
    })

    it('each symbol appears exactly twice', () => {
      const deck = createDeck()
      for (const symbol of SYMBOLS) {
        expect(deck.filter((c) => c.symbol === symbol)).toHaveLength(2)
      }
    })

    it('all cards start face-down and unmatched', () => {
      for (const card of createDeck()) {
        expect(card.isFlipped).toBe(false)
        expect(card.isMatched).toBe(false)
      }
    })
  })

  describe('createInitialState', () => {
    it('starts in idle phase', () => {
      expect(createInitialState().phase).toBe('idle')
    })

    it('starts with 0 moves', () => {
      expect(createInitialState().moves).toBe(0)
    })

    it('starts with 0 matched pairs', () => {
      expect(createInitialState().matchedPairs).toBe(0)
    })
  })

  describe('flipCard', () => {
    it('returns same state when not in playing phase', () => {
      const state = createInitialState() // phase = idle
      const next = flipCard(state, 0)
      expect(next).toBe(state)
    })

    it('adds card id to flippedIds when playing', () => {
      const state = { ...createInitialState(), phase: 'playing' as const }
      const next = flipCard(state, 0)
      expect(next.flippedIds).toContain(0)
    })

    it('transitions to checking phase when second card flipped', () => {
      let state = { ...createInitialState(), phase: 'playing' as const }
      state = flipCard(state, 0)
      state = flipCard(state, 1)
      expect(state.phase).toBe('checking')
    })

    it('does not flip same card twice', () => {
      let state = { ...createInitialState(), phase: 'playing' as const }
      state = flipCard(state, 0)
      const next = flipCard(state, 0)
      expect(next.flippedIds).toHaveLength(1)
    })
  })

  describe('checkMatch', () => {
    it('returns same state if fewer than 2 cards flipped', () => {
      const base = { ...createInitialState(), phase: 'playing' as const }
      const state = flipCard(base, 0)
      expect(checkMatch(state)).toBe(state)
    })

    it('increments matchedPairs on a valid match', () => {
      const deck = createDeck()
      // Find two cards with the same symbol
      const firstCard = deck[0]
      const twin = deck.find((c) => c.symbol === firstCard.symbol && c.id !== firstCard.id)!
      const base = {
        ...createInitialState(),
        phase: 'checking' as const,
        cards: deck,
        flippedIds: [firstCard.id, twin.id],
      }
      const next = checkMatch(base)
      expect(next.matchedPairs).toBe(1)
    })

    it('marks cards as matched on a match', () => {
      const deck = createDeck()
      const firstCard = deck[0]
      const twin = deck.find((c) => c.symbol === firstCard.symbol && c.id !== firstCard.id)!
      const base = {
        ...createInitialState(),
        phase: 'checking' as const,
        cards: deck,
        flippedIds: [firstCard.id, twin.id],
      }
      const next = checkMatch(base)
      const matched = next.cards.filter((c) => c.isMatched)
      expect(matched.some((c) => c.id === firstCard.id)).toBe(true)
    })
  })

  describe('rules', () => {
    it('isWon returns false when not won', () => {
      expect(isWon(createInitialState())).toBe(false)
    })

    it('remainingPairs returns TOTAL_PAIRS initially', () => {
      expect(remainingPairs(createInitialState())).toBe(TOTAL_PAIRS)
    })

    it('efficiencyScore returns 0 before any moves', () => {
      expect(efficiencyScore(createInitialState())).toBe(0)
    })

    it('isCardVisible returns false for unflipped card', () => {
      const state = createInitialState()
      expect(isCardVisible(state, 0)).toBe(false)
    })
  })
})
