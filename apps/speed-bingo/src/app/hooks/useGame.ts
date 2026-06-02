/**
 * Speed Bingo game hook with auto-drawing functionality.
 */

import {
  cloneGameState,
  createGameState,
  DEFAULT_DRAW_SPEED,
  drawNumber,
  endGame,
  getCardHint,
  getWinnerCheck,
  resetGame,
  setDrawSpeed,
  startAutoDraw,
  stopAutoDraw,
  type SpeedBingoGameState,
} from '@/domain'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useGame(cardCount: number = 1) {
  const [gameState, setGameState] = useState<SpeedBingoGameState>(() =>
    createGameState(cardCount, DEFAULT_DRAW_SPEED),
  )

  const autoDrawRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auto-drawing effect
  useEffect(() => {
    if (gameState.isAutoDrawing && gameState.gameActive) {
      autoDrawRef.current = setInterval(() => {
        setGameState((prevState) => {
          const newState = cloneGameState(prevState)
          drawNumber(newState)
          return newState
        })
      }, gameState.drawSpeed)
    } else {
      if (autoDrawRef.current) {
        clearInterval(autoDrawRef.current)
        autoDrawRef.current = null
      }
    }

    return () => {
      if (autoDrawRef.current) {
        clearInterval(autoDrawRef.current)
      }
    }
  }, [gameState.isAutoDrawing, gameState.gameActive, gameState.drawSpeed])

  const drawSingleNumber = useCallback(() => {
    setGameState((prevState) => {
      const newState = cloneGameState(prevState)
      drawNumber(newState)
      return newState
    })
  }, [])

  const handleReset = useCallback(() => {
    setGameState((prevState) => {
      const newState = cloneGameState(prevState)
      resetGame(newState)
      return newState
    })
  }, [])

  const handleNewGame = useCallback(
    (newCardCount: number = cardCount) => {
      setGameState(createGameState(newCardCount, gameState.drawSpeed))
    },
    [cardCount, gameState.drawSpeed],
  )

  const toggleAutoDraw = useCallback(() => {
    setGameState((prevState) => {
      const newState = cloneGameState(prevState)
      if (newState.isAutoDrawing) {
        stopAutoDraw(newState)
      } else {
        startAutoDraw(newState)
      }
      return newState
    })
  }, [])

  const changeDrawSpeed = useCallback((speed: number) => {
    setGameState((prevState) => {
      const newState = cloneGameState(prevState)
      setDrawSpeed(newState, speed)
      return newState
    })
  }, [])

  const stopGame = useCallback(() => {
    setGameState((prevState) => {
      const newState = cloneGameState(prevState)
      endGame(newState)
      return newState
    })
  }, [])

  const getWinnerChecks = useCallback(
    (cardId: string) => getWinnerCheck(gameState, cardId),
    [gameState],
  )

  const getHintPositions = useCallback(
    (cardId: string) => getCardHint(gameState, cardId),
    [gameState],
  )

  return {
    gameState,
    drawSingleNumber,
    handleReset,
    handleNewGame,
    toggleAutoDraw,
    changeDrawSpeed,
    stopGame,
    getWinnerChecks,
    getHintPositions,
  }
}
