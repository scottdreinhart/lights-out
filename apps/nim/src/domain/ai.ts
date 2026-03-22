import type { Difficulty, GameMode, GameState, Move as AIMove } from './types'

const getCounts = (state: GameState): number[] => state.piles.map((pile) => pile.count)

const getLegalMoves = (counts: number[]): AIMove[] => {
  const moves: AIMove[] = []
  for (let pileId = 0; pileId < counts.length; pileId += 1) {
    const count = counts[pileId]
    for (let removeCount = 1; removeCount <= count; removeCount += 1) {
      moves.push({ pileId, removeCount })
    }
  }
  return moves
}

const applyMoveToCounts = (counts: number[], move: AIMove): number[] => {
  const next = [...counts]
  next[move.pileId] -= move.removeCount
  return next
}

const isTerminal = (counts: number[]): boolean => counts.every((count) => count === 0)

const makeMemoKey = (counts: number[], mode: GameMode): string => `${mode}:${counts.join(',')}`

/**
 * Returns whether the current position is winning for the player to move.
 *
 * Normal play terminal condition:
 * - No legal move => loss for player to move.
 *
 * Misère terminal condition:
 * - No legal move => win for player to move (opponent took last and loses).
 */
const isWinningPosition = (counts: number[], mode: GameMode, memo: Map<string, boolean>): boolean => {
  if (isTerminal(counts)) {
    return mode === 'misere'
  }

  const key = makeMemoKey(counts, mode)
  const cached = memo.get(key)
  if (cached !== undefined) {
    return cached
  }

  const legalMoves = getLegalMoves(counts)
  for (const move of legalMoves) {
    const nextCounts = applyMoveToCounts(counts, move)
    const opponentWinning = isWinningPosition(nextCounts, mode, memo)
    if (!opponentWinning) {
      memo.set(key, true)
      return true
    }
  }

  memo.set(key, false)
  return false
}

const getWinningMoves = (state: GameState): AIMove[] => {
  const counts = getCounts(state)
  const memo = new Map<string, boolean>()
  const legalMoves = getLegalMoves(counts)

  return legalMoves.filter((move) => {
    const nextCounts = applyMoveToCounts(counts, move)
    return !isWinningPosition(nextCounts, state.mode, memo)
  })
}

const getRandomMove = (state: GameState): AIMove => {
  const legalMoves = getLegalMoves(getCounts(state))
  if (legalMoves.length === 0) {
    return { pileId: 0, removeCount: 0 }
  }
  return legalMoves[Math.floor(Math.random() * legalMoves.length)]
}

/**
 * Easy AI — random legal move.
 */
const selectMoveEasy = (state: GameState): AIMove => {
  return getRandomMove(state)
}

/**
 * Medium AI — prefers winning moves, but intentionally allows imperfection.
 * - 60%: choose a winning move if available.
 * - 40%: random legal move.
 */
const selectMoveMedium = (state: GameState): AIMove => {
  const winningMoves = getWinningMoves(state)
  if (winningMoves.length > 0 && Math.random() < 0.6) {
    return winningMoves[Math.floor(Math.random() * winningMoves.length)]
  }
  return getRandomMove(state)
}

/**
 * Hard AI — always chooses a winning move when one exists.
 * Fully mode-aware (normal + misère) via game-state solving.
 */
const selectMoveHard = (state: GameState): AIMove => {
  const winningMoves = getWinningMoves(state)
  if (winningMoves.length > 0) {
    return winningMoves[0]
  }

  // No forced win exists from this position; return legal fallback.
  return getRandomMove(state)
}

/**
 * Selects a move based on difficulty level.
 */
export const selectMove = (state: GameState, difficulty: Difficulty = 'hard'): AIMove => {
  switch (difficulty) {
    case 'easy':
      return selectMoveEasy(state)
    case 'medium':
      return selectMoveMedium(state)
    case 'hard':
      return selectMoveHard(state)
  }
}
