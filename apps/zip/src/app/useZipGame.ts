/**
 * Zip App Layer
 * React hooks and context for Zip maze game
 */

import { useState, useCallback, useEffect } from 'react'
import type {
  ZipState,
  Difficulty,
  Direction,
  Position,
} from '../domain'
import {
  createInitialState,
  makeMove,
  isMazeSolved,
  resetGame,
  getHintMove,
  findOptimalPath,
  generateSolvableMaze,
} from '../domain'

export const useZipGame = (difficulty: Difficulty = 'medium') => {
  const [gameState, setGameState] = useState<ZipState>(() =>
    generateSolvableMaze(difficulty)
  )
  const [gameTime, setGameTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [moveCount, setMoveCount] = useState(0)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerRunning && !gameState.isComplete) {
      interval = setInterval(() => {
        setGameTime(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, gameState.isComplete])

  // Start timer when first move is made
  useEffect(() => {
    if (moveCount > 0 && !isTimerRunning && !gameState.isComplete) {
      setIsTimerRunning(true)
    }
  }, [moveCount, isTimerRunning, gameState.isComplete])

  const makePlayerMove = useCallback((direction: Direction) => {
    if (gameState.isComplete) return

    setGameState(prevState => {
      const newState = makeMove(prevState, direction)
      if (newState.moves.length > prevState.moves.length) {
        setMoveCount(prev => prev + 1)
      }
      return newState
    })
  }, [gameState.isComplete])

  const canMove = useCallback((direction: Direction): boolean => {
    const currentPos = gameState.playerPosition
    const delta = { up: { row: -1, col: 0 }, down: { row: 1, col: 0 }, left: { row: 0, col: -1 }, right: { row: 0, col: 1 } }[direction]
    const newPos: Position = {
      row: currentPos.row + delta.row,
      col: currentPos.col + delta.col,
    }

    return newPos.row >= 0 && newPos.row < gameState.maze.length &&
           newPos.col >= 0 && newPos.col < gameState.maze[0].length &&
           gameState.maze[newPos.row][newPos.col].type !== 'wall'
  }, [gameState])

  const newPuzzle = useCallback(() => {
    setGameState(generateSolvableMaze(difficulty))
    setGameTime(0)
    setIsTimerRunning(false)
    setMoveCount(0)
  }, [difficulty])

  const resetCurrentGame = useCallback(() => {
    setGameState(prevState => resetGame(prevState))
    setGameTime(0)
    setIsTimerRunning(false)
    setMoveCount(0)
  }, [])

  const getHint = useCallback((): Position | null => {
    return getHintMove(gameState)
  }, [gameState])

  const solveCompletely = useCallback(() => {
    const solution = findOptimalPath(gameState)
    if (solution) {
      // Apply all moves from the solution
      let currentState = { ...gameState }
      for (const move of solution.moves) {
        currentState = makeMove(currentState, move.direction)
      }
      setGameState(currentState)
      setMoveCount(prev => prev + solution.moves.length)
    }
  }, [gameState])

  const changeDifficulty = useCallback((newDifficulty: Difficulty) => {
    setGameState(generateSolvableMaze(newDifficulty))
    setGameTime(0)
    setIsTimerRunning(false)
    setMoveCount(0)
  }, [])

  return {
    gameState,
    gameTime,
    moveCount,
    isTimerRunning,
    makePlayerMove,
    canMove,
    newPuzzle,
    resetCurrentGame,
    getHint,
    solveCompletely,
    changeDifficulty,
  }
}