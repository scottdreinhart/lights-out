/**
 * Progressive Bingo card generation and marking
 */

import { CARD_SIZE, CENTER_INDEX, GRID_SIZE, MAX_NUMBER } from './constants'
import type { Card } from './types'

let fallbackIdCounter = 0

const getWebCrypto = (): Crypto | null =>
  typeof globalThis !== 'undefined' && 'crypto' in globalThis ? globalThis.crypto : null

const getRandomInt = (maxExclusive: number): number => {
  const crypto = getWebCrypto()
  if (crypto?.getRandomValues) {
    const values = new Uint32Array(1)
    crypto.getRandomValues(values)
    return values[0] % maxExclusive
  }
  fallbackIdCounter += 1
  return Math.abs((Date.now() ^ (fallbackIdCounter * 2654435761)) >>> 0) % maxExclusive
}

// UUID generation helper
const generateId = (): string => {
  const crypto = getWebCrypto()
  if (crypto?.randomUUID) {
    return crypto.randomUUID()
  }
  fallbackIdCounter += 1
  return `card-${Date.now()}-${fallbackIdCounter}`
}

/**
 * Generate a single progressive bingo card (5x5 grid with free center)
 */
function generateCard(): Card {
  const squares: (number | null)[] = []
  const used = new Set<number>()
  const marked: boolean[] = []

  // Generate 24 unique numbers from 1-MAX_NUMBER (center is free)
  for (let i = 0; i < CARD_SIZE; i++) {
    if (i === CENTER_INDEX) {
      squares.push(null) // Free center tile
      marked.push(true) // Center is always marked (free space)
    } else {
      let num: number
      do {
        num = getRandomInt(MAX_NUMBER) + 1
      } while (used.has(num))
      squares.push(num)
      marked.push(false)
      used.add(num)
    }
  }

  return {
    id: generateId(),
    squares,
    marked,
  }
}

/**
 * Generate multiple bingo cards
 */
export function createBingoCards(count: number): Card[] {
  return Array.from({ length: count }, () => generateCard())
}

/**
 * Mark a number on all cards
 */
export function markNumber(cards: Card[], number: number): Card[] {
  return cards.map((card) => {
    const newMarked = [...card.marked]
    for (let i = 0; i < card.squares.length; i++) {
      if (card.squares[i] === number) {
        newMarked[i] = true
      }
    }
    return {
      ...card,
      marked: newMarked,
    }
  })
}

/**
 * Check if a row is marked
 */
function isRowMarked(card: Card, row: number): boolean {
  const start = row * GRID_SIZE
  const end = start + GRID_SIZE
  return card.marked.slice(start, end).every((m) => m)
}

/**
 * Check if a column is marked
 */
function isColumnMarked(card: Card, col: number): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    if (!card.marked[row * GRID_SIZE + col]) {
      return false
    }
  }
  return true
}

/**
 * Check if diagonal 1 (top-left to bottom-right) is marked
 */
function isDiagonal1Marked(card: Card): boolean {
  for (let i = 0; i < GRID_SIZE; i++) {
    if (!card.marked[i * GRID_SIZE + i]) {
      return false
    }
  }
  return true
}

/**
 * Check if diagonal 2 (top-right to bottom-left) is marked
 */
function isDiagonal2Marked(card: Card): boolean {
  for (let i = 0; i < GRID_SIZE; i++) {
    if (!card.marked[i * GRID_SIZE + (GRID_SIZE - 1 - i)]) {
      return false
    }
  }
  return true
}

/**
 * Check if a card is a winner
 */
export function isWinner(card: Card): boolean {
  // Check rows
  for (let row = 0; row < GRID_SIZE; row++) {
    if (isRowMarked(card, row)) {
      return true
    }
  }

  // Check columns
  for (let col = 0; col < GRID_SIZE; col++) {
    if (isColumnMarked(card, col)) {
      return true
    }
  }

  // Check diagonals
  return isDiagonal1Marked(card) || isDiagonal2Marked(card)
}
