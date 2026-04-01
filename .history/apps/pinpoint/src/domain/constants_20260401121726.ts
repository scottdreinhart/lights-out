import type { Difficulty, GameConfig, Color } from './types'

export const COLORS: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']

export const DIFFICULTY_CONFIGS: Record<Difficulty, GameConfig> = {
  easy: {
    codeLength: 4,
    numColors: 4,
    maxGuesses: 10,
    difficulty: 'easy'
  },
  medium: {
    codeLength: 5,
    numColors: 6,
    maxGuesses: 12,
    difficulty: 'medium'
  },
  hard: {
    codeLength: 6,
    numColors: 6,
    maxGuesses: 15,
    difficulty: 'hard'
  }
}

export const COLOR_DISPLAY_NAMES: Record<Color, string> = {
  red: 'Red',
  blue: 'Blue',
  green: 'Green',
  yellow: 'Yellow',
  purple: 'Purple',
  orange: 'Orange'
}

export const COLOR_HEX_CODES: Record<Color, string> = {
  red: '#dc3545',
  blue: '#007bff',
  green: '#28a745',
  yellow: '#ffc107',
  purple: '#6f42c1',
  orange: '#fd7e14'
}

export const PEG_SIZE = 32
export const BOARD_PADDING = 20
export const GUESS_SPACING = 8
export const FEEDBACK_PEG_SIZE = 8