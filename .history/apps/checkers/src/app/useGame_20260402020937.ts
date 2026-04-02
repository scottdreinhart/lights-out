/**
 * Checkers game debugging utilities and logging.
 * Development-only helpers for understanding game state.
 *
 * Usage (in component):
 *   useGameDebug(board, currentPlayer, legalMoves, thinking)
 *
 * Logs to console in development mode only.
 */

import type { Board, Move, Player } from '@/domain'

export interface GameDebugInfo {
  board: Board
  currentPlayer: Player
  legalMoves: readonly Move[]
  thinking: boolean
  selectedRow?: number
  selectedCol?: number
}

/**
 * Log game state for debugging (dev mode only)
 */
export const useGameDebug = (info: GameDebugInfo): void => {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  if (!info.board || !info.currentPlayer) {
    return
  }

  const log = {
    timestamp: new Date().toISOString(),
    player: info.currentPlayer,
    thinking: info.thinking,
    legalMoves: info.legalMoves.length,
    selected: info.selectedRow !== undefined ? `[${info.selectedRow}, ${info.selectedCol}]` : 'none',
  }

  // Only log on significant state changes
  if (typeof window !== 'undefined' && (window as any).__checksGameDebugLog !== JSON.stringify(log)) {
    console.debug('[Checkers Game State]', log)
    ;(window as any).__checksGameDebugLog = JSON.stringify(log)
  }
}

/**
 * Get debugging info for the board state (text representation)
 */
export const debugBoardString = (board: Board): string => {
  return board
    .map((row, r) =>
      row
        .map((piece, c) => {
          if (!piece) return '.'
          const base = piece.player === 'red' ? 'r' : 'b'
          return piece.isKing ? base.toUpperCase() : base
        })
        .join(' '),
    )
    .join('\n')
}

/**
 * Enable verbose logging for game events (dev mode only)
 * Call this once at app startup if you want detailed logs
 */
export const enableGameVerboseLogging = (): void => {
  if (process.env.NODE_ENV === 'development') {
    ;(window as any).__checksVerboseLogging = true
    console.debug('[Checkers] Verbose logging enabled. Game events will be logged to console.')
  }
}

/**
 * Log a game event with context
 */
export const logGameEvent = (
  event: string,
  data?: Record<string, unknown>,
): void => {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  if (!((window as any).__checksVerboseLogging)) {
    return
  }

  console.debug(`[Checkers Event: ${event}]`, data || '')
}

    setOpponent,
    updateSetup,
    setup,
  }
}
