import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  applyMove,
  canPlayerMove,
  CPU_DELAY_MS,
  createInitialBoard,
  evaluateGameResult,
  getValidMoves,
  otherPlayer,
  selectMove,
  type Board,
  type Difficulty,
  type GameMode,
  type GameResult,
  type Move,
  type Player,
  type Position,
} from '@/domain'
import { load, save } from '../storageService'

const MODE_KEY = 'reversi-mode'
const DIFFICULTY_KEY = 'reversi-difficulty'

interface HistoryEntry {
  board: Board
  currentPlayer: Player
  result: GameResult
  moveCount: number
  passMessage: string | null
}

export interface UseReversiGameReturn {
  board: Board
  currentPlayer: Player
  validMoves: Move[]
  mode: GameMode
  difficulty: Difficulty
  result: GameResult
  moveCount: number
  passMessage: string | null
  cpuThinking: boolean
  isPlayerTurn: boolean
  playMove: (position: Position) => boolean
  passTurn: () => boolean
  undo: () => void
  resetGame: () => void
  setMode: (mode: GameMode) => void
  setDifficulty: (difficulty: Difficulty) => void
}

const labelForPlayer = (player: Player): string => (player === 'black' ? 'Black' : 'White')

export function useReversiGame(): UseReversiGameReturn {
  const [board, setBoard] = useState<Board>(() => createInitialBoard())
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black')
  const [mode, setModeState] = useState<GameMode>(() => load(MODE_KEY, 'pvc'))
  const [difficulty, setDifficultyState] = useState<Difficulty>(() =>
    load(DIFFICULTY_KEY, 'medium'),
  )
  const [result, setResult] = useState<GameResult>({ status: 'playing' })
  const [moveCount, setMoveCount] = useState(0)
  const [passMessage, setPassMessage] = useState<string | null>(null)
  const [cpuThinking, setCpuThinking] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])

  const cpuTimerRef = useRef<number | null>(null)

  const validMoves = useMemo(() => {
    if (result.status !== 'playing') {
      return []
    }
    return getValidMoves(board, currentPlayer)
  }, [board, currentPlayer, result.status])

  const isPlayerTurn = mode === 'pvp' || currentPlayer === 'black'

  const resetGame = useCallback(() => {
    setBoard(createInitialBoard())
    setCurrentPlayer('black')
    setResult({ status: 'playing' })
    setMoveCount(0)
    setPassMessage(null)
    setCpuThinking(false)
    setHistory([])
    if (cpuTimerRef.current !== null) {
      window.clearTimeout(cpuTimerRef.current)
      cpuTimerRef.current = null
    }
  }, [])

  const setMode = useCallback((nextMode: GameMode) => {
    setModeState(nextMode)
    save(MODE_KEY, nextMode)
  }, [])

  const setDifficulty = useCallback((nextDifficulty: Difficulty) => {
    setDifficultyState(nextDifficulty)
    save(DIFFICULTY_KEY, nextDifficulty)
  }, [])

  const pushHistory = useCallback(() => {
    setHistory((prev) => [
      ...prev,
      {
        board,
        currentPlayer,
        result,
        moveCount,
        passMessage,
      },
    ])
  }, [board, currentPlayer, result, moveCount, passMessage])

  const playMove = useCallback(
    (position: Position): boolean => {
      if (result.status !== 'playing') {
        return false
      }

      const move = validMoves.find(
        (candidate) =>
          candidate.position.row === position.row && candidate.position.col === position.col,
      )

      if (!move) {
        return false
      }

      pushHistory()
      const nextBoard = applyMove(board, move, currentPlayer)
      const nextResult = evaluateGameResult(nextBoard)

      setBoard(nextBoard)
      setPassMessage(null)
      setMoveCount((prev) => prev + 1)
      setResult(nextResult)
      if (nextResult.status === 'playing') {
        setCurrentPlayer(otherPlayer(currentPlayer))
      }

      return true
    },
    [board, currentPlayer, pushHistory, result.status, validMoves],
  )

  const passTurn = useCallback((): boolean => {
    if (result.status !== 'playing') {
      return false
    }
    if (validMoves.length > 0) {
      return false
    }

    const opponent = otherPlayer(currentPlayer)
    if (!canPlayerMove(board, opponent)) {
      setResult(evaluateGameResult(board))
      return true
    }

    pushHistory()
    setCurrentPlayer(opponent)
    setPassMessage(`${labelForPlayer(currentPlayer)} has no valid moves and must pass.`)
    return true
  }, [board, currentPlayer, pushHistory, result.status, validMoves.length])

  const undo = useCallback(() => {
    if (history.length === 0) {
      return
    }

    const rollback = mode === 'pvc' ? Math.min(2, history.length) : 1
    const snapshot = history[history.length - rollback]
    if (!snapshot) {
      return
    }

    setBoard(snapshot.board)
    setCurrentPlayer(snapshot.currentPlayer)
    setResult(snapshot.result)
    setMoveCount(snapshot.moveCount)
    setPassMessage(snapshot.passMessage)
    setCpuThinking(false)
    setHistory((prev) => prev.slice(0, -rollback))
  }, [history, mode])

  useEffect(() => {
    if (result.status !== 'playing') {
      return
    }
    if (validMoves.length > 0) {
      return
    }
    void passTurn()
  }, [passTurn, result.status, validMoves.length])

  useEffect(() => {
    if (mode !== 'pvc' || currentPlayer !== 'white' || result.status !== 'playing') {
      return
    }
    if (validMoves.length === 0) {
      return
    }

    setCpuThinking(true)
    cpuTimerRef.current = window.setTimeout(() => {
      const selectedMove = selectMove(board, 'white', difficulty)
      if (selectedMove) {
        void playMove(selectedMove.position)
      }
      setCpuThinking(false)
      cpuTimerRef.current = null
    }, CPU_DELAY_MS)

    return () => {
      if (cpuTimerRef.current !== null) {
        window.clearTimeout(cpuTimerRef.current)
        cpuTimerRef.current = null
      }
      setCpuThinking(false)
    }
  }, [board, currentPlayer, difficulty, mode, playMove, result.status, validMoves.length])

  return {
    board,
    currentPlayer,
    validMoves,
    mode,
    difficulty,
    result,
    moveCount,
    passMessage,
    cpuThinking,
    isPlayerTurn,
    playMove,
    passTurn,
    undo,
    resetGame,
    setMode,
    setDifficulty,
  }
}
