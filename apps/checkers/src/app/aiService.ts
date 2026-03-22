import {
  computeAiMove,
  type AiMoveRequest,
  type AiMoveResponse,
  type Board,
  type Move,
  type Player,
} from '@/domain'

export interface AiWorkerLike {
  onmessage: ((event: MessageEvent<AiMoveResponse>) => void) | null
  onerror: ((event: Event) => void) | null
  postMessage: (message: AiMoveRequest) => void
  terminate: () => void
}

export type AiWorkerFactory = () => AiWorkerLike

const AI_WORKER_TIMEOUT_MS = 4_000

const createAiWorker = (): AiWorkerLike =>
  new Worker(new URL('../workers/ai.worker.ts', import.meta.url), {
    type: 'module',
  }) as unknown as AiWorkerLike

export const computeAiMoveSync = (board: Board, player: Player): Move | null =>
  computeAiMove(board, player)

export const computeAiMoveAsync = (
  board: Board,
  player: Player,
  workerFactory?: AiWorkerFactory,
): Promise<Move | null> => {
  const fallbackMove = () => computeAiMoveSync(board, player)
  const resolvedFactory = workerFactory ?? (typeof Worker === 'undefined' ? null : createAiWorker)

  if (!resolvedFactory) {
    return Promise.resolve(fallbackMove())
  }

  let worker: AiWorkerLike
  try {
    worker = resolvedFactory()
  } catch {
    return Promise.resolve(fallbackMove())
  }

  return new Promise((resolve) => {
    let settled = false
    const timeoutId = globalThis.setTimeout(() => {
      finalize(fallbackMove())
    }, AI_WORKER_TIMEOUT_MS)

    const cleanup = () => {
      globalThis.clearTimeout(timeoutId)
      worker.onmessage = null
      worker.onerror = null
      worker.terminate()
    }

    const finalize = (move: Move | null) => {
      if (settled) {
        return
      }

      settled = true
      cleanup()
      resolve(move)
    }

    worker.onmessage = (event) => {
      if (event.data.type === 'result') {
        finalize(event.data.move)
        return
      }

      finalize(fallbackMove())
    }

    worker.onerror = () => {
      finalize(fallbackMove())
    }

    worker.postMessage({
      type: 'compute-move',
      board,
      player,
    })
  })
}
