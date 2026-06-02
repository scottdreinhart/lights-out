/**
 * Centralized Key Bindings Registry
 *
 * Single source of truth for all keyboard input mappings across the application.
 * Covers standard desktop controls, WASD alternatives, Fire TV remote keycodes,
 * and game-specific actions.
 *
 * This registry eliminates key binding duplication and makes it easy to:
 * - View all available key bindings at a glance
 * - Update bindings globally
 * - Ensure consistency across all games
 * - Support Fire TV remote input per AGENTS.md § 32.1
 */

/**
 * Directional controls - keyboard and Fire TV remote
 */
export const DIRECTIONAL_KEYS = {
  UP: {
    keyboard: ['ArrowUp', 'KeyW'],
    fireTV: 37,
    label: 'Up/North',
  },
  DOWN: {
    keyboard: ['ArrowDown', 'KeyS'],
    fireTV: 40,
    label: 'Down/South',
  },
  LEFT: {
    keyboard: ['ArrowLeft', 'KeyA'],
    fireTV: 39,
    label: 'Left/West',
  },
  RIGHT: {
    keyboard: ['ArrowRight', 'KeyD'],
    fireTV: 40,
    label: 'Right/East',
  },
} as const

/**
 * Action controls - primary interactions
 */
export const ACTION_KEYS = {
  CONFIRM: {
    keyboard: ['Enter', 'Space'],
    fireTV: 13,
    label: 'Confirm/Select',
  },
  CANCEL: {
    keyboard: ['Escape'],
    fireTV: 4,
    label: 'Cancel/Back',
  },
  MENU: {
    keyboard: ['Escape'],
    fireTV: 4,
    label: 'Menu/Escape',
  },
  PLAY_PAUSE: {
    keyboard: ['Space'],
    fireTV: 179,
    label: 'Play/Pause',
  },
  REWIND: {
    keyboard: [],
    fireTV: 227,
    label: 'Rewind',
  },
  FAST_FORWARD: {
    keyboard: [],
    fireTV: 228,
    label: 'Fast Forward',
  },
} as const

/**
 * Game-specific action controls
 */
export const GAME_ACTION_KEYS = {
  ROLL: {
    keyboard: ['Space'],
    label: 'Roll/Throw Dice',
  },
  HOLD: {
    keyboard: ['Enter'],
    label: 'Hold/Keep',
  },
  PASS: {
    keyboard: ['KeyP'],
    label: 'Pass Turn',
  },
  CONTINUE: {
    keyboard: ['KeyC', 'Space'],
    label: 'Continue/Next',
  },
  UNDO: {
    keyboard: ['KeyZ', 'KeyU'],
    label: 'Undo Move',
  },
  REDO: {
    keyboard: ['KeyY', 'KeyR'],
    label: 'Redo Move',
  },
  HINT: {
    keyboard: ['KeyH'],
    label: 'Show Hint',
  },
} as const

/**
 * Utility functions for key matching
 */

/**
 * Check if a keyboard key matches a directional binding
 */
export function keyMatchesDirectional(key: string, direction: keyof typeof DIRECTIONAL_KEYS): boolean {
  return (DIRECTIONAL_KEYS[direction].keyboard as readonly string[]).includes(key)
}

/**
 * Check if a keyboard key matches an action binding
 */
export function keyMatchesAction(key: string, action: keyof typeof ACTION_KEYS): boolean {
  return (ACTION_KEYS[action].keyboard as readonly string[]).includes(key)
}

/**
 * Check if a keyboard key matches a game action binding
 */
export function keyMatchesGameAction(key: string, gameAction: keyof typeof GAME_ACTION_KEYS): boolean {
  return (GAME_ACTION_KEYS[gameAction].keyboard as readonly string[]).includes(key)
}

/**
 * Get all keyboard keys for a direction
 */
export function getDirectionalKeys(direction: keyof typeof DIRECTIONAL_KEYS): readonly string[] {
  return DIRECTIONAL_KEYS[direction].keyboard as readonly string[]
}

/**
 * Get all keyboard keys for an action
 */
export function getActionKeys(action: keyof typeof ACTION_KEYS): readonly string[] {
  return ACTION_KEYS[action].keyboard as readonly string[]
}

/**
 * Get the Fire TV keycode for a direction
 */
export function getDirectionalFireTVCode(direction: keyof typeof DIRECTIONAL_KEYS): number | undefined {
  return DIRECTIONAL_KEYS[direction].fireTV
}

/**
 * Get the Fire TV keycode for an action
 */
export function getActionFireTVCode(action: keyof typeof ACTION_KEYS): number | undefined {
  return ACTION_KEYS[action].fireTV
}

/**
 * Map Fire TV keycode to action
 */
export function mapFireTVToAction(keyCode: number): keyof typeof ACTION_KEYS | keyof typeof DIRECTIONAL_KEYS | null {
  // Check directional keys
  for (const [direction, config] of Object.entries(DIRECTIONAL_KEYS)) {
    if (config.fireTV === keyCode) return direction as keyof typeof DIRECTIONAL_KEYS
  }

  // Check action keys
  for (const [action, config] of Object.entries(ACTION_KEYS)) {
    if (config.fireTV === keyCode) return action as keyof typeof ACTION_KEYS
  }

  return null
}

/**
 * Export all as a unified registry for reference
 */
export const KEY_BINDINGS_REGISTRY = {
  directional: DIRECTIONAL_KEYS,
  actions: ACTION_KEYS,
  gameActions: GAME_ACTION_KEYS,
} as const
