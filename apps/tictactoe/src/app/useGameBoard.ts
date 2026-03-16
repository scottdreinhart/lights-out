import { useCallback, useEffect, useMemo, useReducer } from 'react'

import { applyMove, createEmptyBoard, isCellEmpty } from '../domain/board.ts'
import { TOKENS } from '../domain/constants.ts'
import { getGameState } from '../domain/rules.ts'
import type { Board, GameState, Token } from '../domain/types.ts'

// ── Actions ──────────────────────────────────────────────────────────────────

export const ACTIONS = {
  HUMAN_MOVE: 'HUMAN_MOVE',
  CPU_MOVE: 'CPU_MOVE',
  SET_FOCUSED_INDEX: 'SET_FOCUSED_INDEX',
  RESET: 'RESET',
  UNDO: 'UNDO',
  REDO: 'REDO',
  SET_GAME_START_TIME: 'SET_GAME_START_TIME',
  SET_FIRST_PLAYER: 'SET_FIRST_PLAYER',
} as const

type ActionType = (typeof ACTIONS)[keyof typeof ACTIONS]

interface GameAction {
  type: ActionType
  payload?: { index: number } | number | Token | null
}

// ── State ────────────────────────────────────────────────────────────────────

interface GameBoardState {
  board: Board
  turn: Token
  focusedIndex: number
  history: Board[]
  historyIndex: number
  gameStartTime: number | null
}

// ── Initial state factory ────────────────────────────────────────────────────

const createInitialState = (): GameBoardState => ({
  board: createEmptyBoard(),
  turn: TOKENS.HUMAN,
  focusedIndex: 4,
  history: [createEmptyBoard()],
  historyIndex: 0,
  gameStartTime: null,
})

// ── Reducer ──────────────────────────────────────────────────────────────────

const gameReducer = (state: GameBoardState, action: GameAction): GameBoardState => {
  switch (action.type) {
    case ACTIONS.HUMAN_MOVE: {
      const { index } = action.payload as { index: number }
      if (state.turn !== TOKENS.HUMAN) {
        return state
      }
      if (!isCellEmpty(state.board, index)) {
        return state
      }

      const board = applyMove(state.board, index, TOKENS.HUMAN)
      const { isOver } = getGameState(board)

      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(board)

      return {
        ...state,
        board,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        turn: isOver ? TOKENS.HUMAN : TOKENS.CPU,
      }
    }

    case ACTIONS.CPU_MOVE: {
      if (state.turn !== TOKENS.CPU) {
        return state
      }
      const { index } = action.payload as { index: number }
      const board = applyMove(state.board, index, TOKENS.CPU)

      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(board)

      return {
        ...state,
        board,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        turn: TOKENS.HUMAN,
      }
    }

    case ACTIONS.SET_FOCUSED_INDEX: {
      const idx = action.payload as number
      if (idx < 0 || idx >= 9) {
        return state
      }
      return { ...state, focusedIndex: idx }
    }

    case ACTIONS.UNDO: {
      if (state.historyIndex <= 0) {
        return state
      }
      const newIndex = state.historyIndex - 1
      const board = state.history[newIndex]
      if (!board) {
        return state
      }
      return {
        ...state,
        board,
        historyIndex: newIndex,
        turn: TOKENS.HUMAN,
      }
    }

    case ACTIONS.REDO: {
      if (state.historyIndex >= state.history.length - 1) {
        return state
      }
      const newIndex = state.historyIndex + 1
      const board = state.history[newIndex]
      if (!board) {
        return state
      }
      return {
        ...state,
        board,
        historyIndex: newIndex,
        turn: TOKENS.HUMAN,
      }
    }

    case ACTIONS.SET_GAME_START_TIME: {
      if (state.gameStartTime !== null) {
        return state
      }
      return { ...state, gameStartTime: action.payload as number }
    }

    case ACTIONS.RESET:
      return createInitialState()

    case ACTIONS.SET_FIRST_PLAYER: {
      if (state.history.length > 1) {
        return state
      }
      return { ...state, turn: action.payload as Token }
    }

    default:
      return state
  }
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export interface UseGameBoardReturn {
  board: Board
  turn: Token
  focusedIndex: number
  gameState: GameState
  status: string
  gameStartTime: number | null
  moveHistory: Board[]
  currentMoveIndex: number
  canUndo: boolean
  canRedo: boolean
  handleHumanSelect: (index: number) => void
  handleFocusChange: (index: number) => void
  handleReset: () => void
  handleUndo: () => void
  handleRedo: () => void
  setFirstPlayer: (token: Token) => void
  dispatch: React.Dispatch<GameAction>
}

const useGameBoard = (): UseGameBoardReturn => {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState)

  const gameState = useMemo(() => getGameState(state.board), [state.board])

  useEffect(() => {
    if (state.gameStartTime === null && state.history.length > 1) {
      dispatch({ type: ACTIONS.SET_GAME_START_TIME, payload: Date.now() })
    }
  }, [state.history.length, state.gameStartTime])

  const status = useMemo(() => {
    if (gameState.winner) {
      return `${gameState.winner} wins!`
    }
    if (gameState.isDraw) {
      return 'Draw!'
    }
    return `${state.turn}'s turn`
  }, [gameState, state.turn])

  const handleHumanSelect = useCallback((index: number) => {
    dispatch({ type: ACTIONS.HUMAN_MOVE, payload: { index } })
  }, [])

  const handleFocusChange = useCallback((index: number) => {
    dispatch({ type: ACTIONS.SET_FOCUSED_INDEX, payload: index })
  }, [])

  const handleReset = useCallback(() => {
    dispatch({ type: ACTIONS.RESET })
  }, [])

  const handleUndo = useCallback(() => {
    dispatch({ type: ACTIONS.UNDO })
  }, [])

  const handleRedo = useCallback(() => {
    dispatch({ type: ACTIONS.REDO })
  }, [])

  const setFirstPlayer = useCallback((token: Token) => {
    dispatch({ type: ACTIONS.SET_FIRST_PLAYER, payload: token })
  }, [])

  return {
    board: state.board,
    turn: state.turn,
    focusedIndex: state.focusedIndex,
    gameState,
    status,
    gameStartTime: state.gameStartTime,
    moveHistory: state.history,
    currentMoveIndex: state.historyIndex,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    handleHumanSelect,
    handleFocusChange,
    handleReset,
    handleUndo,
    handleRedo,
    setFirstPlayer,
    dispatch,
  }
}

export default useGameBoard
