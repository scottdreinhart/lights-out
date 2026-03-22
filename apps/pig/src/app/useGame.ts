import { createUseStandardPileGameHook } from '@games/app-hook-utils'

import {
  applyMove,
  checkGameOver,
  createInitialBoard,
  getWinner,
  selectMove,
} from '@/domain'
import type { GameMode, GameState, Move } from '@/domain'

const createGameWorker = (onMove: (move: Move) => void): Worker => {
  const worker = new Worker(new URL('@/workers/ai.worker.ts', import.meta.url), {
    type: 'module',
  })
  worker.onmessage = (e: MessageEvent<{ move: Move }>) => {
    onMove(e.data.move)
  }
  return worker
}

export const useGame = createUseStandardPileGameHook<GameMode, GameState['winner'], GameState, Move>({
  createInitialBoard,
  applyMove,
  checkGameOver,
  getWinner,
  selectMove,
  createWorker: createGameWorker,
})
