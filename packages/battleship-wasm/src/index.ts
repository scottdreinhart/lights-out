/**
 * Battleship Web Worker Package
 *
 * Provides async move calculation coordination via Web Worker.
 * The actual move calculation happens in the main thread (with fallback)
 * or can be upgraded to WASM implementation in the future.
 */

export type {
  BattleshipWorkerMessage,
  BattleshipWorkerResponse,
  Board,
  Cell,
  CellOwner,
  CellStatus,
  Coord,
  Difficulty,
  PendingMoveRequest,
} from './types'

/**
 * Create and return a new Battleship Web Worker instance
 *
 * Usage:
 * ```ts
 * const worker = createBattleshipWorker()
 * worker.postMessage({ type: 'getMove', board, difficulty, requestId })
 * ```
 */
export function createBattleshipWorker(): Worker {
  // In Vite, we can import the worker module
  // The worker file is at ./battleship.worker.ts
  return new Worker(new URL('./battleship.worker.ts', import.meta.url), { type: 'module' })
}
