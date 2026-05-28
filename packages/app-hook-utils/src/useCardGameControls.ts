import { createGameActionsHook } from './useGameActionsFactory'

/**
 * Card game actions
 */
export type CardGameAction = 'hit' | 'stand' | 'double' | 'split' | 'surrender' | 'insurance'

/**
 * Callbacks for card game controls
 */
export interface CardGameControlsCallbacks {
  /** Hit: request another card (keyboard: H) */
  onHit?: () => void
  /** Stand: keep current hand (keyboard: S) */
  onStand?: () => void
  /** Double: double bet and take one card (keyboard: D) */
  onDouble?: () => void
  /** Split: split pair into two hands (keyboard: P) */
  onSplit?: () => void
  /** Surrender: give up half the bet (keyboard: U) */
  onSurrender?: () => void
  /** Insurance: insurance against dealer blackjack (keyboard: I) */
  onInsurance?: () => void
}

/**
 * Options for card game controls
 */
export interface CardGameControlsOptions {
  /** Whether keyboard input is enabled (default: true) */
  enabled?: boolean
}

/**
 * Configuration for card game keyboard bindings
 */
const CARD_GAME_CONFIG = {
  hit: {
    keys: ['KeyH'],
    label: 'Hit',
  },
  stand: {
    keys: ['KeyS'],
    label: 'Stand',
  },
  double: {
    keys: ['KeyD'],
    label: 'Double',
  },
  split: {
    keys: ['KeyP'],
    label: 'Split',
  },
  surrender: {
    keys: ['KeyU'],
    label: 'Surrender',
  },
  insurance: {
    keys: ['KeyI'],
    label: 'Insurance',
  },
} as const

/**
 * useCardGameControls — Hook for card game keyboard shortcuts
 *
 * Provides semantic keyboard controls for card-based games:
 * - Hit: H key
 * - Stand: S key
 * - Double: D key
 * - Split: P key
 * - Surrender: U key
 * - Insurance: I key
 *
 * Generated using createGameActionsHook factory.
 *
 * @example
 * ```tsx
 * useCardGameControls({
 *   onHit: () => handleAction('hit'),
 *   onStand: () => handleAction('stand'),
 *   onDouble: () => handleAction('double'),
 * })
 * ```
 */
export const useCardGameControls = createGameActionsHook(CARD_GAME_CONFIG)
