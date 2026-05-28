import type { GameAction, GameState } from '@/domain'
import {
  GAME_META,
  INITIAL_STATE,
  SIMULATION_CONFIG,
  TICK_INTERVAL_MS,
  reduceGameState,
} from '@/domain'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseGameResult {
  state: GameState
  meta: typeof GAME_META
  dispatch: (action: GameAction) => void
  reset: () => void
}

export const useGame = (): UseGameResult => {
  const [state, setState] = useState<GameState>(INITIAL_STATE)
  const rafRef = useRef<number | null>(null)
  const frameTimeRef = useRef<number | null>(null)
  const accumulatorRef = useRef(0)

  const dispatch = useCallback((action: GameAction) => {
    setState((prev) => reduceGameState(prev, action))
  }, [])

  const reset = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  useEffect(() => {
    if (state.phase === 'gameOver') {
      return
    }

    const step = (time: number) => {
      const previous = frameTimeRef.current ?? time
      const deltaMs = Math.min(time - previous, SIMULATION_CONFIG.maxFrameDeltaMs)
      frameTimeRef.current = time
      accumulatorRef.current += deltaMs

      while (accumulatorRef.current >= TICK_INTERVAL_MS) {
        setState((prev) => reduceGameState(prev, 'tick'))
        accumulatorRef.current -= TICK_INTERVAL_MS
      }

      rafRef.current = window.requestAnimationFrame(step)
    }

    rafRef.current = window.requestAnimationFrame(step)

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
      rafRef.current = null
      frameTimeRef.current = null
      accumulatorRef.current = 0
    }
  }, [state.phase])

  return { state, meta: GAME_META, dispatch, reset }
}
