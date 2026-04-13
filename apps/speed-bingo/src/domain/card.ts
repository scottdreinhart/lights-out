/**
 * Speed Bingo card generation and marking
 */

import { v4 as uuid } from 'uuid'
import { CARD_SIZE, MAX_NUMBER } from './constants'
import type { Card } from './types'

/**
 * Generate a single speed bingo card
 */
function generateCard(): Card {
  const squares: (number | null)[] = []
  const used = new Set<number>()

  // Generate unique numbers from 1-MAX_NUMBER
  while (squares.length < CARD_SIZE) {
    const num = Math.floor(Math.random() * MAX_NUMBER) + 1
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
 * Generate multiple speed bingo cards
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
 * Check if a card is a winner
 */
export function isWinner(card: Card): boolean {
  const size = Math.sqrt(card.squares.length)

  // Check rows
  for (let i = 0; i < size; i++) {
    let rowComplete = true
    for (let j = 0; j < size; j++) {
      if (!card.marked[i * size + j]) {
        rowComplete = false
        break
      }
    }
    if (rowComplete) return true
  }

  // Check columns
  for (let j = 0; j < size; j++) {
    let colComplete = true
    for (let i = 0; i < size; i++) {
      if (!card.marked[i * size + j]) {
        colComplete = false
        break
      }
    }
    if (colComplete) return true
  }

  // Check diagonals
  let diag1Complete = true
  for (let i = 0; i < size; i++) {
    if (!card.marked[i * size + i]) {
      diag1Complete = false
      break
    }
  }
  if (diag1Complete) return true

  let diag2Complete = true
  for (let i = 0; i < size; i++) {
    if (!card.marked[i * size + (size - 1 - i)]) {
      diag2Complete = false
      break
    }
  }
  if (diag2Complete) return true

  return false
}

/**
 * Check winning patterns across cards
 */
export function checkWinningPatterns(cards: Card[]): Card[] {
  return cards.filter((card) => isWinner(card))
}
