import { computeNextSimonColor, ensureSimonAiReady } from '@/app/aiEngine'
import type { SimonColor, SimonGameState, SimonRuleConfig, SimonUIState } from '@/domain'
import {
  createInitialGameState,
  DEFAULT_RULES,
  getColorSequence,
  handleTimeout,
  playDeviceSequence,
  playerAddsColor,
  playerMove,
  resetGame,
  startGame,
} from '@/domain'
import { useCallback, useEffect, useState } from 'react'

interface UseSimonGameOptions {
  rules?: SimonRuleConfig
}

const DIFFICULTY_PRESETS: Record<
  1 | 2 | 3 | 4,
  Pick<SimonRuleConfig, 'difficultyLevel' | 'inputTimeoutMs' | 'maxSequenceLength'>
> = {
  1: {
    difficultyLevel: 1,
    inputTimeoutMs: 6000,
    maxSequenceLength: 16,
  },
  2: {
    difficultyLevel: 2,
    inputTimeoutMs: 5000,
    maxSequenceLength: 24,
  },
  3: {
    difficultyLevel: 3,
    inputTimeoutMs: 4000,
    maxSequenceLength: 31,
  },
  4: {
    difficultyLevel: 4,
    inputTimeoutMs: 3000,
    maxSequenceLength: 40,
  },
}

export function useSimonGame(options: UseSimonGameOptions = {}) {
  const [rules, setRules] = useState<SimonRuleConfig>(() => options.rules ?? DEFAULT_RULES)
  const [state, setState] = useState<SimonGameState>(() => createInitialGameState(rules))
  const [uiState, setUIState] = useState<SimonUIState>({ showRules: false })

  useEffect(() => {
    void ensureSimonAiReady()
  }, [])

  const beginGame = useCallback(() => {
    setState((prev) => startGame(prev, rules))
  }, [rules])

  const playSequence = useCallback(async () => {
    const { state: newState, sequence } = playDeviceSequence(state, rules)
    setState(newState)
    return sequence
  }, [state, rules])

  const makeMove = useCallback(
    (color: SimonColor) => {
      if (rules.playerAddsMode) {
        setState((prev) => playerAddsColor(prev, color, rules))
      } else {
        setState((prev) => {
          const nextState = playerMove(prev, color, rules)
          const shouldApplyAiColor =
            !nextState.gameOver &&
            nextState.phase === 'deviceTurn' &&
            nextState.sequence.length === prev.sequence.length + 1

          if (!shouldApplyAiColor) {
            return nextState
          }

          const colors = getColorSequence(rules.colorCount)
          const aiColor = computeNextSimonColor(colors, nextState, rules)
          const nextSequence = [...nextState.sequence]
          nextSequence[nextSequence.length - 1] = aiColor

          return {
            ...nextState,
            sequence: nextSequence,
          }
        })
      }
    },
    [rules],
  )

  const onTimeout = useCallback(() => {
    setState((prev) => handleTimeout(prev, rules))
  }, [rules])

  const reset = useCallback(() => {
    setState((prev) => resetGame(prev, rules))
  }, [rules])

  const toggleRules = useCallback(() => {
    setUIState((prev) => ({ ...prev, showRules: !prev.showRules }))
  }, [])

  const closeRules = useCallback(() => {
    setUIState((prev) => ({ ...prev, showRules: false }))
  }, [])

  const setDifficulty = useCallback((level: 1 | 2 | 3 | 4) => {
    setRules((prevRules) => {
      const difficultyPatch = DIFFICULTY_PRESETS[level]
      const nextRules: SimonRuleConfig = {
        ...prevRules,
        ...difficultyPatch,
      }

      setState(createInitialGameState(nextRules))
      return nextRules
    })
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
    setDifficulty,
  }
}
