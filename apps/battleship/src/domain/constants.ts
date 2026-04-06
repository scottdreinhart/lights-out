/**
 * Game constants — magic numbers & config extracted to a single source of truth.
 */

import type { Difficulty, GameStats, ShipDef } from './types'

export const GRID_SIZE = 10

export const SHIP_DEFS: readonly ShipDef[] = [
  { name: 'Carrier', length: 5 },
  { name: 'Battleship', length: 4 },
  { name: 'Cruiser', length: 3 },
  { name: 'Submarine', length: 3 },
  { name: 'Destroyer', length: 2 },
]

export const DEFAULT_STATS: GameStats = {
  wins: 0,
  losses: 0,
  streak: 0,
  bestStreak: 0,
}

/** Difficulty presets — affects CPU AI behavior */
export interface DifficultyPreset {
  readonly label: string
  readonly delay: number // AI response delay (ms)
  readonly randomization: number // 0-1 probability of random move
  readonly smartTargeting: boolean // Hunt/target strategy
}

export const DIFFICULTY_PRESETS: Record<Difficulty, DifficultyPreset> = {
  easy: {
    label: 'Easy',
    delay: 600,
    randomization: 0.6, // 60% chance of random move
    smartTargeting: false, // Pure random hunt
  },
  medium: {
    label: 'Medium',
    delay: 400,
    randomization: 0.2, // 20% chance of random move
    smartTargeting: true, // Hunt/target strategy
  },
  hard: {
    label: 'Hard',
    delay: 200,
    randomization: 0.05, // 5% chance of random move
    smartTargeting: true, // Hunt/target strategy
  },
}
