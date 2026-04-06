/**
 * AI Web Worker — off-main-thread computation for CPU moves.
 * WASM-first with JS fallback. Keeps UI at 60 FPS.
 */

import type { Board, Coord, Difficulty } from '@/domain'
import { getCpuMove as getCpuMoveJS, GRID_SIZE } from '@/domain'

// ── Cell encoding (must match assembly/index.ts) ─────────────────────────
const CELL_MAP: Record<string, number> = {
  empty: 0,
  ship: 1,
  hit: 2,
  miss: 3,
}

// ── WASM instance ────────────────────────────────────────────────────────
interface WasmExports {
  // AI move selection
  setCell(index: number, value: number): void
  setShipData(index: number, value: number): void
  setShipDataLength(len: number): void
  seedRng(seed: number): void
  getCpuMove(): number

  // Board validation & placement
  validateShipPlacement(row: number, col: number, orientation: number, length: number): number
  placeShipOnBoard(row: number, col: number, orientation: number, length: number): number

  // Fire operations
  fireAtCell(row: number, col: number, shooter: number): number
  getCellValue(index: number): number

  // Coordinate helpers
  encodeCoord(row: number, col: number): number
  decodeCoord(index: number): number
}

let wasmExports: WasmExports | null = null

// ── AssemblyScript runtime helpers ───────────────────────────────────────
// These are required by AssemblyScript compiled code for memory management
const wasmMemory = new WebAssembly.Memory({ initial: 256, maximum: 512 })

function createWasmEnv() {
  return {
    // Memory and abort
    memory: wasmMemory,
    abort: (_messagePtr?: number, _filePtr?: number, line?: number, column?: number) => {
      console.error(`WASM abort: line ${line}:${column}`)
    },
    trace: (_args: unknown[]) => {
      // WASM trace logging (disabled to avoid console spam)
      // console.warn('[WASM]', _args)
    },

    // AssemblyScript runtime: memory allocation
    __alloc: (size: number) => {
      // Simple allocator: increment pointer
      if (!createWasmEnv.__allocPtr) {
        createWasmEnv.__allocPtr = 0
      }
      const ptr = createWasmEnv.__allocPtr
      createWasmEnv.__allocPtr += Math.ceil(size / 8) * 8
      return ptr
    },
    __retain: (_obj: number) => _obj,
    __release: (_obj: number) => {},
    __rtti_base: 0,
  }
}
createWasmEnv.__allocPtr = 0

async function initWasm(): Promise<void> {
  try {
    const { AI_WASM_BASE64 } = await import('@/wasm/ai-wasm')
    if (!AI_WASM_BASE64) {
      return
    }
    const binary = Uint8Array.from(atob(AI_WASM_BASE64), (c) => c.charCodeAt(0))
    const compiled = await WebAssembly.compile(binary)
    const instance = await WebAssembly.instantiate(compiled, { env: createWasmEnv() })
    wasmExports = instance.exports as unknown as WasmExports
  } catch (err) {
    // WASM unavailable — JS fallback will be used
    console.error('WASM init failed:', err)
  }
}

const wasmReady = initWasm()

// ── Transfer board state to WASM ─────────────────────────────────────────
function loadBoardIntoWasm(board: Board): void {
  if (!wasmExports) {
    return
  }

  // Write grid cells
  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      wasmExports.setCell(row * GRID_SIZE + col, CELL_MAP[board.grid[row][col]] ?? 0)
    }
  }

  // Write ship data: [shipCount, len0, cell0, cell1, ..., len1, ...]
  let ptr = 0
  wasmExports.setShipData(ptr++, board.ships.length)
  for (const ship of board.ships) {
    wasmExports.setShipData(ptr++, ship.cells.length)
    for (const c of ship.cells) {
      wasmExports.setShipData(ptr++, c.row * GRID_SIZE + c.col)
    }
  }
  wasmExports.setShipDataLength(ptr)

  // Seed PRNG with time-based value
  wasmExports.seedRng((Date.now() & 0x7fffffff) | 1)
}

// ── Message handler ──────────────────────────────────────────────────────
self.onmessage = async (
  e: MessageEvent<
    | { type: 'getMove'; board: Board; difficulty: Difficulty }
    | { type: 'validatePlacement'; row: number; col: number; orientation: number; length: number }
    | { type: 'fireAt'; row: number; col: number; shooter: 'player' | 'cpu' }
    | { type: 'getCellValue'; index: number }
  >,
) => {
  await wasmReady

  const message = e.data

  if (message.type === 'getMove') {
    // New format with difficulty and requestId
    const { board, difficulty, requestId } = message as unknown as {
      board: Board
      difficulty: Difficulty
      requestId: string
    }
    const startTime = performance.now()
    let move: Coord

    if (wasmExports) {
      loadBoardIntoWasm(board)
      const encoded = wasmExports.getCpuMove()
      move = { row: Math.floor(encoded / GRID_SIZE), col: encoded % GRID_SIZE }
    } else {
      move = getCpuMoveJS(board, difficulty)
    }

    const timeTaken = performance.now() - startTime
    self.postMessage({ type: 'moveReady', requestId, move, timeTaken })
  } else if ('board' in message) {
    // Legacy format: { board } → fallback for backwards compatibility
    const { board, requestId } = message as { board: Board; requestId?: string }
    const startTime = performance.now()
    let move: Coord

    if (wasmExports) {
      loadBoardIntoWasm(board)
      const encoded = wasmExports.getCpuMove()
      move = { row: Math.floor(encoded / GRID_SIZE), col: encoded % GRID_SIZE }
    } else {
      // Fallback to medium difficulty if not specified
      move = getCpuMoveJS(board, 'medium')
    }

    const timeTaken = performance.now() - startTime
    self.postMessage({ type: 'moveReady', requestId: requestId || '', move, timeTaken })
  } else {
    // New format with type
    const typedMsg = message as
      | { type: 'validatePlacement'; row: number; col: number; orientation: number; length: number }
      | { type: 'fireAt'; row: number; col: number; shooter: 'player' | 'cpu' }
      | { type: 'getCellValue'; index: number }

    switch (typedMsg.type) {
      case 'validatePlacement': {
        const { row, col, orientation, length } = typedMsg
        if (wasmExports) {
          const result = wasmExports.validateShipPlacement(row, col, orientation, length)
          self.postMessage({ type: 'validationResult', valid: result === 1 })
        } else {
          self.postMessage({ type: 'validationResult', valid: false })
        }
        break
      }

      case 'fireAt': {
        const { row, col, shooter } = typedMsg
        if (wasmExports) {
          const shooterVal = shooter === 'player' ? 0 : 1
          const result = wasmExports.fireAtCell(row, col, shooterVal)
          // 0 = miss, 1 = hit, 2 = already shot, 3 = sunk
          let resultType: 'miss' | 'hit' | 'already' | 'sunk' = 'miss'
          if (result === 1) {
            resultType = 'hit'
          } else if (result === 2) {
            resultType = 'already'
          } else if (result === 3) {
            resultType = 'sunk'
          }
          self.postMessage({ type: 'fireResult', result: resultType })
        } else {
          self.postMessage({ type: 'fireResult', result: 'miss' })
        }
        break
      }

      case 'getCellValue': {
        const { index } = typedMsg
        if (wasmExports) {
          const value = wasmExports.getCellValue(index)
          self.postMessage({ type: 'cellValueResult', value })
        } else {
          self.postMessage({ type: 'cellValueResult', value: 0 })
        }
        break
      }

      default:
        break
    }
  }
}

export {}
