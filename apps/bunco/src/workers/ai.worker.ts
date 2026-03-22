import { rollDice, scoreRoll } from '@/domain'
import type { DieValue, RollResult } from '@/domain'
import type { WasmEngine } from '@/wasm/wasm-loader'
import { loadWasmEngine } from '@/wasm/wasm-loader'

// ============================================================================
// Bunco dice worker — WASM-first with JS fallback
// ============================================================================

let wasmEngine: WasmEngine | null = null

// Attempt to load WASM engine on worker init
loadWasmEngine().then((engine) => {
  wasmEngine = engine
})

function rollWithFallback(target: DieValue): RollResult {
  if (wasmEngine) {
    return wasmEngine.rollDice(target)
  }
  const dice = rollDice()
  return scoreRoll(dice, target)
}

self.onmessage = (e: MessageEvent<{ target: DieValue }>) => {
  const { target } = e.data
  if (!target) {
    return
  }

  const result = rollWithFallback(target)
  self.postMessage({ result })
}

export {}
