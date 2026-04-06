/**
 * War card game domain layer public API
 */

// Types
export type { Card, CardSuit, CardRank, GameState, GamePhase, WarSequence } from './types'

// Rules and game logic
export { playRound, isGameOver, getWinner, resetGame } from './rules'
export {
  type WarRuleConfig,
  DEFAULT_RULES,
  RULE_VARIANTS,
  getWarCardCount,
  validateRules,
  describeRules,
} from './rules/war.rules'

// Rules text
export { RULES_TEXT, getRulesText, RULE_DESCRIPTIONS } from './rules/war.rules.text'

// Constants and utilities
export {
  SUITS,
  RANKS,
  createDeck,
  getRankValue,
  compareCards,
  shuffleDeck,
  createInitialGameState,
  getDeckSize,
  hasEnoughCardsForWar,
  getWarCards,
  determineRoundWinner,
} from './constants'
