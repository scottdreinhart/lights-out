/**
 * Swedish Bingo (Bingo-80) card generation and marking
 */

import { v4 as uuid } from 'crypto'
import type { Card } from './types'

const GRID_SIZE = 4
const CARD_SIZE = GRID_SIZE * GRID_SIZE

/**
 * Generate a single bingo card (4x4 grid, 80 balls)
 */
function generateCard(): Card {
  const squares: (number | null)[] = []
  const used = new Set<number>()

  // Generate 16 unique numbers from 1-80
  while (squares.length < CARD_SIZE) {
    const num = Math.floor(Math.random() * 80) + 1
    if (!used.has(num)) {
      squares.push(num)
      used.add(num)
    }
  }

  return {
    id: uuid(),
    squares,
    marked: Array(CARD_SIZE).fill(false),
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
  return cards.map((card) => ({
    ...card,
    marked: card.squares.map((square, idx) => (square === number ? true : card.marked[idx])),
  }))
}

/**
 * Check if a card is a winner (complete row, column, or diagonal)
 */
export function isWinner(card: Card): boolean {
  // Check rows
  for (let row = 0; row < GRID_SIZE; row++) {
    const start = row * GRID_SIZE
    const end = start + GRID_SIZE
    if (card.marked.slice(start, end).every((m) => m)) {
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
