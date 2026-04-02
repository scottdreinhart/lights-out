/**
 * AI Framework Types
 *
 * Defines the standard interface that games must implement to use the minimax solver.
 * This allows games with different board representations and move types to share
 * a common AI engine implementation.
 */

/**
 * Difficulty levels for AI decision-making
 */
export type Difficulty = 'easy' | 'medium' | 'hard'

/**
 * Configuration for minimax depth by difficulty level
 */
export interface DifficultyConfig {
  easy: number
  medium: number
  hard: number
}

/**
 * Standard interface that games must implement to integrate with the minimax framework.
 *
 * Each game provides implementations specific to its board and move representations,
 * while the framework handles the minimax algorithm and move selection.
 */
export interface GameAI<Board = unknown, Move = unknown, Player = unknown> {
  /**
   * Evaluate a board position for the given player.
   *
   * Return a numeric score where:
   * - Positive values favor the player
   * - Negative values favor the opponent
   * - Larger magnitude = stronger position
   *
   * Example scores:
   * - Terminal win: +100,000 or higher
   * - Terminal loss: -100,000 or lower
   * - Neutral positions: 0 to ±1,000
   *
   * @param board The current board state
   * @param player The player perspective for evaluation
   * @returns Numeric score (higher is better for the player)
   */
  evaluateBoard(board: Board, player: Player): number

  /**
   * Get all legal moves available for a player in the given position.
   *
   * @param board The current board state
   * @param player The player to get moves for
   * @returns Array of legal moves (empty if no moves available)
   */
  getLegalMoves(board: Board, player: Player): Move[]

  /**
   * Apply a move to the board and return the resulting board state.
   *
   * This should not mutate the input board; return a new board state.
   *
   * @param board The current board state
   * @param move The move to apply
   * @returns The resulting board state after the move
   */
  applyMove(board: Board, move: Move): Board

  /**
   * Determine if the game is over and who won.
   *
   * @param board The current board state
   * @returns The winning player, null if no winner yet, or string 'draw' if drawn
   */
  getWinner(board: Board): Player | null | 'draw'

  /**
   * Get the opponent for the given player.
   *
   * @param player The current player
   * @returns The opponent
   */
  getOpponent(player: Player): Player
}

/**
 * Options for customizing minimax behavior
 */
export interface MinimaxOptions {
  /**
   * Enable alpha-beta pruning (default: true)
   * Disabling is useful for testing or simple evaluation
   */
  alphaBetaPruning?: boolean

  /**
   * Enable move ordering optimization (default: true)
   * Requires game to provide moveOrder function
   */
  moveOrdering?: boolean

  /**
   * Optional move ordering function
   * Scores moves for better pruning efficiency
   * Higher scores are evaluated first
   */
  moveOrder?: (move: unknown, board: unknown) => number

  /**
   * Enable memoization of evaluated positions (default: false)
   * Useful for games with many repeated positions
   * Requires game to provide memoKey function
   */
  memoization?: boolean

  /**
   * Optional memoization key generator
   */
  memoKey?: (board: unknown) => string

  /**
   * Maximum nodes to evaluate before timing out (default: infinite)
   * Useful for realtime games with time constraints
   */
  maxNodes?: number
}

/**
 * Result of a minimax evaluation
 */
export interface MinimaxResult {
  move: unknown
  score: number
  depth: number
  nodesEvaluated: number
}

/**
 * Statistics from a minimax search
 */
export interface MinimaxStats {
  nodesEvaluated: number
  prunesCut: number
  memoHits: number
  timeMs: number
}
