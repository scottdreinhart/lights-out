import { selectMove } from '@/domain'
import type { GameState } from '@/domain'
import { AI_WASM_BASE64 } from '@/wasm/ai-wasm'

// ============================================================================
// WASM AI Engine — loaded on startup, falls back to JS on failure
// ============================================================================

/** selectMove(p0..p7, numPiles, mode) → encoded move */
type WasmSelectMove = (
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  p4: number,
  p5: number,
  p6: number,
  p7: number,
  numPiles: number,
  mode: number,
) => number

let wasmSelectMove: WasmSelectMove | null = null

/** Decode base64 WASM binary and instantiate the module */
async function initWasm(): Promise<void> {
  if (!AI_WASM_BASE64) {
    return
  }
  try {
    const binary = atob(AI_WASM_BASE64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    const imports = { env: { abort: () => {} } }
    const { instance } = await WebAssembly.instantiate(bytes, imports)
    wasmSelectMove = instance.exports.selectMove as WasmSelectMove
  } catch {
    // WASM unavailable — JS fallback will be used silently
  }
}

// Await WASM readiness before processing any message
const wasmReady = initWasm()

// ============================================================================
// Worker message handler
// ============================================================================

self.onmessage = async (e: MessageEvent<{ state: GameState }>) => {
  const { state } = e.data
  if (!state) {
    return
  }

  // Ensure WASM has had a chance to load before first move
  await wasmReady

  let move: { pileId: number; removeCount: number }
  let engine: 'wasm' | 'js' = 'js'

  if (wasmSelectMove) {
    const counts = state.piles.map((p) => p.count)
    // Pad to 8 slots
    while (counts.length < 8) {
      counts.push(0)
    }
    const mode = state.mode === 'misere' ? 1 : 0
    const encoded = wasmSelectMove(
      counts[0],
      counts[1],
      counts[2],
      counts[3],
      counts[4],
      counts[5],
      counts[6],
      counts[7],
      state.piles.length,
      mode,
    )
    move = { pileId: (encoded >> 8) & 0xffff, removeCount: encoded & 0xff }
    engine = 'wasm'
  } else {
    move = selectMove(state)
  }

  self.postMessage({ move, engine })
}

export {}
