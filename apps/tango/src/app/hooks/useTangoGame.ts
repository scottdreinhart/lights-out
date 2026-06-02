/**
 * Tango App Layer
 * React hooks for Tango slide puzzle game
 */

import { useCallback, useMemo, useState } from 'react'

import type { Difficulty, Position, TangoState } from '../domain'
import {
  createTangoGameState,
  generateHint,
  makeMove,
  solvePuzzleAStar,
  updateGameState,
} from '../domain'

export const useTangoGame = (difficulty: Difficulty = 'medium') => {
  const [gameState, setGameState] = useState<TangoState>(() =>
    createTangoGameState(difficulty),
  )

  const makeTileMove = useCallback(
    (position: Position) => {
      const newBoard = makeMove(gameState.board, position)
      const newMoveCount = gameState.moveCount + 1
      const newState = updateGameState(gameState, newBoard, newMoveCount)
      setGameState(newState)
    },
    [gameState],
  )

  const resetGame = useCallback(() => {
    setGameState(createTangoGameState(difficulty))
  }, [difficulty])

  const newPuzzle = useCallback(() => {
    setGameState(createTangoGameState(difficulty))
  }, [difficulty])

  const getHint = useCallback((): Position | null => {
    return generateHint(gameState.board)
  }, [gameState.board])

  const solvePuzzle = useCallback(() => {
    const solution = solvePuzzleAStar(gameState.board)
    if (solution && solution.length > 0) {
      const firstMove = solution[0]
      makeTileMove(firstMove)
    }
  }, [gameState.board, makeTileMove])

  const solveCompletely = useCallback(() => {
    const solution = solvePuzzleAStar(gameState.board)
    if (solution) {
      let currentBoard = gameState.board
      let currentMoveCount = gameState.moveCount

      for (const move of solution) {
        currentBoard = makeMove(currentBoard, move)
        currentMoveCount++
      }

      const solvedState = updateGameState(gameState, currentBoard, currentMoveCount)
      setGameState(solvedState)
    }
  }, [gameState])

  const gameTime = useMemo(() => {
    const endTime = gameState.endTime || Date.now()
    return Math.floor((endTime - gameState.startTime) / 1000)
  }, [gameState.startTime, gameState.endTime])

  const canMove = useCallback(
    (position: Position): boolean => {
      return makeMove(gameState.board, position) !== gameState.board
    },
    [gameState.board],
  )

  return {
    gameState,
    makeTileMove,
    canMove,
    resetGame,
    newPuzzle,
    getHint,
    solvePuzzle,
    solveCompletely,
    gameTime,
    isSolved: gameState.isSolved,
    moveCount: gameState.moveCount,
  }
}
