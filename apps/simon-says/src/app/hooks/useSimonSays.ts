/**
 * Simon Says: App Hook
 * Coordinates game state and device playback
 */

import { useCallback, useEffect, useState } from 'react'
import type { SimonColor, SimonGameState, SimonRuleConfig } from '@/domain'
import { DEFAULT_RULES, startGame, playerMove, playerAddsColor, handleTimeout, resetGame } from '@/domain'
import { createInitialGameState } from '@/domain'

export function useSimonSays(initialRules: Partial<SimonRuleConfig> = {}) {
  const rules = { ...DEFAULT_RULES, ...initialRules }
  const [gameState, setGameState] = useState<SimonGameState>(() => createInitialGameState(rules))
  const [isPlayingSequence, setIsPlayingSequence] = useState(false)

  // Start a new game
  const startNewGame = useCallback(() => {
    const newState = startGame(createInitialGameState(rules), rules)
    setGameState(newState)
  }, [rules])

  // Player makes a move
  const makeMove = useCallback(
    (color: SimonColor) => {
      if (isPlayingSequence || gameState.gameOver) return
      const newState = playerMove(gameState, color, rules)
      setGameState(newState)
    },
    [gameState, rules, isPlayingSequence],
  )

  // Handle timeout
  const onTimeout = useCallback(() => {
    const newState = handleTimeout(gameState, rules)
    setGameState(newState)
  }, [gameState, rules])

  // Reset to initial state
  const reset = useCallback(() => {
    const newState = resetGame(gameState, rules)
    setGameState(newState)
  }, [gameState, rules])

  // Auto-play device sequence when game moves to deviceTurn
  useEffect(() => {
    if (gameState.phase === 'deviceTurn' && !gameState.gameOver && !isPlayingSequence) {
      setIsPlayingSequence(true)
      // Delay before playing sequence
      const playSequenceTimer = setTimeout(() => {
        // Sequence playback would be handled by the organism component
        // This hook just manages state transitions
        setIsPlayingSequence(false)
      }, 1500)
      return () => clearTimeout(playSequenceTimer)
    }
  }, [gameState.phase, gameState.gameOver, isPlayingSequence])

  return {
    gameState,
    startNewGame,
    makeMove,
    onTimeout,
    reset,
    isPlayingSequence,
    rules,
  }
}

