/**
 * Hangman — Domain Constants
 * Magic numbers & config extracted to a single source of truth.
 */

import type { Difficulty, GameStats } from './types'

/** Standard classic hangman allows 6 wrong guesses */
export const MAX_WRONG_GUESSES = 6

export const CPU_DELAY_MS = 400

export const DEFAULT_STATS: GameStats = {
  wins: 0,
  losses: 0,
  streak: 0,
  bestStreak: 0,
}

/** Word lists by difficulty */
export const WORDS_BY_DIFFICULTY: Record<Difficulty, string[]> = {
  easy: [
    'CAT',
    'DOG',
    'SUN',
    'HAT',
    'CUP',
    'PIG',
    'BEE',
    'ANT',
    'MAP',
    'FOX',
    'OWL',
    'EGG',
    'ICE',
    'JAM',
    'KEY',
    'LEG',
    'MUD',
    'NET',
    'OAK',
    'PAD',
  ],
  medium: [
    'APPLE',
    'BEACH',
    'CRANE',
    'DRIVE',
    'EAGLE',
    'FLAME',
    'GLOBE',
    'HORSE',
    'IMAGE',
    'JOKER',
    'KNIFE',
    'LEMON',
    'MAGIC',
    'NIGHT',
    'OCEAN',
    'PLANT',
    'QUEEN',
    'RIVER',
    'STORM',
    'TIGER',
    'UNDER',
    'VIVID',
    'WATER',
    'XENON',
  ],
  hard: [
    'ALGORITHM',
    'BLUEPRINT',
    'CRYPTOGRAPHY',
    'DERIVATIVE',
    'EQUILIBRIUM',
    'FIBONACCI',
    'HIEROGLYPH',
    'INFRASTRUCTURE',
    'JURISDICTION',
    'KALEIDOSCOPE',
    'LABYRINTH',
    'MNEMONIC',
    'NOMENCLATURE',
    'ORCHESTRA',
    'PALINDROME',
    'QUARANTINE',
    'RENAISSANCE',
    'SYLLOGISM',
    'TAXONOMY',
    'UBIQUITOUS',
  ],
}
