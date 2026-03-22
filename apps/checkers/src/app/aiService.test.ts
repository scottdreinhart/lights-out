import { describe, expect, it } from 'vitest'

import { createInitialBoard, type AiMoveRequest, type AiMoveResponse } from '@/domain'

import { computeAiMoveAsync, computeAiMoveSync, type AiWorkerLike } from './aiService'

const createWorkerFactory = (): (() => AiWorkerLike) => () => {
  const worker: AiWorkerLike = {
    onmessage: null,
    onerror: null,
    postMessage(message: AiMoveRequest) {
      const move = computeAiMoveSync(message.board, message.player)
      const response: AiMoveResponse = { type: 'result', move }
      this.onmessage?.({ data: response } as MessageEvent<AiMoveResponse>)
    },
    terminate() {},
  }

  return worker
}

describe('computeAiMoveAsync', () => {
  it('matches the synchronous AI result when the worker returns successfully', async () => {
    const board = createInitialBoard()
    const syncMove = computeAiMoveSync(board, 'black')

    const asyncMove = await computeAiMoveAsync(board, 'black', createWorkerFactory())

    expect(asyncMove).toEqual(syncMove)
  })

  it('falls back to the synchronous path when worker creation fails', async () => {
    const board = createInitialBoard()
    const syncMove = computeAiMoveSync(board, 'black')

    const asyncMove = await computeAiMoveAsync(board, 'black', () => {
      throw new Error('worker unavailable')
    })

    expect(asyncMove).toEqual(syncMove)
  })

  it('falls back to the synchronous path when the worker reports an error', async () => {
    const board = createInitialBoard()
    const syncMove = computeAiMoveSync(board, 'black')

    const asyncMove = await computeAiMoveAsync(board, 'black', () => ({
      onmessage: null,
      onerror: null,
      postMessage() {
        const response: AiMoveResponse = { type: 'error', error: 'boom' }
        this.onmessage?.({ data: response } as MessageEvent<AiMoveResponse>)
      },
      terminate() {},
    }))

    expect(asyncMove).toEqual(syncMove)
  })
})
