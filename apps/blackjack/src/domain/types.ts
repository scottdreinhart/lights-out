/**
 * Blackjack Domain Types
 *
 * Pure type definitions for the blackjack game logic.
 * Framework-agnostic; used throughout domain and app layers.
 */

import type { Card } from '@games/card-deck-core'

// ┌─────────────────────────────────────────────────────────┐
// │ CARD & DECK TYPES                                       │
// └─────────────────────────────────────────────────────────┘

// Use shared card types from card-deck-core
export type { Card, Rank, Suit } from '@games/card-deck-core'

// ┌─────────────────────────────────────────────────────────┐
// │ HAND & BETTING TYPES                                    │
// └─────────────────────────────────────────────────────────┘

// ┌─────────────────────────────────────────────────────────┐
// │ HAND & BETTING TYPES                                    │
// └─────────────────────────────────────────────────────────┘

export type HandStatus = 'initial' | 'playing' | 'stand' | 'bust' | 'blackjack' | 'settled'
export type SettlementResult = 'win' | 'loss' | 'push'

export interface Hand {
  id: string
  cards: Card[]
  bet: number
  status: HandStatus
}

export interface HandValue {
  hard: number // Total with all aces counting as 1
  soft?: number // Total if one ace counts as 11 (when it doesn't bust)
}

// ┌─────────────────────────────────────────────────────────┐
// │ PLAYER & DEALER TYPES                                   │
// └─────────────────────────────────────────────────────────┘

export interface Player {
  id: string
  balance: number
  currentHand: Hand
  splitHands: Hand[] // For split hands (up to 4 total hands)
  result?: SettlementResult
  payout?: number // Amount won/lost on this round
}

export interface Dealer {
  hand: Card[]
  hiddenCard?: Card // First card dealt face-down (revealed when dealer plays)
  status: 'initial' | 'playing' | 'bust' | 'stand'
}

// ┌─────────────────────────────────────────────────────────┐
// │ GAME RULES & CONFIGURATION                              │
// └─────────────────────────────────────────────────────────┘

export type DoubleDownRule = 'any' | '9-11' | '10-11'
export type BlackjackPayoutRatio = 1.5 | 1.2 | 1.0 // 3:2, 6:5, 1:1

export interface GameRules {
  // Deck Configuration
  deckCount: number // 1, 2, 4, 6, 8

  // Dealer Rules
  dealerHitsSoft17: boolean // H17 vs S17: true = hit soft 17, false = stand

  // Player Action Rules
  doubleDownOn: DoubleDownRule // Which hands allow doubling
  canSurrender: boolean // Early surrender allowed
  maxSplits: number // Maximum number of times can split (creates 2-4 hands)
  canResplitAces: boolean // Whether aces can be resplit after initial split
  aces1CardOnly: boolean // Split aces get only 1 card each (almost always true in casinos)

  // Payout Rules
  blackjackPayoutRatio: BlackjackPayoutRatio // Multiplier for blackjack win

  // Game Options
  minBet: number
  maxBet: number

  // Strategic Info
  houseEdgePercent: number // Calculated based on deck count and rules (0.16% - 0.66%)
}

// ┌─────────────────────────────────────────────────────────┐
// │ GAME STATE TYPES                                         │
// └─────────────────────────────────────────────────────────┘

export type GamePhase = 'betting' | 'dealing' | 'playing' | 'settling' | 'completed'
export type GameAction = 'hit' | 'stand' | 'double' | 'split' | 'surrender' | 'insurance'

// ┌─────────────────────────────────────────────────────────┐
// │ UNDO/REDO TYPES                                         │
// └─────────────────────────────────────────────────────────┘

export interface GameStateSnapshot {
  gameState: GameState
  timestamp: Date
  action?: GameAction // The action that led to this state (for redo)
}

export interface UndoRedoState {
  past: GameStateSnapshot[] // Previous states (for undo)
  present: GameState // Current state
  future: GameStateSnapshot[] // Future states (for redo)
  canUndo: boolean
  canRedo: boolean
}

export interface GameState {
  id: string
  phase: GamePhase

  // Participants
  players: Player[]
  dealer: Dealer

  // Deck Management
  deck: Card[]
  discardPile: Card[] // Cards played in current and previous rounds
  decksRemaining: number // For showing penetration

  // Configuration
  rules: GameRules

  // Metadata
  timestamp: Date
  history: GameAction[] // Log of all actions taken
}

// ┌─────────────────────────────────────────────────────────┐
// │ SETTLEMENT & RESULT TYPES                               │
// └─────────────────────────────────────────────────────────┘

export interface SettlementOutcome {
  hand: Hand
  result: SettlementResult
  finalValue: number // Player's final hand value
  dealerValue: number // Dealer's final hand value
  payout: number // Amount won (can be negative for loss)
  isDealerBust: boolean
  isBlackjack: boolean
}

export interface GameResult {
  gameId: string
  players: Player[]
  dealer: Dealer
  outcomes: SettlementOutcome[]
  totalPayout: number
  timestamp: Date
}

// ┌─────────────────────────────────────────────────────────┐
// │ AI & STRATEGY TYPES                                      │
// └─────────────────────────────────────────────────────────┘

export type Difficulty = 'easy' | 'basic' | 'hard' | 'card-counter'

export interface MoveRecommendation {
  action: GameAction
  confidence: number // 0-1 confidence in recommendation
  reasoning: string
}

// ┌─────────────────────────────────────────────────────────┐
// │ BETTING STRATEGY TYPES                                  │
// └─────────────────────────────────────────────────────────┘

export type StrategyMode = 'none' | 'basic' | 'card-counting' | 'learning'

export interface BasicStrategyRecommendation {
  recommendedAction: GameAction
  isCorrect: boolean // Whether player's current action matches basic strategy
  explanation: string
  expectedValue?: number // Expected value of recommended action
}

export interface CardCountingState {
  runningCount: number // Hi-Lo running count
  trueCount: number // Running count divided by decks remaining
  decksRemaining: number
  advantage: number // Player advantage percentage (-5% to +5%)
  betMultiplier: number // Suggested bet multiplier (1-10x)
}

export interface StrategyHint {
  type: 'action' | 'betting' | 'counting'
  message: string
  priority: 'low' | 'medium' | 'high'
  showInLearningMode: boolean
}

export interface StrategyState {
  mode: StrategyMode
  basicStrategyEnabled: boolean
  cardCountingEnabled: boolean
  learningModeEnabled: boolean
  countingState: CardCountingState
  currentHint?: StrategyHint
  sessionStats: {
    correctDecisions: number
    totalDecisions: number
    accuracyRate: number
  }
}

export interface HandHistory {
  gameId: string
  handsPlayed: number
  handsWon: number
  handsLost: number
  handsPushed: number
  blackjackCount: number
  totalAmountWon: number
  totalAmountLost: number
  timestamp: Date
  amounts: {
    bet: number
    payout: number
  }
  outcomes: string[]
}

export interface PlayerStatistics {
  totalGamesPlayed: number
  totalHandsPlayed: number
  winRate: number // 0-1
  blackjackRate: number // 0-1 (blackjacks per 100 hands)
  averageBet: number
  totalWinnings: number
  bestStreak: number // consecutive wins
  worstStreak: number // consecutive losses
  gamesPlayed: number
  wins: number
  blackjacks: number
  currentStreak: number
}
