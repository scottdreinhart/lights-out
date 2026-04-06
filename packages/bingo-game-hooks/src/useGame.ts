/**
 * Game state management hook for Bingo.
 * 
 * Uses game logic from the shared @games/bingo-domain package.
 * Shared across all bingo variants and consumers.
 */

import { useCallback, useState } from 'react'
import {
  checkCardWin,
  createGameState,
  drawNumber,
  drawNumbers,
  getCardHint,
  getCardPatterns,
  getGameStats,
  getRemainingNumbers,
  resetGame,
  type BingoGameState,
  type DrawResult,
} from '@games/bingo-domain'

export function useGame(initialCardCount: number = 1) {
  const [gameState, setGameState] = useState<BingoGameState>(() =>
    createGameState(initialCardCount),
  )

  const drawSingleNumber = useCallback((): DrawResult | null => {
    let result: DrawResult | null = null
    setGameState((prev) => {
      const newState = { ...prev }
      result = drawNumber(newState)
      return newState
    })
    return result
  }, [])

  const drawMultipleNumbers = useCallback((count: number): (DrawResult | null)[] => {
    let results: (DrawResult | null)[] = []
    setGameState((prev) => {
      const newState = { ...prev }
      results = drawNumbers(newState, count)
      return newState
    })
    return results
  }, [])

  const handleReset = useCallback((): void => {
    setGameState((prev) => resetGame(prev))
  }, [])

  const handleNewGame = useCallback((cardCount: number): void => {
    setGameState(createGameState(cardCount))
  }, [])

  const getWinnerChecks = useCallback(
    (cardId: string) => ({
      isWinner: checkCardWin(gameState, cardId),
      patterns: getCardPatterns(gameState, cardId),
    }),
    [gameState],
  )

  const getHintPositions = useCallback(
    (cardId: string) => getCardHint(gameState, cardId),
    [gameState],
  )

  const stats = useCallback(() => getGameStats(gameState), [gameState])

  const remainingNumbers = useCallback(() => getRemainingNumbers(gameState), [gameState])

  return {
    gameState,
    drawSingleNumber,
    drawMultipleNumbers,
    handleReset,
    handleNewGame,
    getWinnerChecks,
    getHintPositions,
    stats,
    remainingNumbers,
  }
}
