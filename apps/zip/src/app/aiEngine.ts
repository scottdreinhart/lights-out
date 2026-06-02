import type { Difficulty, Position, Solution, ZipState } from '../domain'
import { findOptimalPath, generateSolvableMaze, getHintMove } from '../domain'
import { AI_WASM_BASE64 } from '../wasm/ai-wasm'

type WasmDistanceFn = (fromRow: number, fromCol: number, toRow: number, toCol: number) => number

type EngineKind = 'wasm' | 'js'

type ZipWorkerRequestMap = {
  hint: { state: ZipState }
  solve: { state: ZipState }
  generate: { difficulty: Difficulty }
}

type ZipWorkerResponseMap = {
  hint: Position | null
  solve: Solution | null
  generate: ZipState
}

type WorkerRequest<K extends keyof ZipWorkerRequestMap> = {
  id: number
  command: K
  payload: ZipWorkerRequestMap[K]
}

type WorkerResponse<K extends keyof ZipWorkerResponseMap> = {
  id: number
  ok: boolean
  engine: EngineKind
  data?: ZipWorkerResponseMap[K]
  error?: string
}

export type ZipAiResult<T> = {
  data: T
  engine: EngineKind
}

let wasmDistanceFn: WasmDistanceFn | null = null
let wasmReady = false

const initWasmPromise: Promise<void> = (async () => {
  try {
    if (!AI_WASM_BASE64) {
      return
    }

    const binary = atob(AI_WASM_BASE64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    const imports = { env: { abort: () => {} } }
    const { instance } = await WebAssembly.instantiate(bytes, imports)

    wasmDistanceFn = instance.exports.zipHeuristicDistance as WasmDistanceFn
    wasmReady = typeof wasmDistanceFn === 'function'
  } catch {
    wasmDistanceFn = null
    wasmReady = false
  }
})()

export const ensureWasmReady = (): Promise<void> => initWasmPromise

const getCurrentEngine = (): EngineKind => (wasmReady && wasmDistanceFn ? 'wasm' : 'js')

export const generateSolvableMazeAi = (difficulty: Difficulty): ZipAiResult<ZipState> => {
  return {
    data: generateSolvableMaze(difficulty),
    engine: getCurrentEngine(),
  }
}

export const getHintMoveAi = (state: ZipState): ZipAiResult<Position | null> => {
  return {
    data: getHintMove(state),
    engine: getCurrentEngine(),
  }
}

export const findOptimalPathAi = (state: ZipState): ZipAiResult<Solution | null> => {
  return {
    data: findOptimalPath(state),
    engine: getCurrentEngine(),
  }
}

let worker: Worker | null = null
let requestId = 0
const pending = new Map<number, (value: ZipAiResult<unknown>) => void>()
const pendingErrors = new Map<number, (reason: unknown) => void>()

const getWorker = (): Worker => {
  if (worker) {
    return worker
  }

  worker = new Worker(new URL('../workers/ai.worker.ts', import.meta.url), { type: 'module' })
  worker.onmessage = (event: MessageEvent<WorkerResponse<keyof ZipWorkerResponseMap>>) => {
    const response = event.data
    const resolve = pending.get(response.id)
    const reject = pendingErrors.get(response.id)

    if (!resolve || !reject) {
      return
    }

    pending.delete(response.id)
    pendingErrors.delete(response.id)

    if (!response.ok) {
      reject(new Error(response.error || 'Worker request failed'))
      return
    }

    resolve({
      data: response.data,
      engine: response.engine,
    })
  }

  return worker
}

const runWorkerCommand = <K extends keyof ZipWorkerRequestMap>(
  command: K,
  payload: ZipWorkerRequestMap[K],
): Promise<ZipAiResult<ZipWorkerResponseMap[K]>> => {
  const activeWorker = getWorker()
  const id = ++requestId

  return new Promise<ZipAiResult<ZipWorkerResponseMap[K]>>((resolve, reject) => {
    pending.set(id, resolve as (value: ZipAiResult<unknown>) => void)
    pendingErrors.set(id, reject as (reason: unknown) => void)

    const request: WorkerRequest<K> = { id, command, payload }
    activeWorker.postMessage(request)
  })
}

export const generateSolvableMazeAsync = async (
  difficulty: Difficulty,
): Promise<ZipAiResult<ZipState>> => {
  return runWorkerCommand('generate', { difficulty })
}

export const getHintMoveAsync = async (state: ZipState): Promise<ZipAiResult<Position | null>> => {
  return runWorkerCommand('hint', { state })
}

export const findOptimalPathAsync = async (
  state: ZipState,
): Promise<ZipAiResult<Solution | null>> => {
  return runWorkerCommand('solve', { state })
}

export const terminateAsyncAi = (): void => {
  if (!worker) {
    return
  }

  worker.terminate()
  worker = null
  pending.clear()
  pendingErrors.clear()
}
