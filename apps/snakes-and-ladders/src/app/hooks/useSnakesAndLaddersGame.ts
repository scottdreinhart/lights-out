import type { GameState } from '@/domain'
import { applyTurn, createInitialState, rollDie } from '@/domain'
import { useCallback, useEffect, useState } from 'react'

const CPU_ROLL_DELAY_MS = 550

export function useSnakesAndLaddersGame() {
  const [state, setState] = useState<GameState>(() => createInitialState())
  const [isRolling, setIsRolling] = useState(false)

  const rollForCurrentPlayer = useCallback(() => {
    if (state.phase === 'game-over') {
      return
    }
    setIsRolling(true)
    setState((prev) => applyTurn(prev, rollDie()))
    setTimeout(() => setIsRolling(false), 200)
  }, [state.phase])

  const rollForHuman = useCallback(() => {
    if (
      state.phase !== 'playing' ||
      state.players[state.currentPlayerIndex]?.id !== 'human' ||
      isRolling
    ) {
      return
    }
    rollForCurrentPlayer()
  }, [isRolling, rollForCurrentPlayer, state.currentPlayerIndex, state.phase, state.players])

  const resetGame = useCallback(() => {
    setState(createInitialState())
    setIsRolling(false)
  }, [])

  useEffect(() => {
    if (
      state.phase !== 'playing' ||
      state.players[state.currentPlayerIndex]?.id !== 'cpu' ||
      isRolling
    ) {
      return
    }
    const timer = setTimeout(() => {
      rollForCurrentPlayer()
    }, CPU_ROLL_DELAY_MS)

    return () => clearTimeout(timer)
  }, [isRolling, rollForCurrentPlayer, state.currentPlayerIndex, state.phase, state.players])

  return {
    state,
    isRolling,
    rollForHuman,
    resetGame,
  }
}
