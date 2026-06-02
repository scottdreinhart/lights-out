import type { Round } from '@/domain'
import { AI_WASM_BASE64 } from '@/wasm/ai-wasm'

type WasmExports = {
  getRoundWinner?: (playerMove: number, cpuMove: number) => number
  isGameOver?: (playerScore: number, cpuScore: number, bestOf: number) => number
  selectCPUMove?: (roundsPtr: number, roundsLen: number, seed: number) => number
  memory?: WebAssembly.Memory
}

let exportsRef: WasmExports | null = null
let wasmReady = false

const moveToInt = (move: 'rock' | 'paper' | 'scissors'): number =>
  move === 'rock' ? 0 : move === 'paper' ? 1 : 2

const resultToInt = (result: 'win' | 'loss' | 'draw'): number =>
  result === 'draw' ? 0 : result === 'win' ? 1 : 2

const ensureWasm = async (): Promise<boolean> => {
  if (exportsRef) {
    return wasmReady
  }

  try {
    const binary = atob(AI_WASM_BASE64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    const imports = {
      env: {
        abort: () => {},
      },
    }

    const { instance } = await WebAssembly.instantiate(bytes, imports)
    exportsRef = instance.exports as unknown as WasmExports
    wasmReady = true
    return true
  } catch {
    exportsRef = null
    wasmReady = false
    return false
  }
}

export const initWasm = (): Promise<boolean> => ensureWasm()

export const rockPaperScissorsWasm = {
  async getRoundWinner(playerMove: number, cpuMove: number): Promise<number | null> {
    await ensureWasm()
    return exportsRef?.getRoundWinner ? exportsRef.getRoundWinner(playerMove, cpuMove) : null
  },

  async isGameOver(playerScore: number, cpuScore: number, bestOf: number): Promise<boolean | null> {
    await ensureWasm()
    if (!exportsRef?.isGameOver) {
      return null
    }
    return exportsRef.isGameOver(playerScore, cpuScore, bestOf) === 1
  },

  async selectCPUMove(rounds: Round[], seed: number): Promise<number | null> {
    await ensureWasm()
    if (!exportsRef?.selectCPUMove || !exportsRef.memory) {
      return null
    }

    const encoded = rounds.flatMap((round) => [
      moveToInt(round.playerMove),
      moveToInt(round.cpuMove),
      resultToInt(round.result),
    ])

    const ptr = 1024
    const memory = new Int32Array(exportsRef.memory.buffer)
    if (ptr / 4 + encoded.length >= memory.length) {
      return null
    }

    for (let i = 0; i < encoded.length; i++) {
      memory[ptr / 4 + i] = encoded[i]
    }

    return exportsRef.selectCPUMove(ptr, rounds.length, seed)
  },
}
