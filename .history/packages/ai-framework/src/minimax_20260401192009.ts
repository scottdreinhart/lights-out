/**
 * Minimax Algorithm Implementation
 *
 * Implements the minimax algorithm with optional alpha-beta pruning
 * for turn-based strategic games.
 *
 * Algorithm:
 * - Recursively explores game tree to specified depth
 * - Maximizes score for the AI player, minimizes for opponent
 * - Alpha-beta pruning eliminates branches that cannot affect final decision
 * - Move ordering improves pruning effectiveness
 *
 * Complexity:
 * - Time: O(b^d) without pruning, O(b^(d/2)) with optimal pruning (best case)
 * - Space: O(d) for recursion stack
 */

import type { GameAI, MinimaxOptions, MinimaxResult, MinimaxStats } from './types'

/**
 * Internal state for minimax search
 */
interface SearchState {
  nodesEvaluated: number
  prunesCut: number
  memoHits: number
  memo?: Map<string, number>
}

/**
 * Execute minimax algorithm to find the best move
 *
 * @param board The current board state
 * @param player The player to find best move for
 * @param depth How deep to search the game tree
 * @param game The GameAI implementation for this game
 * @param options Optional configuration (alpha-beta, move ordering, etc.)
 * @returns The best move and its evaluation score
 *
 * @example
 * const checkers = new CheckersAI()
 * const board = checkers.initialBoard()
 * const result = minimax(board, 'red', 4, checkers)
 * console.log(`Best move: ${result.move}, Score: ${result.score}`)
 */
export function minimax<Board, Move, Player>(
  board: Board,
  player: Player,
  depth: number,
  game: GameAI<Board, Move, Player>,
  options: MinimaxOptions = {},
): MinimaxResult {
  if (depth <= 0) {
    throw new Error('Minimax depth must be > 0')
  }

  const startTime = performance.now()
  const state: SearchState = {
    nodesEvaluated: 0,
    prunesCut: 0,
    memoHits: 0,
  }

  if (options.memoization) {
    state.memo = new Map()
  }

  const alphaBetaPruning = options.alphaBetaPruning !== false
  const moveOrdering = options.moveOrdering !== false

  // Find best move from root position
  let bestMove: Move | null = null
  let bestScore = Number.NEGATIVE_INFINITY
  const moves = game.getLegalMoves(board, player)

  if (moves.length === 0) {
    throw new Error('No legal moves available for minimax search')
  }

  const orderedMoves = moveOrdering && options.moveOrder
    ? [...moves].sort((a, b) => (options.moveOrder!(b, board) ?? 0) - (options.moveOrder!(a, board) ?? 0))
    : moves

  for (const move of orderedMoves) {
    const nextBoard = game.applyMove(board, move)
    const opponent = game.getOpponent(player)
    const score = minimaxSearch(
      nextBoard,
      opponent,
      player,
      depth - 1,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      false, // opponent's turn, so minimizing
      game,
      state,
      alphaBetaPruning,
      moveOrdering,
      options,
    )

    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  const endTime = performance.now()

  if (!bestMove) {
    throw new Error('Failed to find best move')
  }

  return {
    move: bestMove,
    score: bestScore,
    depth,
    nodesEvaluated: state.nodesEvaluated,
  }
}

/**
 * Internal recursive minimax search with alpha-beta pruning
 */
function minimaxSearch<Board, Move, Player>(
  board: Board,
  currentPlayer: Player,
  perspectivePlayer: Player,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  game: GameAI<Board, Move, Player>,
  state: SearchState,
  alphaBetaPruning: boolean,
  moveOrdering: boolean,
  options: MinimaxOptions,
): number {
  state.nodesEvaluated++

  // Check max nodes limit
  if (options.maxNodes && state.nodesEvaluated > options.maxNodes) {
    return game.evaluateBoard(board, perspectivePlayer)
  }

  // Terminal state: game is over
  const winner = game.getWinner(board)
  if (winner === perspectivePlayer) {
    return 100_000 + depth // Prefer winning earlier
  }
  if (winner && winner !== perspectivePlayer && winner !== 'draw') {
    return -100_000 - depth // Prefer losing later
  }
  if (winner === 'draw') {
    return 0
  }

  // Depth limit reached: evaluate position
  if (depth === 0) {
    return game.evaluateBoard(board, perspectivePlayer)
  }

  // Check memoization cache
  if (state.memo && options.memoKey) {
    const key = options.memoKey(board)
    const cached = state.memo.get(key)
    if (cached !== undefined) {
      state.memoHits++
      return cached
    }
  }

  // Get legal moves
  const moves = game.getLegalMoves(board, currentPlayer)

  // No legal moves available
  if (moves.length === 0) {
    // Stalemate or no valid moves
    if (currentPlayer === perspectivePlayer) {
      return -100_000 - depth // AI player in zugzwang
    } else {
      return 100_000 + depth // Opponent in zugzwang
    }
  }

  // Sort moves if move ordering enabled
  const orderedMoves = moveOrdering && options.moveOrder
    ? [...moves].sort((a, b) => (options.moveOrder!(b, board) ?? 0) - (options.moveOrder!(a, board) ?? 0))
    : moves

  let bestScore: number

  if (isMaximizing) {
    // Maximizing player's turn (AI perspective)
    bestScore = Number.NEGATIVE_INFINITY

    for (const move of orderedMoves) {
      const nextBoard = game.applyMove(board, move)
      const opponent = game.getOpponent(currentPlayer)
      const score = minimaxSearch(
        nextBoard,
        opponent,
        perspectivePlayer,
        depth - 1,
        alpha,
        beta,
        false,
        game,
        state,
        alphaBetaPruning,
        moveOrdering,
        options,
      )

      bestScore = Math.max(bestScore, score)

      if (alphaBetaPruning) {
        alpha = Math.max(alpha, score)
        if (beta <= alpha) {
          state.prunesCut++
          break // Beta cutoff
        }
      }
    }
  } else {
    // Minimizing player's turn (opponent)
    bestScore = Number.POSITIVE_INFINITY

    for (const move of orderedMoves) {
      const nextBoard = game.applyMove(board, move)
      const opponent = game.getOpponent(currentPlayer)
      const score = minimaxSearch(
        nextBoard,
        opponent,
        perspectivePlayer,
        depth - 1,
        alpha,
        beta,
        true,
        game,
        state,
        alphaBetaPruning,
        moveOrdering,
        options,
      )

      bestScore = Math.min(bestScore, score)

      if (alphaBetaPruning) {
        beta = Math.min(beta, score)
        if (beta <= alpha) {
          state.prunesCut++
          break // Alpha cutoff
        }
      }
    }
  }

  // Cache result
  if (state.memo && options.memoKey) {
    const key = options.memoKey(board)
    state.memo.set(key, bestScore)
  }

  return bestScore
}
