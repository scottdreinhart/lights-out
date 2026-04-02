/**
 * Farkle domain types
 * A dice game of risk and reward with hold/bank mechanics
 */

import type { DieValue } from '@games/common'

export type Player = 'human' | 'cpu'
export type GamePhase = 'setup' | 'rolling' | 'selecting' | 'banking' | 'gameover'

export interface ScoreBreakdown {
  ones: number
  fives: number
  threeOfAKind: number
  fourOfAKind: number
  fiveOfAKind: number
  sixOfAKind: number
  fullHouse: number
  straight: number
  total: number
}

export interface Pile {
  id: number
  count: number
}

export interface Move {
  pileId: number
  removeCount: number
}

export interface DiceState {
  allDice: DieValue[]
  selectedIndices: Set<number>
  heldDice: DieValue[]
  remainingDice: DieValue[]
  isRolling: boolean
}

export interface BankingState {
  bankedScore: number
  atRiskScore: number
  roundScore: number
}

export interface GameState {
  phase: GamePhase
  currentPlayer: Player
  dice: DiceState
  banking: BankingState
  humanTotal: number
  cpuTotal: number
  roundHistory: Array<{
    player: Player
    banked: number
    lost: boolean
  }>
  winner: Player | null
  isGameOver: boolean
}

export interface GameSetup {
  name: string
  initialCounts: number[]
}

export interface GameStats {
  wins: number
  losses: number
  streak: number
  bestStreak: number
}
