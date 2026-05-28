import type { GameAction, GameState } from '@/domain'
import { GAME_META, LEVEL_ONE, TICK_MS, createInitialGameState, reduceGameState } from '@/domain'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useKeyboardControls } from '@games/app-hook-utils'

export interface UseGameResult {
  state: GameState
  meta: typeof GAME_META
  dispatch: (action: GameAction) => void
  burst: () => void
  reset: () => void
}

export const useGame = (): UseGameResult => {
  const [state, setState] = useState<GameState>(() => createInitialGameState(LEVEL_ONE))

  const dispatch = useCallback((action: GameAction) => {
    setState((prev) => reduceGameState(prev, action))
  }, [])

  const reset = useCallback(() => {
    setState(createInitialGameState(LEVEL_ONE))
  }, [])

  const burst = useCallback(() => {
    setState((prev) => reduceGameState(prev, { type: 'burst' }))
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setState((prev) => reduceGameState(prev, { type: 'tick' }))
    }, TICK_MS)

    return () => window.clearInterval(timer)
  }, [])

  const keyboardBindings = useMemo(
    () => [
      { action: 'burst', keys: ['Space', 'ArrowUp', 'KeyW'], onTrigger: burst },
      { action: 'restart', keys: ['KeyR'], onTrigger: () => setState((prev) => reduceGameState(prev, { type: 'restart' })) },
    ],
    [burst],
  )

  useKeyboardControls(keyboardBindings)

  return { state, meta: GAME_META, dispatch, burst, reset }
}
