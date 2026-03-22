import { useCallback } from 'react'

import type { Board, Difficulty, GameState, Score, Token } from '@/domain'
import useCpuPlayer from './useCpuPlayer.ts'
import useGameBoard, { ACTIONS } from './useGameBoard.ts'
import useGameStats from './useGameStats.ts'

export interface UseTicTacToeReturn {
  board: Board
  turn: Token
  focusedIndex: number
  gameState: GameState
  status: string
  score: Score
  difficulty: Difficulty
  streak: number
  bestTime: number | null
  moveHistory: Board[]
  currentMoveIndex: number
  canUndo: boolean
  canRedo: boolean
  handleHumanSelect: (index: number) => void
  handleFocusChange: (index: number) => void
  handleReset: () => void
  handleSetDifficulty: (level: Difficulty) => void
  handleUndo: () => void
  handleRedo: () => void
  setFirstPlayer: (token: Token) => void
}

export const useTicTacToe = (): UseTicTacToeReturn => {
  const {
    board,
    turn,
    focusedIndex,
    gameState,
    status,
    gameStartTime,
    moveHistory,
    currentMoveIndex,
    canUndo,
    canRedo,
    handleHumanSelect,
    handleFocusChange,
    handleReset: boardReset,
    handleUndo,
    handleRedo,
    setFirstPlayer,
    dispatch,
  } = useGameBoard()

  const { score, streak, bestTime } = useGameStats(gameState, currentMoveIndex, gameStartTime)

  const onCpuMove = useCallback(
    (index: number) => {
      dispatch({ type: ACTIONS.CPU_MOVE, payload: { index } })
    },
    [dispatch],
  )

  const { difficulty, handleSetDifficulty, cancelPendingMove } = useCpuPlayer({
    turn,
    board,
    isGameOver: gameState.isOver,
    onCpuMove,
  })

  const handleReset = useCallback(() => {
    cancelPendingMove()
    boardReset()
  }, [cancelPendingMove, boardReset])

  return {
    board,
    turn,
    focusedIndex,
    gameState,
    status,
    score,
    difficulty,
    streak,
    bestTime,
    moveHistory,
    currentMoveIndex,
    canUndo,
    canRedo,
    handleHumanSelect,
    handleFocusChange,
    handleReset,
    handleSetDifficulty,
    handleUndo,
    handleRedo,
    setFirstPlayer,
  }
}
