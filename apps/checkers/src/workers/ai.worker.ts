/**
 * AI Web Worker — off-main-thread computation for CPU moves.
 * Keeps UI at 60 FPS during complex AI calculations.
 */

import { computeAiMove, type AiMoveRequest, type AiMoveResponse } from '@/domain'

self.onmessage = (event: MessageEvent<AiMoveRequest>) => {
  if (event.data.type !== 'compute-move') {
    return
  }

  try {
    const message: AiMoveResponse = {
      type: 'result',
      move: computeAiMove(event.data.board, event.data.player),
    }
    self.postMessage(message)
  } catch (error) {
    const message: AiMoveResponse = {
      type: 'error',
      error: error instanceof Error ? error.message : 'AI worker failed to compute a move.',
    }
    self.postMessage(message)
  }
}

export {}
