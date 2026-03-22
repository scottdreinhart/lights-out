import {
  applyMove,
  calculateScore,
  canRollOneDie,
  createBoard,
  getValidMoves,
  isBoardShut,
  setDiceSum,
  toggleTileSelection,
  determineWinner,
} from '@/domain'
import type { GameAction, GameState, Tile } from '@/domain'
import { createContext, useContext, useReducer, type ReactNode } from 'react'

const GameContext = createContext<
  | {
      state: GameState
      dispatch: (action: GameAction) => void
      rollDice: (useOneDie?: boolean) => { dice1: number; dice2: number | null }
      selectTile: (tile: Tile) => void
      deselectTile: (tile: Tile) => void
      submitMove: () => boolean
      endTurn: () => void
      resetGame: () => void
      getValidMoves: (sum: number) => Tile[][]
      getPlayerScore: (playerId: string) => number
      canUseOneDie: () => boolean
    }
  | undefined
>(undefined)

const initialGameState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  board: createBoard(),
  gamePhase: 'setup',
  winner: null,
  history: [],
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INITIALIZE_GAME': {
      return {
        ...state,
        players: action.players,
        gamePhase: 'rolling',
        currentPlayerIndex: 0,
        board: createBoard(),
        winner: null,
      }
    }

    case 'ROLL_DICE': {
      const diceSum = action.dice1 + (action.dice2 ?? 0)
      const updatedBoard = setDiceSum(state.board, diceSum)
      const validMoves = getValidMoves(updatedBoard, diceSum)

      // Auto-end turn when no valid moves exist
      if (validMoves.length === 0) {
        const currentPlayer = state.players[state.currentPlayerIndex]
        const currentScore = calculateScore(updatedBoard)
        const updatedPlayers = state.players.map((p) =>
          p.id === currentPlayer.id ? { ...p, score: currentScore } : p,
        )
        const nextPlayerIndex = state.currentPlayerIndex + 1

        if (nextPlayerIndex >= updatedPlayers.length) {
          const finalWinner = determineWinner(updatedPlayers)
          return {
            ...state,
            board: updatedBoard,
            players: updatedPlayers,
            gamePhase: 'gameOver',
            winner: finalWinner,
            history: [...state.history, action],
          }
        }

        return {
          ...state,
          board: createBoard(),
          players: updatedPlayers,
          currentPlayerIndex: nextPlayerIndex,
          gamePhase: 'rolling',
          history: [...state.history, action],
        }
      }

      return {
        ...state,
        board: updatedBoard,
        gamePhase: 'choosing',
        history: [...state.history, action],
      }
    }

    case 'SELECT_TILE': {
      return {
        ...state,
        board: toggleTileSelection(state.board, action.tile),
      }
    }

    case 'DESELECT_TILE': {
      return {
        ...state,
        board: toggleTileSelection(state.board, action.tile),
      }
    }

    case 'SUBMIT_MOVE': {
      const newBoard = applyMove(state.board, action.selectedTiles)

      if (isBoardShut(newBoard)) {
        const winner = state.players[state.currentPlayerIndex]
        return {
          ...state,
          board: newBoard,
          gamePhase: 'gameOver',
          winner,
          players: state.players.map((p) => (p.id === winner.id ? { ...p, score: 0 } : p)),
          history: [...state.history, action],
        }
      }

      return {
        ...state,
        board: newBoard,
        gamePhase: 'rolling',
        history: [...state.history, action],
      }
    }

    case 'END_TURN': {
      const currentPlayer = state.players[state.currentPlayerIndex]
      const currentScore = calculateScore(state.board)

      const updatedPlayers = state.players.map((p) =>
        p.id === currentPlayer.id ? { ...p, score: currentScore } : p,
      )

      const nextPlayerIndex = state.currentPlayerIndex + 1

      if (nextPlayerIndex >= updatedPlayers.length) {
        const winner = determineWinner(updatedPlayers)
        return {
          ...state,
          players: updatedPlayers,
          gamePhase: 'gameOver',
          winner,
          history: [...state.history, action],
        }
      }

      return {
        ...state,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        board: createBoard(),
        gamePhase: 'rolling',
        history: [...state.history, action],
      }
    }

    case 'RESET_GAME': {
      return {
        ...initialGameState,
        players: state.players.map((p) => ({ ...p, score: 0 })),
        gamePhase: 'rolling',
      }
    }

    default:
      return state
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)

  const rollDice = (useOneDie = false) => {
    const dice1 = Math.floor(Math.random() * 6) + 1
    const dice2 = useOneDie ? null : Math.floor(Math.random() * 6) + 1
    dispatch({ type: 'ROLL_DICE', dice1, dice2 })
    return { dice1, dice2 }
  }

  const canUseOneDie = () => canRollOneDie(state.board)

  const selectTile = (tile: Tile) => {
    dispatch({ type: 'SELECT_TILE', tile })
  }

  const deselectTile = (tile: Tile) => {
    dispatch({ type: 'DESELECT_TILE', tile })
  }

  const submitMove = (): boolean => {
    const selectedTiles = state.board.selectedTiles
    if (selectedTiles.length === 0) {
      return false
    }

    const sum = selectedTiles.reduce((acc, tile) => acc + tile, 0)
    if (sum !== state.board.diceSum) {
      return false
    }

    dispatch({ type: 'SUBMIT_MOVE', selectedTiles })
    return true
  }

  const endTurn = () => {
    dispatch({ type: 'END_TURN' })
  }

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' })
  }

  const getValidMovesHelper = (sum: number): Tile[][] => {
    return getValidMoves(state.board, sum)
  }

  const getPlayerScore = (playerId: string): number => {
    const player = state.players.find((p) => p.id === playerId)
    return player?.score ?? 0
  }

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        rollDice,
        selectTile,
        deselectTile,
        submitMove,
        endTurn,
        resetGame,
        getValidMoves: getValidMovesHelper,
        getPlayerScore,
        canUseOneDie,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGameContext() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider')
  }
  return context
}
