import { createGameActionsHook } from './useGameActionsFactory'

/**
 * Turn-based game actions
 */
export type TurnBasedGameAction = 'play' | 'pass' | 'draw' | 'discard' | 'forfeit' | 'undo'

/**
 * Callbacks for turn-based game controls
 */
export interface TurnBasedGameControlsCallbacks {
  /** Play: execute current action (keyboard: Enter) */
  onPlay?: () => void
  /** Pass: skip turn without action (keyboard: Space) */
  onPass?: () => void
  /** Draw: draw from deck (keyboard: D) */
  onDraw?: () => void
  /** Discard: discard card from hand (keyboard: X) */
  onDiscard?: () => void
  /** Forfeit: give up current game (keyboard: Q) */
  onForfeit?: () => void
  /** Undo: undo last action (keyboard: Z) */
  onUndo?: () => void
}

/**
 * Options for turn-based game controls
 */
export interface TurnBasedGameControlsOptions {
  /** Whether keyboard input is enabled (default: true) */
  enabled?: boolean
}

/**
 * Configuration for turn-based game keyboard bindings
 */
const TURN_BASED_CONFIG = {
  play: {
    keys: ['Enter'],
    label: 'Play',
  },
  pass: {
    keys: ['Space'],
    label: 'Pass',
  },
  draw: {
    keys: ['KeyD'],
    label: 'Draw',
  },
  discard: {
    keys: ['KeyX'],
    label: 'Discard',
  },
  forfeit: {
    keys: ['KeyQ'],
    label: 'Forfeit',
  },
  undo: {
    keys: ['KeyZ'],
    label: 'Undo',
  },
} as const

/**
 * useTurnBasedControls — Hook for turn-based game keyboard shortcuts
 *
 * Provides semantic keyboard controls for turn-based games:
 * - Play: Enter key
 * - Pass: Space key
 * - Draw: D key
 * - Discard: X key
 * - Forfeit: Q key
 * - Undo: Z key
 *
 * Generated using createGameActionsHook factory.
 *
 * @example
 * ```tsx
 * useTurnBasedControls({
 *   onPlay: () => executeAction(),
 *   onPass: () => skipTurn(),
 *   onDraw: () => drawCard(),
 * })
 * ```
 */
export const useTurnBasedControls = createGameActionsHook(TURN_BASED_CONFIG)
