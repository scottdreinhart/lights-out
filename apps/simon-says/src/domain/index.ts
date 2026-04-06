/**
 * Domain layer barrel export.
 * Re-exports all pure, framework-agnostic game logic.
 *
 * Usage: import { startGame, playerMove, DEFAULT_RULES } from '@/domain'
 */

// Game orchestration functions from rules.ts
export {
  handleTimeout,
  playerAddsColor,
  playerMove,
  resetGame,
  startGame,
} from './rules'

// Rule configuration from rules/ directory
export {
  DEFAULT_RULES,
  RULE_VARIANTS,
  describeRules,
  getColorSequence,
  validateRules,
  type SimonColor,
  type SimonRuleConfig,
  type SimonRuleVariant,
} from './rules/index'

// Re-export all other domain modules
export * from './ai'
export * from './board'
export * from './constants'
export * from './layers'
export * from './responsive'
export * from './sprites'
export * from './themes'
export * from './types'



