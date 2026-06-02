/**
 * War card game domain layer public API
 */

// Types
export type { Card, GamePhase, GameState, WarSequence } from './types'

// Rules and game logic
export { getWinner, isGameOver, playRound, resetGame } from './rules'
export {
  DEFAULT_RULES,
  RULE_VARIANTS,
  describeRules,
  getWarCardCount,
  validateRules,
  type WarRuleConfig,
} from './rules/war.rules'

// Rules text
export { RULES_TEXT, RULE_DESCRIPTIONS, getRulesText } from './rules/war.rules.text'

// Constants and utilities
export {
  compareCards,
  createDeck,
  createInitialGameState,
  determineRoundWinner,
  getDeckSize,
  getRankValue,
  getWarCards,
  hasEnoughCardsForWar,
  shuffleDeck,
} from './constants'
