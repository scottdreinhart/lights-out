/**
 * Progressive Bingo game state management hook
 */

import type { GameState } from '@/domain'
import { createGameState, drawNumber, getHints, getJackpot, getLevel, getWinners } from '@/domain'
import { useCallback, useState } from 'react'

export function useGame(cardCount: number = 1) {
  const [gameState, setGameState] = useState<GameState>(() => createGameState(cardCount))

  const drawSingleNumber = useCallback(() => {
    const result = drawNumber(gameState)
    if (result) {
      setGameState({ ...gameState })
    }
  }, [gameState])

  const handleReset = useCallback(() => {
    setGameState(createGameState(gameState.cards.length))
  }, [gameState.cards.length])

  const handleNewGame = useCallback((newCardCount: number) => {
    setGameState(createGameState(newCardCount))
  }, [])

  const winners = getWinners(gameState)
  const level = getLevel(gameState)
  const jackpot = getJackpot(gameState)
  const hints = getHints(gameState)

  return {
    gameState,
    drawSingleNumber,
    handleReset,
    handleNewGame,
    getWinnerChecks: () => gameState.winners,
    getHintPositions: () => hints,
    level,
    jackpot,
  }
}

export default useGame
