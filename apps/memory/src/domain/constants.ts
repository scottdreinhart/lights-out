/**
 * Memory Game: Constants & Factories
 */

import type { Card, GameState } from './types'

export const GRID_SIZE = 16 // 4x4
export const PAIRS = GRID_SIZE / 2

export function createCard(id: string, value: number, suit: string): Card {
  return {
    id,
    value,
    suit,
    revealed: false,
    matched: false,
  }
}

export function createInitialCards(): Card[] {
  const cards: Card[] = []
  const suits = ['♥', '♦', '♣', '♠']

  // Create pairs
  for (let i = 0; i < PAIRS; i++) {
    const suit = suits[i % suits.length]
    const value = Math.floor(i / 2) + 1

    cards.push(createCard(`${i}-a`, value, suit))
    cards.push(createCard(`${i}-b`, value, suit))
  }

  // Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }

  return cards
}

export function createInitialGameState(): GameState {
  return {
    cards: createInitialCards(),
    moves: 0,
    matches: 0,
    selectedCards: [],
    isProcessing: false,
    gameOver: false,
    startTime: Date.now(),
  }
}
