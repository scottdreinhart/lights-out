/**
 * Mini Bingo game hook (useGame)
 * Manages game state and actions for mini bingo (3x3)
 */

import type { GameState } from '@/domain'
import {
  createGameState,
  newGame as createNewGame,
  drawNumber,
  getHintPositions as getHints,
  resetGame,
} from '@/domain'
import { useCallback, useEffect, useState } from 'react'

export function useGame(cardCount: number = 1) {
  const [gameState, setGameState] = useState<GameState>(() => createGameState(cardCount))

  // Update game state if card count changes
  useEffect(() => {
    setGameState(createGameState(cardCount))
  }, [cardCount])

  const drawSingleNumber = useCallback(() => {
    setGameState((prevState) => {
      const result = drawNumber(prevState)
      return { ...prevState }
    })
  }, [])

  const handleReset = useCallback(() => {
    setGameState((prevState) => {
      resetGame(prevState)
      return { ...prevState }
    })
  }, [])

  const handleNewGame = useCallback((count: number) => {
    const newGameState = createNewGame(count)
    setGameState(newGameState)
  }, [])

  const getWinnerChecks = useCallback(() => {
    return gameState.winners
  }, [gameState.winners])

  const getHintPositions = useCallback(
    (cardId: number, count?: number) => {
      return getHints(gameState, cardId, count)
    },
    [gameState],
  )

  return {
    gameState,
    drawSingleNumber,
    handleReset,
    handleNewGame,
    getWinnerChecks,
    getHintPositions,
  }
}
