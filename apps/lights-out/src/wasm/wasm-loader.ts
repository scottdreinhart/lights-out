import { AI_WASM_BASE64 } from './ai-wasm'

interface WasmModule {
  instance: WebAssembly.Instance
}

let wasmModule: WasmModule | null = null

/**
 * Initialize WASM module from base64-encoded binary
 */
async function initWasm(): Promise<WasmModule> {
  if (wasmModule) {
    return wasmModule
  }

  const binaryString = atob(AI_WASM_BASE64)
  const bytes = Uint8Array.from(binaryString, (character) => character.charCodeAt(0))

  const memory = new WebAssembly.Memory({ initial: 256, maximum: 512 })

  const importObject = {
    env: {
      memory,
      abort: () => {
        throw new Error('WASM abort')
      },
    },
  }

  const wasmResult = await WebAssembly.instantiate(bytes, importObject)
  wasmModule = { instance: wasmResult.instance }
  return wasmModule
}

/**
 * Get WASM module instance, initializing if needed
 */
export async function getWasmModule(): Promise<WasmModule> {
  return wasmModule || initWasm()
}

/**
 * Toggle a cell and its 4 neighbors in WASM
 */
export async function wasmToggleCell(
  board: Uint8Array,
  row: number,
  col: number,
): Promise<Uint8Array> {
  const module = await getWasmModule()
  const toggleCell = module.instance.exports.toggleCell as (
    board: Uint8Array,
    row: number,
    col: number,
  ) => Uint8Array
  return toggleCell(board, row, col)
}

/**
 * Check if puzzle is solved in WASM
 */
export async function wasmIsSolved(board: Uint8Array): Promise<boolean> {
  const module = await getWasmModule()
  const isSolved = module.instance.exports.isSolved as (board: Uint8Array) => boolean
  return isSolved(board)
}

/**
 * Count lights on in WASM
 */
export async function wasmCountLightsOn(board: Uint8Array): Promise<number> {
  const module = await getWasmModule()
  const countLightsOn = module.instance.exports.countLightsOn as (board: Uint8Array) => number
  return countLightsOn(board)
}

/**
 * Convert 2D boolean array to flat Uint8Array for WASM
 */
export function boardToWasm(board: boolean[][]): Uint8Array {
  const flatBoard: number[] = []
  for (const row of board) {
    for (const cell of row) {
      flatBoard.push(cell ? 1 : 0)
    }
  }
  return Uint8Array.from(flatBoard)
}

/**
 * Convert flat Uint8Array from WASM to 2D boolean array
 */
export function boardFromWasm(wasmBoard: Uint8Array): boolean[][] {
  const result: boolean[][] = []
  for (let row = 0; row < 5; row++) {
    const rowData: boolean[] = []
    for (let col = 0; col < 5; col++) {
      rowData.push(wasmBoard[row * 5 + col] !== 0)
    }
    result.push(rowData)
  }
  return result
}
