/**
 * @games/ai-framework
 *
 * Generic minimax + alpha-beta pruning framework for turn-based strategic games.
 *
 * Provides a shared AI engine that games can use by implementing the GameAI interface.
 * Handles the complex minimax search while games focus on domain logic.
 *
 * @example
 * // 1. Implement GameAI interface for your game
 * class CheckersAI implements GameAI<Board, Move, Player> {
 *   evaluateBoard(board, player) { ... }
 *   getLegalMoves(board, player) { ... }
 *   applyMove(board, move) { ... }
 *   getWinner(board) { ... }
 *   getOpponent(player) { ... }
 * }
 *
 * // 2. Use minimax to find best move
 * const game = new CheckersAI()
 * const result = minimax(board, 'red', 4, game)
 * console.log(result.move)
 */

export { minimax } from './minimax'
export type {
  Difficulty,
  DifficultyConfig,
  GameAI,
  MinimaxOptions,
  MinimaxResult,
  MinimaxStats,
  AIError,
  Result,
  RecoveryStrategy,
  SafeAIResult,
} from './types'

/**
 * Standard difficulty->depth mapping for various game complexities
 */
export const DIFFICULTY_DEPTHS: Record<string, { easy: number; medium: number; hard: number }> = {
  // Simple games (like tic-tac-toe)
  simple: { easy: 2, medium: 3, hard: 4 },

  // Medium games (like connect-four on 7x6 board)
  medium: { easy: 3, medium: 4, hard: 6 },

  // Complex games (like checkers, chess-like games)
  complex: { easy: 2, medium: 4, hard: 6 },

  // Very complex games (large branching factor)
  veryComplex: { easy: 2, medium: 3, hard: 4 },
}

/**
 * Get recommended search depth for a difficulty level
 *
 * @param difficulty The difficulty level
 * @param complexity Which complexity tier ('simple' | 'medium' | 'complex' | 'veryComplex')
 * @returns Number of plies to search
 *
 * @example
 * const depth = getDepthForDifficulty('hard', 'complex')  // Returns 6
 */
export function getDepthForDifficulty(
  difficulty: 'easy' | 'medium' | 'hard',
  complexity: keyof typeof DIFFICULTY_DEPTHS = 'complex',
): number {
  const config = DIFFICULTY_DEPTHS[complexity]
  if (!config) {
    throw new Error(`Unknown complexity: ${complexity}`)
  }
  return config[difficulty]
}

/**
 * Utility to select from top-N moves for easy difficulty
 * Returns a suboptimal but reasonable move for the easy AI
 *
 * @param moves All moves evaluated with scores
 * @param topN How many top moves to select from (default: 3)
 * @returns Random move from top N candidates
 */
export function selectFromTopN<Move>(
  moves: Array<{ move: Move; score: number }>,
  topN: number = 3,
): Move {
  const sorted = [...moves].sort((a, b) => b.score - a.score)
  const candidates = sorted.slice(0, Math.min(topN, sorted.length))
  const selected = candidates[Math.floor(Math.random() * candidates.length)]
  return selected.move
}
