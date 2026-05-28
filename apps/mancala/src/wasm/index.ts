import { AI_WASM_BASE64 } from './ai-wasm'

let wasmValidated = false
let wasmValidationAttempted = false

export async function initWasm(): Promise<boolean> {
  if (wasmValidationAttempted) {
    return wasmValidated
  }
  wasmValidationAttempted = true
  try {
    const binary = Uint8Array.from(atob(AI_WASM_BASE64), (char) => char.charCodeAt(0))
    await WebAssembly.compile(binary)
    wasmValidated = true
    return true
  } catch {
    wasmValidated = false
    return false
  }
}

// Placeholder wrappers until generated WASM JS bindings are restored.
// Returning -1 triggers existing JS fallback paths in AI service/worker.
export function selectBestMoveWasm(_board: number[], _player: number, _plyDepth: number): number {
  return -1
}

export function selectBestMoveIterativeWasm(
  _board: number[],
  _player: number,
  _maxTimeMs: number,
): number {
  return -1
}
