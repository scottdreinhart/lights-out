/**
 * Crossclimb App Layer
 * React hooks for game state management
 */

import { useCallback, useEffect, useState } from 'react'
import type { CrossclimbState, Difficulty, NodeId, SearchResult } from '../domain'
import { createInitialState, findPathAStar, getHintMove, makeMove, resetGame } from '../domain'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

export const useCrossclimbGame = (difficulty: Difficulty) => {
  const [gameState, setGameState] = useState<CrossclimbState>(() =>
    createInitialState(difficulty, CANVAS_WIDTH, CANVAS_HEIGHT),
  )
  const [gameTime, setGameTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [hintNode, setHintNode] = useState<NodeId | null>(null)
  const [isSolving, setIsSolving] = useState(false)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerRunning && !gameState.isComplete) {
      interval = setInterval(() => {
        setGameTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, gameState.isComplete])

  // Start timer when first move is made
  useEffect(() => {
    if (gameState.moves > 0 && !isTimerRunning && !gameState.isComplete) {
      setIsTimerRunning(true)
    }
  }, [gameState.moves, isTimerRunning, gameState.isComplete])

  const moveToNode = useCallback((nodeId: NodeId) => {
    setGameState((prevState) => {
      const newState = makeMove(prevState, nodeId)
      if (newState.moves !== prevState.moves) {
        setHintNode(null) // Clear hint after successful move
      }
      return newState
    })
  }, [])

  const newPuzzle = useCallback(() => {
    setGameState(createInitialState(difficulty, CANVAS_WIDTH, CANVAS_HEIGHT))
    setGameTime(0)
    setIsTimerRunning(false)
    setHintNode(null)
    setIsSolving(false)
  }, [difficulty])

  const resetCurrentGame = useCallback(() => {
    setGameState((prevState) => resetGame(prevState))
    setGameTime(0)
    setIsTimerRunning(false)
    setHintNode(null)
    setIsSolving(false)
  }, [])

  const changeDifficulty = useCallback((newDifficulty: Difficulty) => {
    setGameState(createInitialState(newDifficulty, CANVAS_WIDTH, CANVAS_HEIGHT))
    setGameTime(0)
    setIsTimerRunning(false)
    setHintNode(null)
    setIsSolving(false)
  }, [])

  const getHint = useCallback(() => {
    const hint = getHintMove(gameState.currentPath, gameState.graph)
    if (hint) {
      setHintNode(hint)
      // Auto-clear hint after 3 seconds
      setTimeout(() => setHintNode(null), 3000)
    }
    return hint
  }, [gameState.currentPath, gameState.graph])

  const solveCompletely = useCallback(async () => {
    setIsSolving(true)
    try {
      // Use A* to find optimal solution
      const result: SearchResult = findPathAStar(gameState.graph)

      if (result.found && result.path) {
        // Animate the solution step by step
        for (let i = 1; i < result.path.nodes.length; i++) {
          const nodeId = result.path.nodes[i]
          await new Promise((resolve) => setTimeout(resolve, 500)) // 500ms delay between moves

          setGameState((prevState) => {
            const newState = makeMove(prevState, nodeId)
            return newState
          })
        }
      }
    } finally {
      setIsSolving(false)
    }
  }, [gameState.graph])

  const canMoveToNode = useCallback(
    (nodeId: NodeId): boolean => {
      const currentNodeId = gameState.currentPath[gameState.currentPath.length - 1]
      return gameState.graph.nodes.get(currentNodeId)?.connections.includes(nodeId) ?? false
    },
    [gameState.currentPath, gameState.graph.nodes],
  )

  return {
    gameState,
    gameTime,
    hintNode,
    isSolving,
    moveToNode,
    canMoveToNode,
    newPuzzle,
    resetCurrentGame,
    changeDifficulty,
    getHint,
    solveCompletely,
  }
}
