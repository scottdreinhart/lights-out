/**
 * memory — domain rules unit tests.
 * Tests card reveal logic and game state management.
 */

import { describe, expect, it } from 'vitest'
import { revealCard } from './rules'
import { createInitialGameState } from './constants'

describe('memory rules', () => {
  describe('revealCard', () => {
    it('returns same state when game is over', () => {
      const state = { ...createInitialGameState(), gameOver: true }
      const next = revealCard(state, state.cards[0].id)
      expect(next).toBe(state)
    })

    it('returns same state when card is already revealed', () => {
      const state = createInitialGameState()
      const firstCard = state.cards[0]
      const alreadyRevealed = { ...state, cards: state.cards.map(c => c.id === firstCard.id ? { ...c, revealed: true } : c) }
      const next = revealCard(alreadyRevealed, firstCard.id)
      expect(next.cards.filter(c => c.revealed).length).toBe(1)
    })

    it('adds card to selectedCards when revealing first card', () => {
      const state = createInitialGameState()
      const cardId = state.cards[0].id
      const next = revealCard(state, cardId)
      expect(next.selectedCards).toContain(cardId)
    })

    it('returns same state when 2 cards already selected and processing', () => {
      const state = createInitialGameState()
      const twoSelected = { ...state, selectedCards: [state.cards[0].id, state.cards[1].id], isProcessing: true }
      const next = revealCard(twoSelected, state.cards[2].id)
      expect(next).toBe(twoSelected)
    })

    it('marks cards as matched when values are equal', () => {
      const base = createInitialGameState()
      // Find two cards with the same value (they exist in pairs)
      const matchValue = base.cards[0].value
      const pair = base.cards.filter(c => c.value === matchValue).slice(0, 2)
      expect(pair).toHaveLength(2)

      let state = revealCard(base, pair[0].id)
      state = revealCard(state, pair[1].id)

      const matched = state.cards.filter(c => c.matched)
      expect(matched.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('createInitialGameState', () => {
    it('creates a game with 16 cards (4x4 grid)', () => {
      const state = createInitialGameState()
      expect(state.cards).toHaveLength(16)
    })

    it('all cards start face-down and unmatched', () => {
      const state = createInitialGameState()
      for (const card of state.cards) {
        expect(card.revealed).toBe(false)
        expect(card.matched).toBe(false)
      }
    })

    it('cards come in matching pairs', () => {
      const state = createInitialGameState()
      const valueCounts: Record<number, number> = {}
      for (const card of state.cards) {
        valueCounts[card.value] = (valueCounts[card.value] ?? 0) + 1
      }
      for (const count of Object.values(valueCounts)) {
        expect(count).toBe(2)
      }
    })
  })
})
