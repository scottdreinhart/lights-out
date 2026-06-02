import { useCallback, useReducer } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Player = 'human' | 'cpu'
export type GamePhase = 'idle' | 'playing' | 'game-over'

export interface MoncholaBoard {
  cells: number[]
  size: number
}

export interface MoncholaGameState {
  phase: GamePhase
  board: MoncholaBoard
  currentPlayer: Player
  humanScore: number
  cpuScore: number
  winner: Player | 'draw' | null
  turnCount: number
}

function createBoard(size = 9): MoncholaBoard {
  return { cells: Array(size).fill(0), size }
}

function createInitialState(): MoncholaGameState {
  return {
    phase: 'idle',
    board: createBoard(),
    currentPlayer: 'human',
    humanScore: 0,
    cpuScore: 0,
    winner: null,
    turnCount: 0,
  }
}

function isPlayableCell(cells: number[], cellIndex: number): boolean {
  return Number.isInteger(cellIndex) && cellIndex >= 0 && cellIndex < cells.length
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

type GameAction =
  | { type: 'START' }
  | { type: 'MAKE_MOVE'; cellIndex: number }
  | { type: 'CPU_MOVE' }
  | { type: 'RESET' }

function checkWinner(state: MoncholaGameState): Player | 'draw' | null {
  // Monchola: player with most points when board is full wins
  if (state.board.cells.every((c) => c !== 0)) {
    if (state.humanScore > state.cpuScore) {
      return 'human'
    }
    if (state.cpuScore > state.humanScore) {
      return 'cpu'
    }
    return 'draw'
  }
  return null
}

function reducer(state: MoncholaGameState, action: GameAction): MoncholaGameState {
  switch (action.type) {
    case 'START':
      return { ...createInitialState(), phase: 'playing' }

    case 'MAKE_MOVE': {
      if (state.phase !== 'playing' || state.currentPlayer !== 'human') {
        return state
      }
      if (!isPlayableCell(state.board.cells, action.cellIndex)) {
        return state
      }
      if (state.board.cells.slice(action.cellIndex, action.cellIndex + 1)[0] !== 0) {
        return state
      }

      const newCells = [...state.board.cells]
      newCells.splice(action.cellIndex, 1, 1) // human mark
      const newHumanScore = state.humanScore + 1
      const newState: MoncholaGameState = {
        ...state,
        board: { ...state.board, cells: newCells },
        humanScore: newHumanScore,
        currentPlayer: 'cpu',
        turnCount: state.turnCount + 1,
      }
      const winner = checkWinner(newState)
      return { ...newState, winner, phase: winner ? 'game-over' : 'playing' }
    }

    case 'CPU_MOVE': {
      if (state.phase !== 'playing' || state.currentPlayer !== 'cpu') {
        return state
      }
      const emptyCells = state.board.cells.map((v, i) => (v === 0 ? i : -1)).filter((i) => i !== -1)
      if (emptyCells.length === 0) {
        return state
      }

      const pick = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      if (!isPlayableCell(state.board.cells, pick)) {
        return state
      }
      const newCells = [...state.board.cells]
      newCells.splice(pick, 1, 2) // cpu mark
      const newCpuScore = state.cpuScore + 1
      const newState: MoncholaGameState = {
        ...state,
        board: { ...state.board, cells: newCells },
        cpuScore: newCpuScore,
        currentPlayer: 'human',
        turnCount: state.turnCount + 1,
      }
      const winner = checkWinner(newState)
      return { ...newState, winner, phase: winner ? 'game-over' : 'playing' }
    }

    case 'RESET':
      return createInitialState()

    default:
      return state
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export interface UseGameReturn {
  gameState: MoncholaGameState
  isGameOver: boolean
  start: () => void
  makeMove: (cellIndex: number) => void
  cpuMove: () => void
  reset: () => void
}

export function useGame(): UseGameReturn {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)

  const start = useCallback(() => dispatch({ type: 'START' }), [])
  const makeMove = useCallback(
    (cellIndex: number) => dispatch({ type: 'MAKE_MOVE', cellIndex }),
    [],
  )
  const cpuMove = useCallback(() => dispatch({ type: 'CPU_MOVE' }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  return {
    gameState: state,
    isGameOver: state.phase === 'game-over',
    start,
    makeMove,
    cpuMove,
    reset,
  }
}
