/**
 * WASM Loader — loads the Bunco dice engine from base64-embedded WASM.
 *
 * Provides typed wrappers around the raw WASM exports.
 * Falls back gracefully if WASM is unavailable or fails to load.
 */

import type { DieValue, RollResult } from '@/domain'

import { AI_WASM_BASE64 } from './ai-wasm'

export interface WasmEngine {
  rollDice(target: DieValue): RollResult
}

interface WasmExports {
  setSeed(s: bigint): void
  rollDice(): void
  getDie1(): number
  getDie2(): number
  getDie3(): number
  scoreRoll(d1: number, d2: number, d3: number, target: number): void
  getPoints(): number
  getIsBunco(): number
  getIsMiniBunco(): number
  getMatchCount(): number
}

let engine: WasmEngine | null = null
let loadAttempted = false

/**
 * Load and instantiate the WASM engine.
 * Returns null if WASM is unavailable or the module is empty.
 * Safe to call multiple times — caches the result.
 */
export async function loadWasmEngine(): Promise<WasmEngine | null> {
  if (loadAttempted) {
    return engine
  }
  loadAttempted = true

  if (!AI_WASM_BASE64) {
    return null
  }

  try {
    const binary = Uint8Array.from(atob(AI_WASM_BASE64), (c) => c.charCodeAt(0))
    const { instance } = await WebAssembly.instantiate(binary, {
      env: { abort: () => {} },
    })
    const wasm = instance.exports as unknown as WasmExports

    // Seed PRNG with high-resolution timestamp
    wasm.setSeed(BigInt(Math.floor(performance.now() * 1000000)))

    engine = {
      rollDice(target: DieValue): RollResult {
        wasm.rollDice()
        const d1 = wasm.getDie1() as DieValue
        const d2 = wasm.getDie2() as DieValue
        const d3 = wasm.getDie3() as DieValue
        wasm.scoreRoll(d1, d2, d3, target)

        return {
          dice: [d1, d2, d3],
          points: wasm.getPoints(),
          isBunco: wasm.getIsBunco() !== 0,
          isMiniBunco: wasm.getIsMiniBunco() !== 0,
          matchCount: wasm.getMatchCount(),
        }
      },
    }

    return engine
  } catch {
    return null
  }
}
