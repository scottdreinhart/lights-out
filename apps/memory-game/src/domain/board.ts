/**
 * Memory Game — Domain Board Operations
 * Pure functions for creating and manipulating game state.
 * No React, no DOM — purely functional transformations.
 */

import type { CardSymbol, GameState, MemoryCard } from './types'

export const SYMBOLS: CardSymbol[] = ['🎮', '🎲', '🎯', '🏆', '🎸', '🎨', '🎭', '🎪']
export const TOTAL_PAIRS = SYMBOLS.length

const getWebCrypto = (): Crypto => {
  if (
    typeof globalThis !== 'undefined' &&
    typeof globalThis.crypto?.getRandomValues === 'function'
  ) {
    return globalThis.crypto
  }

  throw new Error('Web Crypto API is unavailable')
}

const secureRandomInt = (maxExclusive: number): number => {
  const upperBound = Math.floor(maxExclusive)
  if (upperBound <= 0) {
    return 0
  }

  const crypto = getWebCrypto()
  const values = new Uint32Array(1)
  const limit = Math.floor(0x100000000 / upperBound) * upperBound

  let value = 0
  do {
    crypto.getRandomValues(values)
    value = values[0]
  } while (value >= limit)

  return value % upperBound
}

const secureShuffle = <T>(values: readonly T[]): T[] => {
  const shuffled = [...values]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomInt(index + 1)
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return shuffled
}

/**
 * Create a shuffled deck with paired cards.
 */
export function createDeck(): MemoryCard[] {
  const pairs = [...SYMBOLS, ...SYMBOLS]
  return secureShuffle(pairs).map((symbol, id) => ({
    id,
    symbol,
    isFlipped: false,
    isMatched: false,
  }))
}

/**
 * Create the initial game state.
 */
export function createInitialState(): GameState {
  return {
    cards: createDeck(),
    flippedIds: [],
    matchedPairs: 0,
    moves: 0,
    phase: 'idle',
  }
}

/**
 * Flip a card by id. Returns a new state.
 */
export function flipCard(state: GameState, id: number): GameState {
  if (state.phase !== 'playing') {
    return state
  }
  if (state.flippedIds.length >= 2) {
    return state
  }
  if (state.flippedIds.includes(id)) {
    return state
  }

  const card = state.cards.find((c) => c.id === id)
  if (!card || card.isMatched) {
    return state
  }

  const newFlipped = [...state.flippedIds, id]
  const newCards = state.cards.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
  const newPhase = newFlipped.length === 2 ? 'checking' : 'playing'

  return {
    ...state,
    cards: newCards,
    flippedIds: newFlipped,
    phase: newPhase as GameState['phase'],
  }
}

/**
 * Check if the two flipped cards match. Returns a new state.
 */
export function checkMatch(state: GameState): GameState {
  if (state.flippedIds.length !== 2) {
    return state
  }

  const [a, b] = state.flippedIds.map((id) => state.cards.find((c) => c.id === id)!)
  const isMatch = a.symbol === b.symbol
  const newMatchedPairs = state.matchedPairs + (isMatch ? 1 : 0)

  const newCards = state.cards.map((c) => {
    if (!state.flippedIds.includes(c.id)) {
      return c
    }
    return { ...c, isMatched: isMatch, isFlipped: isMatch }
  })

  const won = newMatchedPairs === TOTAL_PAIRS

  return {
    ...state,
    cards: newCards,
    flippedIds: [],
    matchedPairs: newMatchedPairs,
    moves: state.moves + 1,
    phase: won ? 'won' : 'playing',
  }
}
