/**
 * Farkle scoring rules and validation
 */

import type { DieValue } from '@games/common'

/**
 * Calculate score for a selection of dice
 * Farkle scoring:
 * - 1 = 100 points each
 * - 5 = 50 points each (unless part of three of a kind)
 * - Three of a kind (except 1s) = face value × 100 (e.g., three 3s = 300)
 * - Three 1s = 1000 points
 * - Four of a kind = Three of a kind × 2
 * - Five of a kind = Three of a kind × 3
 * - Six of a kind = Three of a kind × 4
 * - Straight (1-6) = 1500 points
 * - Full house = 1500 points
 */
export function calculateScore(dice: DieValue[]): number {
  if (dice.length === 0) return 0

  const counts = countDice(dice)
  let score = 0

  // Check for straight (1,2,3,4,5,6)
  if (dice.length === 6 && Object.keys(counts).length === 6) {
    return 1500
  }

  // Check for full house (3 of one kind, 2 of another)
  if (dice.length === 5) {
    const values = Object.values(counts)
    if (values.includes(3) && values.includes(2)) {
      return 1500
    }
  }

  // Process 1s
  const ones = counts[1] || 0
  if (ones >= 3) {
    score += 1000 + (ones - 3) * 100
  } else {
    score += ones * 100
  }

  // Process 5s
  const fives = counts[5] || 0
  if (fives >= 3) {
    score += 500 + (fives - 3) * 50 // 3-fives = 500, 4-fives = 550, etc.
  } else {
    score += fives * 50
  }

  // Process three/four/five/six of a kind for other values
  for (let value = 2; value <= 6; value++) {
    if (value === 5) continue // Already processed

    const count = counts[value] || 0
    if (count >= 3) {
      const multiplier = count - 2 // 3 of a kind = ×1, 4 of a kind = ×2, etc.
      score += (value * 100) * multiplier
    }
  }

  return score
}

/**
 * Count occurrences of each die value
 */
function countDice(dice: DieValue[]): Record<number, number> {
  const counts: Record<number, number> = {}
  for (const die of dice) {
    counts[die] = (counts[die] || 0) + 1
  }
  return counts
}

/**
 * Check if a selection of dice contains any scoreable dice
 */
export function hasScoreableDice(dice: DieValue[]): boolean {
  if (dice.length === 0) return false

  // Check for 1s or 5s
  if (dice.some((d) => d === 1 || d === 5)) {
    return true
  }

  // Check for three of a kind or better
  const counts = countDice(dice)
  for (const value of Object.values(counts)) {
    if (value >= 3) {
      return true
    }
  }

  return false
}

/**
 * Get all valid scoreable selections
 * (For UI feedback on which dice CAN be selected)
 */
export function getScoreableDiceIndices(dice: DieValue[]): number[] {
  const indices: number[] = []

  // 1s and 5s are always scoreable
  dice.forEach((d, i) => {
    if (d === 1 || d === 5) {
      indices.push(i)
    }
  })

  // Check for three-of-a-kind or better
  const counts = countDice(dice)
  const indexesByValue: Record<number, number[]> = {}
  dice.forEach((d, i) => {
    if (!indexesByValue[d]) indexesByValue[d] = []
    indexesByValue[d].push(i)
  })

  for (const [value, valueIndices] of Object.entries(indexesByValue)) {
    if (valueIndices.length >= 3) {
      // All dice of this value are scoreable
      indices.push(...valueIndices)
    }
  }

  return [...new Set(indices)] // Remove duplicates
}

/**
 * Check if a selection is valid according to Farkle rules
 */
export function isValidSelection(selectedDice: DieValue[]): boolean {
  return calculateScore(selectedDice) > 0
}
