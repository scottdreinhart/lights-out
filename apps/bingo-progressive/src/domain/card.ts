/**
 * Progressive Bingo card generation and marking
 */

import { v4 as uuid } from 'crypto'
import type { Card } from './types'

const GRID_SIZE = 5
const CARD_SIZE = GRID_SIZE * GRID_SIZE
const CENTER_INDEX = Math.floor(GRID_SIZE / 2) * GRID_SIZE + Math.floor(GRID_SIZE / 2)

/**
 * Generate a single progressive bingo card (5x5 grid with free center)
 */
function generateCard(): Card {
  const squares: (number | null)[] = []
  const used = new Set<number>()

  // Generate 24 unique numbers from 1-75 (center is free)
  for (let i = 0; i < CARD_SIZE; i++) {
    if (i === CENTER_INDEX) {
      squares.push(null) // Free center tile
    } else {
      let num: number
      do {
        num = Math.floor(Math.random() * 75) + 1
      } while (used.has(num))
      squares.push(num)
      used.add(num)
    }
  }

  return {
    id: uuid(),
    squares,
    marked: Array(CARD_SIZE).fill(i === CENTER_INDEX ? true : false)
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
  return cards.map(card => ({
    ...card,
    marked: card.squares.map((square, idx) =>
      square === number ? true : card.marked[idx]
    )
  }))
}

/**
 * Check if a card is a winner
 */
export function isWinner(card: Card): boolean {
  // Check rows
  for (let row = 0; row < GRID_SIZE; row++) {
    const start = row * GRID_SIZE
    const end = start + GRID_SIZE
    if (card.marked.slice(start, end).every(m => m)) {
      return true
    }
  }

  // Check columns
  for (let col = 0; col < GRID_SIZE; col++) {
    let columnComplete = true
    for (let row = 0; row < GRID_SIZE; row++) {
      if (!card.marked[row * GRID_SIZE + col]) {
        columnComplete = false
        break
      }
    }
    if (columnComplete) return true
  }

  // Check diagonals
  let diagonal1 = true
  let diagonal2 = true
  for (let i = 0; i < GRID_SIZE; i++) {
    if (!card.marked[i * GRID_SIZE + i]) diagonal1 = false
    if (!card.marked[i * GRID_SIZE + (GRID_SIZE - 1 - i)]) diagonal2 = false
  }

  return diagonal1 || diagonal2
}
