/**
 * AI Web Worker — off-main-thread computation for CPU moves.
 * Keeps UI at 60 FPS during AI calculations.
 *
 * Strategy: WASM-first, JS fallback.
 *   1. Try to instantiate the WASM AI engine from base64.
 *   2. If WASM is unavailable or fails, fall back to pure-JS AI.
 */

import {
  bitmaskToTiles,
  boardToBitmask,
  createBoard,
  getBestMove as getBestMoveJS,
  getValidMoves,
} from '@/domain'
import type { Tile } from '@/domain'
import { AI_WASM_BASE64 } from '@/wasm/ai-wasm'

// ── WASM instance (nullable — set once on first use) ──────────────────────
interface WasmExports {
  getValidMovesCount(board: number, sum: number): number
  getValidMove(board: number, sum: number, idx: number): number
  calculateScore(board: number): number
  canRollOneDie(board: number): number
  getBestMove(board: number, sum: number): number
}

let wasm: WasmExports | null = null
let wasmReady = false
let wasmFailed = false

async function initWasm(): Promise<void> {
  if (wasmReady || wasmFailed) {
    return
  }
  if (!AI_WASM_BASE64) {
    wasmFailed = true
    return
  }
  try {
    const binary = Uint8Array.from(atob(AI_WASM_BASE64), (c) => c.charCodeAt(0))
    const { instance } = await WebAssembly.instantiate(binary, {
      env: { abort: () => {} },
    })
    wasm = instance.exports as unknown as WasmExports
    wasmReady = true
  } catch {
    wasmFailed = true
  }
}

// ── Message types ─────────────────────────────────────────────────────────
interface WorkerRequest {
  type: 'GET_BEST_MOVE' | 'GET_VALID_MOVES'
  /** Record<Tile, boolean> encoded tiles */
  tiles: Record<number, boolean>
  diceSum: number
  requestId: number
}

interface WorkerResponse {
  type: 'BEST_MOVE' | 'VALID_MOVES'
  /** Tiles of chosen move (or null if no move) */
  move: number[] | null
  /** All valid moves (for GET_VALID_MOVES) */
  moves?: number[][]
  requestId: number
  engine: 'wasm' | 'js'
}

// ── Reconstruct a BoardState from the tiles record ────────────────────────
function buildBoard(tiles: Record<number, boolean>, diceSum: number) {
  const board = createBoard()
  for (let i = 1; i <= 9; i++) {
    board.tiles[i as Tile] = !!tiles[i]
  }
  board.diceSum = diceSum
  return board
}

// ── Worker message handler ────────────────────────────────────────────────
self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  await initWasm()

  const { type, tiles, diceSum, requestId } = e.data
  const board = buildBoard(tiles, diceSum)

  if (type === 'GET_BEST_MOVE') {
    const bestMoveResult = (() => {
      if (wasmReady && wasm) {
        const mask = boardToBitmask(board)
        const resultMask = wasm.getBestMove(mask, diceSum)
        return {
          move: resultMask ? bitmaskToTiles(resultMask) : null,
          engine: 'wasm' as const,
        }
      }
      return { move: getBestMoveJS(board, diceSum), engine: 'js' as const }
    })()

    const response: WorkerResponse = {
      type: 'BEST_MOVE',
      move: bestMoveResult.move ? (bestMoveResult.move as number[]) : null,
      requestId,
      engine: bestMoveResult.engine,
    }
    self.postMessage(response)
  } else if (type === 'GET_VALID_MOVES') {
    const validMovesResult = (() => {
      if (wasmReady && wasm) {
        const mask = boardToBitmask(board)
        const count = wasm.getValidMovesCount(mask, diceSum)
        const wasmMoves: Tile[][] = []
        for (let i = 0; i < count; i++) {
          const moveMask = wasm.getValidMove(mask, diceSum, i)
          wasmMoves.push(bitmaskToTiles(moveMask))
        }
        return { moves: wasmMoves, engine: 'wasm' as const }
      }
      return { moves: getValidMoves(board, diceSum), engine: 'js' as const }
    })()

    const response: WorkerResponse = {
      type: 'VALID_MOVES',
      move: null,
      moves: validMovesResult.moves as number[][],
      requestId,
      engine: validMovesResult.engine,
    }
    self.postMessage(response)
  }
}

export {}
