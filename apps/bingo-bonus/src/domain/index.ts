/**
 * Bingo Bonus - Domain Layer Exports
 *
 * Bingo Bonus uses standard bingo-core rules with bonus multiplier mechanics.
 * All domain logic reuses bingo-core types, rules, and base constants.
 */

import type { BingoPattern } from '@games/bingo-core'

// Export app-specific bonus metadata used by local domain tests.
export const BONUS_MULTIPLIER = 2

export const BINGO_PATTERNS: Record<string, { name: string; pattern: BingoPattern }> = {
  horizontal: { name: 'Horizontal Line', pattern: 'line-horizontal' },
  vertical: { name: 'Vertical Line', pattern: 'line-vertical' },
  fullHouse: { name: 'Full House', pattern: 'full-house' },
}

export type { BingoCard, BingoGameState, BingoPattern } from '@games/bingo-core'
