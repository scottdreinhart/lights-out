import { useCallback, useState } from 'react'
import type { SimonGameState, SimonUIState } from '@/domain'
import { createInitialGameState, DEFAULT_RULES } from '@/domain'
import type { SimonRuleConfig, SimonColor } from '@/domain'
import {
  startGame,
  playDeviceSequence,
  playerMove,
  playerAddsColor,
  handleTimeout,
  resetGame,
} from '@/domain'

interface UseSimonGameOptions {
  rules?: SimonRuleConfig
}

export function useSimonGame(options: UseSimonGameOptions = {}) {
  const rules = options.rules ?? DEFAULT_RULES
  const [state, setState] = useState<SimonGameState>(() => createInitialGameState(rules))
  const [uiState, setUIState] = useState<SimonUIState>({ showRules: false })

  const beginGame = useCallback(() => {
    setState(prev => startGame(prev, rules))
  }, [rules])

  const playSequence = useCallback(async () => {
    const { state: newState, sequence } = playDeviceSequence(state, rules)
    setState(newState)
    return sequence
  }, [state, rules])

  const makeMove = useCallback(
    (color: SimonColor) => {
      if (rules.playerAddsMode) {
        setState(prev => playerAddsColor(prev, color, rules))
      } else {
        setState(prev => playerMove(prev, color, rules))
      }
    },
    [rules],
  )

  const onTimeout = useCallback(() => {
    setState(prev => handleTimeout(prev, rules))
  }, [rules])

  const reset = useCallback(() => {
    setState(prev => resetGame(prev, rules))
  }, [rules])

  const toggleRules = useCallback(() => {
    setUIState(prev => ({ ...prev, showRules: !prev.showRules }))
  }, [])

  const closeRules = useCallback(() => {
    setUIState(prev => ({ ...prev, showRules: false }))
  }, [])

  return {
    state,
    uiState,
    rules,
    beginGame,
    playSequence,
    makeMove,
    onTimeout,
    reset,
    toggleRules,
    closeRules,
  }
}
