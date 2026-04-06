/**
 * Speed Bingo game hook with auto-drawing functionality.
 */

import {
  createGameState,
  DEFAULT_DRAW_SPEED,
  drawNumber,
  endGame,
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

  const autoDrawRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-drawing effect
  useEffect(() => {
    if (gameState.isAutoDrawing && gameState.gameActive) {
      autoDrawRef.current = setInterval(() => {
        setGameState((prevState) => {
          const newState = { ...prevState }
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
      const newState = { ...prevState }
      drawNumber(newState)
      return newState
    })
  }, [])

  const handleReset = useCallback(() => {
    setGameState((prevState) => {
      const newState = { ...prevState }
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
      const newState = { ...prevState }
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
      const newState = { ...prevState }
      setDrawSpeed(newState, speed)
      return newState
    })
  }, [])

  const stopGame = useCallback(() => {
    setGameState((prevState) => {
      const newState = { ...prevState }
      endGame(newState)
      return newState
    })
  }, [])

  return {
    gameState,
    drawSingleNumber,
    handleReset,
    handleNewGame,
    toggleAutoDraw,
    changeDrawSpeed,
    stopGame,
  }
}
