import type { GameState, WarRuleConfig } from '@/domain'
import { createInitialGameState, getWinner, isGameOver, playRound, DEFAULT_RULES, resetGame } from '@/domain'
import { useCallback, useState } from 'react'

interface UseWarOptions {
  rules?: WarRuleConfig
}

export function useWar(options: UseWarOptions = {}) {
  const rules = options.rules ?? DEFAULT_RULES
  
  const [state, setState] = useState<GameState>(createInitialGameState)

  const nextRound = useCallback(() => {
    setState((prev) => playRound(prev, rules))
  }, [rules])

  const reset = useCallback(() => {
    setState(resetGame)
  }, [])

  const isOver = isGameOver(state)
  const winner = getWinner(state)

  return {
    state,
    nextRound,
    reset,
    isOver,
    winner,
    rules,
  }
}
