import type { Board, Difficulty, Token } from '@/domain'
import { chooseCpuMoveMedium, chooseCpuMoveRandom } from '@/domain'

interface AiResult {
  index: number
  engine: 'wasm' | 'js'
  confidence?: number
}

let wasmReady = false
let wasmLoadError: Error | null = null

/**
 * Ensure WASM module is loaded and ready.
 * Falls back gracefully if WASM is unavailable.
 */
export const ensureWasmReady = async (): Promise<void> => {
  if (wasmReady) {
    return
  }

  if (wasmLoadError) {
    throw wasmLoadError
  }

  // For TicTacToe, WASM isn't critical—JS fallback is always available
  try {
    // Future: load WASM module here
    wasmReady = false
  } catch (error) {
    wasmLoadError = error instanceof Error ? error : new Error(String(error))
    // Don't throw — allow JS fallback
  }
}

/**
 * Compute AI move synchronously (main thread).
 * Uses WASM if available, falls back to JS implementation.
 */
export const computeAiMove = (
  board: Board,
  difficulty: Difficulty,
  cpuToken: Token,
  humanToken: Token,
): AiResult => {
  let index: number

  switch (difficulty) {
    case 'easy':
      index = chooseCpuMoveRandom(board)
      break
    case 'medium':
      index = chooseCpuMoveMedium(board, cpuToken, humanToken)
      break
    case 'hard':
    default:
      // Hard mode currently uses medium strategy
      // In production, this would use WASM-based minimax
      index = chooseCpuMoveMedium(board, cpuToken, humanToken)
      break
  }

  return {
    index,
    engine: wasmReady ? 'wasm' : 'js',
  }
}

/**
 * Compute AI move asynchronously (Web Worker).
 * Can be used for more complex decision logic or to offload from main thread.
 */
export const computeAiMoveAsync = async (
  board: Board,
  difficulty: Difficulty,
  cpuToken: Token,
  humanToken: Token,
): Promise<AiResult> => {
  // For TicTacToe, sync computation is fast enough
  // This is available for future expansion or testing
  return computeAiMove(board, difficulty, cpuToken, humanToken)
}
