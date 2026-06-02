/**
 * WASM Infrastructure Service
 * Provides WebAssembly-accelerated operations for domain logic.
 * Domain layer depends on this abstraction, not on WASM directly.
 */

interface WasmModule {
  instance: WebAssembly.Instance
}

// WASM module cache (lazy-loaded)
let wasmModule: WasmModule | null = null

/**
 * Initialize WASM module from embedded base64 binary
 */
async function initWasm(): Promise<WasmModule | null> {
  if (wasmModule) {
    return wasmModule
  }

  try {
    // Dynamically import the WASM module
    const { AI_WASM_BASE64 } = await import('@/wasm/ai-wasm')

    const binaryString = atob(AI_WASM_BASE64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

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
    console.log('[WASM Service] WASM module loaded for optimization')
    return wasmModule
  } catch (err) {
    console.warn('[WASM Service] WASM unavailable, using JS:', err)
    return null
  }
}

type WasmExportFn = (...args: number[]) => number

function getNumericExport(wasm: WasmModule, exportName: string): WasmExportFn | null {
  const candidate = (wasm.instance.exports as Record<string, unknown>)[exportName]
  return typeof candidate === 'function' ? (candidate as WasmExportFn) : null
}

function toFlatBoard(board: boolean[][]): Uint8Array {
  const flatBoard = new Uint8Array(board.length * (board[0]?.length ?? 0))
  let offset = 0
  for (const row of board) {
    for (const value of row) {
      flatBoard[offset++] = value ? 1 : 0
    }
  }
  return flatBoard
}

/**
 * Rock-Paper-Scissors WASM operations
 */
export const rockPaperScissorsWasm = {
  async init(): Promise<boolean> {
    return (await initWasm()) !== null
  },

  /**
   * Get round winner using WASM (0=draw, 1=player win, 2=cpu win)
   */
  async getRoundWinner(playerMove: number, cpuMove: number): Promise<number | null> {
    const wasm = await initWasm()
    if (!wasm) return null

    try {
      const getRoundWinnerExport = getNumericExport(wasm, 'getRoundWinner')
      if (!getRoundWinnerExport) return null
      return getRoundWinnerExport(playerMove, cpuMove)
    } catch {
      console.debug('WASM round winner calculation failed')
      return null
    }
  },

  /**
   * Select CPU move using WASM
   */
  async selectCPUMove(roundsData: number[], seed: number = Date.now()): Promise<number | null> {
    const wasm = await initWasm()
    if (!wasm) return null

    try {
      const selectCPUMoveExport = getNumericExport(wasm, 'selectCPUMove')
      if (!selectCPUMoveExport || roundsData.length === 0) return null

      // AssemblyScript array exports need loader-generated lifting that this generic adapter does not provide.
      void seed
      return null
    } catch {
      console.debug('WASM CPU move selection failed')
      return null
    }
  },

  /**
   * Check if game is over using WASM
   */
  async isGameOver(playerScore: number, cpuScore: number, bestOf: number): Promise<boolean | null> {
    const wasm = await initWasm()
    if (!wasm) return null

    try {
      const isGameOverExport = getNumericExport(wasm, 'isGameOver')
      if (!isGameOverExport) return null
      return isGameOverExport(playerScore, cpuScore, bestOf) !== 0
    } catch {
      console.debug('WASM game over check failed')
      return null
    }
  },
}

/**
 * Lights-Out WASM operations
 */
export const lightsOutWasm = {
  async init(): Promise<boolean> {
    return (await initWasm()) !== null
  },

  /**
   * Create optimized board using WASM
   */
  async createBoard(): Promise<boolean[][] | null> {
    const wasm = await initWasm()
    if (!wasm) return null

    try {
      const createBoardExport = getNumericExport(wasm, 'createBoard')
      if (!createBoardExport) return null

      // AssemblyScript array exports need loader-generated lifting that this generic adapter does not provide.
      return null
    } catch {
      console.debug('WASM board creation failed')
      return null
    }
  },

  /**
   * Toggle cell with neighbors using WASM optimization
   */
  async toggleCell(board: boolean[][], row: number, col: number): Promise<boolean[][] | null> {
    const wasm = await initWasm()
    if (!wasm) return null

    try {
      const toggleCellExport = getNumericExport(wasm, 'toggleCell')
      if (!toggleCellExport) return null

      // AssemblyScript array exports need loader-generated lifting that this generic adapter does not provide.
      const flatBoard = toFlatBoard(board)
      if (flatBoard.length === 0) return null
      void row
      void col
      return null
    } catch {
      console.debug('WASM cell toggle failed')
      return null
    }
  },

  /**
   * Check if board is solved using WASM
   */
  async isSolved(board: boolean[][]): Promise<boolean | null> {
    const wasm = await initWasm()
    if (!wasm) return null

    try {
      const isSolvedExport = getNumericExport(wasm, 'isSolved')
      if (!isSolvedExport) return null
      const flatBoard = toFlatBoard(board)
      if (flatBoard.length === 0) return null

      // AssemblyScript array exports need loader-generated lifting that this generic adapter does not provide.
      return null
    } catch {
      console.debug('WASM solved check failed')
      return null
    }
  },
}
