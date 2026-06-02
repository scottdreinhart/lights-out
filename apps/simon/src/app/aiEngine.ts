import type { SimonColor, SimonGameState, SimonRuleConfig } from '@/domain'
import { SIMON_AI_WASM_BASE64 } from '@/wasm/ai-wasm'

type EngineKind = 'wasm' | 'js'
type WasmHeuristicFn = (a: number, b: number, c: number, d: number) => number

let wasmHeuristic: WasmHeuristicFn | null = null
let wasmReady = false

const initWasmPromise: Promise<void> = (async () => {
  try {
    const binary = atob(SIMON_AI_WASM_BASE64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    const { instance } = await WebAssembly.instantiate(bytes, {})
    const candidate = instance.exports.zipHeuristicDistance
    if (typeof candidate === 'function') {
      wasmHeuristic = candidate as WasmHeuristicFn
      wasmReady = true
    }
  } catch {
    wasmHeuristic = null
    wasmReady = false
  }
})()

export const ensureSimonAiReady = (): Promise<void> => initWasmPromise

export const getSimonAiEngine = (): EngineKind => (wasmReady && wasmHeuristic ? 'wasm' : 'js')

const jsFallbackHeuristic = (a: number, b: number, c: number, d: number): number => {
  let value = ((a * 1664525 + b * 1013904223 + c * 69069 + d * 362437) >>> 0) & 0x7fffffff
  value ^= value << 13
  value ^= value >>> 17
  value ^= value << 5
  return value >>> 0
}

export const computeNextSimonColor = (
  colors: SimonColor[],
  state: SimonGameState,
  rules: SimonRuleConfig,
): SimonColor => {
  if (colors.length === 0) {
    return 'red'
  }

  const seedA = ((Date.now() & 0xffff) + state.score + state.currentRound) & 0x7fffffff
  const seedB = (state.sequence.length * 31 + state.playerInput.length * 17) & 0x7fffffff
  const seedC = (rules.maxSequenceLength + rules.inputTimeoutMs) & 0x7fffffff
  const seedD = rules.difficultyLevel

  const raw = wasmHeuristic
    ? wasmHeuristic(seedA, seedB, seedC, seedD)
    : jsFallbackHeuristic(seedA, seedB, seedC, seedD)

  const index = Math.abs(raw) % colors.length
  return colors[index] ?? colors[0]
}
