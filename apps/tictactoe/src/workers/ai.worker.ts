import {
  chooseCpuMoveMedium,
  chooseCpuMoveRandom,
  chooseCpuMoveSmart,
  getEmptyCells,
  getWinnerToken,
} from '@/domain'
import type { Board, CellValue, Token, WorkerMessage, WorkerResponse } from '@/domain'
import { AI_WASM_BASE64 } from '../wasm/ai-wasm.ts'

// ============================================================================
// WASM AI Engine — loaded on startup, falls back to JS on failure
// ============================================================================

/** Signature shared by findSmartMove and findBestMove (11 i32 params) */
type WasmMoveFn11 = (
  c0: number,
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number,
  c8: number,
  cpuToken: number,
  humanToken: number,
) => number

/** findRandomMove: 9 cells + 1 rand = 10 params */
type WasmMoveFn10 = (
  c0: number,
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number,
  c8: number,
  rand: number,
) => number

/** findMediumMove: 9 cells + cpuToken + humanToken + rand = 12 params */
type WasmMoveFn12 = (
  c0: number,
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
  c6: number,
  c7: number,
  c8: number,
  cpuToken: number,
  humanToken: number,
  rand: number,
) => number

let wasmFindRandomMove: WasmMoveFn10 | null = null
let wasmFindMediumMove: WasmMoveFn12 | null = null
let wasmFindSmartMove: WasmMoveFn11 | null = null
let wasmFindBestMove: WasmMoveFn11 | null = null

/** Decode base64 WASM binary and instantiate the module */
async function initWasm(): Promise<void> {
  try {
    const binary = atob(AI_WASM_BASE64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    const imports = { env: { abort: () => {} } }
    const { instance } = await WebAssembly.instantiate(bytes, imports)
    wasmFindRandomMove = instance.exports.findRandomMove as WasmMoveFn10
    wasmFindMediumMove = instance.exports.findMediumMove as WasmMoveFn12
    wasmFindSmartMove = instance.exports.findSmartMove as WasmMoveFn11
    wasmFindBestMove = instance.exports.findBestMove as WasmMoveFn11
  } catch {
    // WASM unavailable — JS fallback will be used silently
  }
}

// Await WASM readiness before processing any message
const wasmReady = initWasm()

// ============================================================================
// PHASE C: Minimax AI with Alpha-Beta Pruning (Unbeatable)
// ============================================================================

/**
 * Evaluate board score from CPU's perspective
 */
const evaluateBoard = (board: Board, cpuToken: Token, humanToken: Token): number | null => {
  const winner = getWinnerToken(board)

  if (winner === cpuToken) {
    return 10 // CPU won
  }
  if (winner === humanToken) {
    return -10 // Human won
  }

  // Check if board is full (draw)
  const empty = getEmptyCells(board)
  if (empty.length === 0) {
    return 0 // Draw
  }

  return null // Game still ongoing
}

/**
 * Minimax algorithm with alpha-beta pruning
 */
const minimax = (
  board: Board,
  depth: number,
  initialAlpha: number,
  initialBeta: number,
  isMaximizing: boolean,
  cpuToken: Token,
  humanToken: Token,
): number => {
  // Terminal node: evaluate board
  const score = evaluateBoard(board, cpuToken, humanToken)
  if (score !== null) {
    // Prefer winning sooner, losing later (depth factor for move ordering)
    return isMaximizing ? score + depth : score - depth
  }

  let alpha = initialAlpha
  let beta = initialBeta
  const empty = getEmptyCells(board)

  // Maximizing: CPU's turn (trying to maximize score)
  if (isMaximizing) {
    let maxScore = -Infinity
    for (const idx of empty) {
      const newBoard: Board = [...board]
      newBoard[idx] = cpuToken
      const moveScore = minimax(newBoard, depth + 1, alpha, beta, false, cpuToken, humanToken)
      maxScore = Math.max(maxScore, moveScore)
      alpha = Math.max(alpha, moveScore)
      if (beta <= alpha) {
        break
      } // Beta cutoff (prune branch)
    }
    return maxScore
  }

  // Minimizing: Human's turn (trying to minimize score)
  let minScore = Infinity
  for (const idx of empty) {
    const newBoard: Board = [...board]
    newBoard[idx] = humanToken
    const moveScore = minimax(newBoard, depth + 1, alpha, beta, true, cpuToken, humanToken)
    minScore = Math.min(minScore, moveScore)
    beta = Math.min(beta, moveScore)
    if (beta <= alpha) {
      break
    } // Alpha cutoff (prune branch)
  }
  return minScore
}

/**
 * Unbeatable: Choose optimal move using minimax with alpha-beta pruning
 */
const chooseCpuMoveUnbeatable = (board: Board, cpuToken: Token, humanToken: Token): number => {
  const empty = getEmptyCells(board)
  if (empty.length === 0) {
    throw new Error('No empty cells available')
  }

  // Move ordering: prioritize center and corners for faster pruning
  const prioritized = [4, 0, 2, 6, 8, 1, 3, 5, 7].filter((idx) => empty.includes(idx))

  let bestMove = prioritized[0]
  let bestScore = -Infinity

  // Evaluate each candidate move using minimax
  for (const idx of prioritized) {
    const newBoard: Board = [...board]
    newBoard[idx] = cpuToken
    const score = minimax(newBoard, 0, -Infinity, Infinity, false, cpuToken, humanToken)

    if (score > bestScore) {
      bestScore = score
      bestMove = idx
    }
  }

  if (bestMove === undefined) {
    throw new Error('No valid move found')
  }
  return bestMove
}

declare const self: Worker

// ============================================================================
// WASM-accelerated AI (all difficulty levels)
// ============================================================================

/** Convert board token to numeric value for WASM: null→0, 'X'→1, 'O'→2 */
const cellToNum = (cell: CellValue): number => {
  if (cell === 'X') {
    return 1
  }
  if (cell === 'O') {
    return 2
  }
  return 0
}

/** Convert token character to numeric value for WASM */
const tokenToNum = (token: Token): number => (token === 'X' ? 1 : 2)

/** Spread board cells as 9 numeric arguments */
const boardNums = (
  board: Board,
): [number, number, number, number, number, number, number, number, number] => [
  cellToNum(board[0] ?? null),
  cellToNum(board[1] ?? null),
  cellToNum(board[2] ?? null),
  cellToNum(board[3] ?? null),
  cellToNum(board[4] ?? null),
  cellToNum(board[5] ?? null),
  cellToNum(board[6] ?? null),
  cellToNum(board[7] ?? null),
  cellToNum(board[8] ?? null),
]

/**
 * Main worker message handler
 * Receives: { board, difficulty, cpuToken, humanToken }
 * Sends back: { index, engine } or { error }
 */
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  await wasmReady
  try {
    const { board, difficulty, cpuToken, humanToken } = event.data

    let index: number
    let engine: 'wasm' | 'js' = 'js'
    const cells = boardNums(board)

    if (difficulty === 'easy') {
      if (wasmFindRandomMove) {
        const rand = (Math.random() * 9) | 0
        index = wasmFindRandomMove(...cells, rand)
        engine = 'wasm'
      } else {
        index = chooseCpuMoveRandom(board)
      }
    } else if (difficulty === 'medium') {
      if (wasmFindMediumMove) {
        const rand = (Math.random() * 9) | 0
        index = wasmFindMediumMove(...cells, tokenToNum(cpuToken), tokenToNum(humanToken), rand)
        engine = 'wasm'
      } else {
        index = chooseCpuMoveMedium(board, cpuToken, humanToken)
      }
    } else if (difficulty === 'hard') {
      if (wasmFindSmartMove) {
        index = wasmFindSmartMove(...cells, tokenToNum(cpuToken), tokenToNum(humanToken))
        engine = 'wasm'
      } else {
        index = chooseCpuMoveSmart(board, cpuToken, humanToken)
      }
    } else if (wasmFindBestMove) {
      // unbeatable — WASM
      index = wasmFindBestMove(...cells, tokenToNum(cpuToken), tokenToNum(humanToken))
      engine = 'wasm'
    } else {
      // unbeatable — JS fallback
      index = chooseCpuMoveUnbeatable(board, cpuToken, humanToken)
    }

    self.postMessage({ index, engine } as WorkerResponse)
  } catch (error) {
    self.postMessage({ error: (error as Error).message } as WorkerResponse)
  }
}
