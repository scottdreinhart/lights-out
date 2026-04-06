/**
 * Memory Game: Game Rules & Logic
 */

import { createInitialGameState } from './constants'
import type { GameState } from './types'

export function revealCard(state: GameState, cardId: string): GameState {
  if (state.isProcessing || state.gameOver) return state

  const card = state.cards.find((c) => c.id === cardId)
  if (!card || card.revealed || card.matched) return state

  if (state.selectedCards.length >= 2) return state

  const newSelected = [...state.selectedCards, cardId]

  if (newSelected.length === 2) {
    return checkMatch(state, newSelected)
  }

  return {
    ...state,
    selectedCards: newSelected,
    cards: state.cards.map((c) => (c.id === cardId ? { ...c, revealed: true } : c)),
  }
}

function checkMatch(state: GameState, selected: string[]): GameState {
  const [id1, id2] = selected
  const card1 = state.cards.find((c) => c.id === id1)
  const card2 = state.cards.find((c) => c.id === id2)

  if (!card1 || !card2) return state

  const isMatch = card1.value === card2.value

  // Match found: mark cards as matched
  if (isMatch) {
    const newMatches = state.matches + 1
    const updatedCards = state.cards.map((c) =>
      c.id === id1 || c.id === id2 ? { ...c, matched: true } : c,
    )

    const isWon = newMatches === state.cards.length / 2

    return {
      ...state,
      cards: updatedCards,
      matches: newMatches,
      moves: state.moves + 1,
      selectedCards: [],
      isProcessing: false,
      gameOver: isWon,
    }
  }

  // Mismatch: flip back (async timing handled by hook, not here)
  return {
    ...state,
    moves: state.moves + 1,
    isProcessing: true,
    mismatchPair: selected, // Mark for hook to handle async flip
  }
}

export function resetGame(): GameState {
  return createInitialGameState()
}

export function isGameWon(state: GameState): boolean {
  return state.gameOver && state.matches === state.cards.length / 2
}

export function getElapsedTime(state: GameState): number {
  return Math.floor((Date.now() - state.startTime) / 1000)
}
