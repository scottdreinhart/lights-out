/**
 * Simon Game Rule Configuration System
 * Normalized from authoritative sources:
 * - Hasbro Official Instructions
 * - Wikipedia (history + variants)
 * - Game Rules (consensus mechanics)
 * - House of Games (detailed gameplay)
 */

export type SimonRuleConfig = {
  maxSequenceLength: number // 31 (classic) or variant
  inputTimeoutMs: number // 5000ms (5 seconds per move)
  speedIncreaseEnabled: boolean // Speeds up after 5th, 9th, 13th signals
  playerAddsMode: boolean // Player adds to sequence instead of device
  multiplayerMode: boolean // Players take turns
  eliminationMode: boolean // Failure = eliminated
  colorCount: 4 | 6 | 8 // Button count (4=classic, 6=super, 8=swipe)
  inputMode: 'button' | 'gesture' | 'swipe' | 'voice' // Input method
  difficultyLevel: 1 | 2 | 3 | 4 // Speed progression
  soundEnabled: boolean
  soundVolume: 'low' | 'medium' | 'high'
}

export type SimonColor = 'red' | 'green' | 'yellow' | 'blue' | 'orange' | 'purple' | 'cyan' | 'pink'

export interface SimonRuleVariant {
  name: string
  config: SimonRuleConfig
  description: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
}

export const DEFAULT_RULES: SimonRuleConfig = {
  maxSequenceLength: 31, // Bicycle Cards standard
  inputTimeoutMs: 5000, // 5 seconds per move
  speedIncreaseEnabled: true, // Speed increases at thresholds
  playerAddsMode: false, // Device generates sequence
  multiplayerMode: false, // Single player
  eliminationMode: false, // No elimination
  colorCount: 4, // Classic 4 buttons
  inputMode: 'button', // Button press input
  difficultyLevel: 1, // Slowest start
  soundEnabled: true,
  soundVolume: 'medium',
}

export const RULE_VARIANTS: Record<string, SimonRuleVariant> = {
  CLASSIC: {
    name: 'Classic Simon',
    config: {
      ...DEFAULT_RULES,
      colorCount: 4,
      inputMode: 'button',
      difficultyLevel: 1,
    },
    description:
      'Original 1978 Simon: Device generates, you repeat. 4 buttons, speeds up over time.',
    difficulty: 'medium',
  },

  PLAYER_ADDS: {
    name: 'Player Adds',
    config: {
      ...DEFAULT_RULES,
      playerAddsMode: true,
      colorCount: 4,
      inputMode: 'button',
      difficultyLevel: 1,
    },
    description:
      'You start with 1 color, then add 1 each round. Device only gives RAZZ or victory.',
    difficulty: 'hard',
  },

  QUICK_GAME: {
    name: 'Quick Game',
    config: {
      ...DEFAULT_RULES,
      maxSequenceLength: 16, // Shorter path to victory
      colorCount: 4,
      inputMode: 'button',
      difficultyLevel: 2, // Faster start
    },
    description: 'Shorter sequence (16 colors). Faster pace for quick play.',
    difficulty: 'easy',
  },

  SPEED_MODE: {
    name: 'Speed Mode',
    config: {
      ...DEFAULT_RULES,
      speedIncreaseEnabled: true,
      colorCount: 4,
      inputMode: 'button',
      difficultyLevel: 3, // Fast from start
    },
    description: 'Sequence playback accelerates with each round. Speeds up at thresholds.',
    difficulty: 'expert',
  },

  TIMED_MODE: {
    name: 'Timed Mode',
    config: {
      ...DEFAULT_RULES,
      inputTimeoutMs: 3000, // Only 3 seconds per move
      colorCount: 4,
      inputMode: 'button',
      difficultyLevel: 1,
    },
    description: 'Strict 3-second time limit. Fail if too slow.',
    difficulty: 'hard',
  },

  MULTIPLAYER: {
    name: 'Multiplayer',
    config: {
      ...DEFAULT_RULES,
      multiplayerMode: true,
      eliminationMode: true,
      colorCount: 4,
      inputMode: 'button',
      difficultyLevel: 1,
    },
    description: 'Players take turns. Failure = eliminated. Last player wins.',
    difficulty: 'medium',
  },

  SIMON_SWIPE: {
    name: 'Simon Swipe',
    config: {
      ...DEFAULT_RULES,
      colorCount: 8, // 8 touchscreen buttons
      inputMode: 'swipe', // Directional input
      maxSequenceLength: 31,
      difficultyLevel: 1,
    },
    description: 'Swipe in directions instead of pressing buttons. 8-color circular layout.',
    difficulty: 'medium',
  },

  SIMON_AIR: {
    name: 'Simon Air',
    config: {
      ...DEFAULT_RULES,
      colorCount: 4,
      inputMode: 'gesture', // Motion sensor input
      maxSequenceLength: 31,
      difficultyLevel: 1,
    },
    description: 'Gesture input using motion sensors instead of buttons. Touchless play.',
    difficulty: 'medium',
  },

  SIMON_SURPRISE: {
    name: 'Simon Surprise',
    config: {
      ...DEFAULT_RULES,
      colorCount: 4, // Buttons have no colors (memorize by position)
      inputMode: 'button',
      difficultyLevel: 2, // Harder without colors
    },
    description: 'All buttons are same color. Memorize by position only, no visual cues.',
    difficulty: 'hard',
  },

  SIMON_BOUNCE: {
    name: 'Simon Bounce',
    config: {
      ...DEFAULT_RULES,
      colorCount: 4,
      inputMode: 'button',
      difficultyLevel: 1,
    },
    description: 'Colors shift positions each round. Buttons move around the board.',
    difficulty: 'hard',
  },

  SIMON_REWIND: {
    name: 'Simon Rewind',
    config: {
      ...DEFAULT_RULES,
      colorCount: 4,
      inputMode: 'button',
      difficultyLevel: 2,
    },
    description: 'Repeat the sequence in reverse order instead of forward.',
    difficulty: 'hard',
  },

  SIMON_EXPERT: {
    name: 'Simon Expert',
    config: {
      ...DEFAULT_RULES,
      maxSequenceLength: 31,
      inputTimeoutMs: 2000, // 2 seconds only
      speedIncreaseEnabled: true,
      colorCount: 4,
      inputMode: 'button',
      difficultyLevel: 4, // Maximum difficulty
    },
    description: 'Expert mode: 31 colors, 2-second timeout, fast speed increases.',
    difficulty: 'expert',
  },
}

export function getColorSequence(colorCount: 4 | 6 | 8): SimonColor[] {
  const allColors: SimonColor[] = [
    'red',
    'green',
    'yellow',
    'blue',
    'orange',
    'purple',
    'cyan',
    'pink',
  ]
  return allColors.slice(0, colorCount)
}

export function validateRules(config: SimonRuleConfig): string[] {
  const errors: string[] = []

  if (config.maxSequenceLength < 1 || config.maxSequenceLength > 99) {
    errors.push('maxSequenceLength must be between 1 and 99')
  }

  if (config.inputTimeoutMs < 500 || config.inputTimeoutMs > 30000) {
    errors.push('inputTimeoutMs must be between 500ms and 30s')
  }

  if (![4, 6, 8].includes(config.colorCount)) {
    errors.push('colorCount must be 4, 6, or 8')
  }

  if (![1, 2, 3, 4].includes(config.difficultyLevel)) {
    errors.push('difficultyLevel must be 1, 2, 3, or 4')
  }

  if (config.playerAddsMode && config.multiplayerMode) {
    errors.push('playerAddsMode and multiplayerMode cannot both be true')
  }

  return errors
}

export function describeRules(config: SimonRuleConfig): string {
  const parts: string[] = []

  parts.push(`Max Sequence: ${config.maxSequenceLength} colors`)
  parts.push(`Input Timeout: ${config.inputTimeoutMs}ms`)
  parts.push(`Colors: ${config.colorCount}`)
  parts.push(`Input Mode: ${config.inputMode}`)
  parts.push(`Difficulty: ${config.difficultyLevel}/4`)

  if (config.speedIncreaseEnabled) {
    parts.push('Speed increases at thresholds')
  }

  if (config.playerAddsMode) {
    parts.push('Player adds to sequence')
  }

  if (config.multiplayerMode) {
    parts.push('Multiplayer mode enabled')
  }

  if (config.eliminationMode) {
    parts.push('Elimination on failure')
  }

  return parts.join(' • ')
}
