import { useCallback, useEffect, useRef, useState } from 'react'

import {
  allShipsSunk,
  createBoard,
  DEFAULT_STATS,
  DIFFICULTY_PRESETS,
  fireAt,
  getCpuMove,
  placeShip,
  placeShipsRandomly,
  SHIP_DEFS,
  type Difficulty,
  type GameState,
  type GameStats,
  type Orientation,
} from '@/domain'

function getPlacementMessage(index: number): string {
  switch (index) {
    case 0:
      return 'Place your Carrier'
    case 1:
      return 'Place your Battleship'
    case 2:
      return 'Place your Cruiser'
    case 3:
      return 'Place your Submarine'
    case 4:
      return 'Place your Destroyer'
    default:
      return 'Place your next ship'
  }
}

const createInitialState = (difficulty: Difficulty, stats: GameStats): GameState => ({
  phase: 'placement',
  turn: 'player',
  board: createBoard(),
  winner: null,
  placementShipIndex: 0,
  placementOrientation: 'horizontal',
  message: getPlacementMessage(0),
  difficulty,
  startTime: null,
  endTime: null,
  stats,
})

export interface UseGameReturn {
  state: GameState
  placeCurrentShip: (row: number, col: number) => void
  toggleOrientation: () => void
  fire: (row: number, col: number) => void
  newGame: (difficulty?: Difficulty) => void
}

export const useGame = (): UseGameReturn => {
  const [state, setState] = useState<GameState>(() => createInitialState('medium', DEFAULT_STATS))
  const previousWinner = useRef<GameState['winner']>(null)

  const toggleOrientation = useCallback(() => {
    setState((previous) => {
      if (previous.phase !== 'placement') {
        return previous
      }

      const nextOrientation: Orientation =
        previous.placementOrientation === 'horizontal' ? 'vertical' : 'horizontal'

      return {
        ...previous,
        placementOrientation: nextOrientation,
      }
    })
  }, [])

  const placeCurrentShip = useCallback((row: number, col: number) => {
    setState((previous) => {
      if (previous.phase !== 'placement') {
        return previous
      }

      const shipDef = SHIP_DEFS[previous.placementShipIndex]
      if (!shipDef) {
        return previous
      }

      const placedBoard = placeShip(
        previous.board,
        shipDef,
        { row, col },
        previous.placementOrientation,
        'player',
      )

      if (!placedBoard) {
        return { ...previous, message: `Can't place ${shipDef.name} there` }
      }

      const nextShipIndex = previous.placementShipIndex + 1
      const allShipsPlaced = nextShipIndex >= SHIP_DEFS.length

      if (!allShipsPlaced) {
        return {
          ...previous,
          board: placedBoard,
          placementShipIndex: nextShipIndex,
          message: getPlacementMessage(nextShipIndex),
        }
      }

      const boardWithCpuShips = placeShipsRandomly(placedBoard, 'cpu')

      return {
        ...previous,
        phase: 'battle',
        turn: 'player',
        board: boardWithCpuShips,
        message: 'Fire at enemy waters',
        startTime: Date.now(),
      }
    })
  }, [])

  const fire = useCallback((row: number, col: number) => {
    setState((previous) => {
      if (previous.phase !== 'battle' || previous.turn !== 'player') {
        return previous
      }

      const playerShipAtTarget = previous.board.ships.some(
        (ship) => ship.owner === 'player' && ship.cells.some((cell) => cell.row === row && cell.col === col),
      )

      if (playerShipAtTarget) {
        return { ...previous, message: 'You cannot fire on your own ships!' }
      }

      const fired = fireAt(previous.board, { row, col }, 'player')
      if (fired.result.result === 'already') {
        return { ...previous, message: 'You already fired there' }
      }

      if (allShipsSunk(fired.board, 'cpu')) {
        return {
          ...previous,
          phase: 'gameOver',
          winner: 'player',
          board: fired.board,
          message: 'You win! Enemy fleet destroyed.',
          endTime: Date.now(),
        }
      }

      return {
        ...previous,
        board: fired.board,
        turn: 'cpu',
        message: fired.result.result === 'hit' ? 'Direct hit! CPU turn...' : 'Miss. CPU turn...',
      }
    })
  }, [])

  useEffect(() => {
    if (state.phase !== 'battle' || state.turn !== 'cpu') {
      return
    }

    const delay = DIFFICULTY_PRESETS[state.difficulty].delay
    const timerId = window.setTimeout(() => {
      setState((previous) => {
        if (previous.phase !== 'battle' || previous.turn !== 'cpu') {
          return previous
        }

        const target = getCpuMove(previous.board, previous.difficulty)
        const fired = fireAt(previous.board, target, 'cpu')

        if (allShipsSunk(fired.board, 'player')) {
          return {
            ...previous,
            phase: 'gameOver',
            winner: 'cpu',
            board: fired.board,
            message: 'CPU wins! Your fleet was sunk.',
            endTime: Date.now(),
          }
        }

        return {
          ...previous,
          board: fired.board,
          turn: 'player',
          message: fired.result.result === 'hit' ? 'CPU scored a hit. Your turn.' : 'CPU missed. Your turn.',
        }
      })
    }, delay)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [state.board, state.difficulty, state.phase, state.turn])

  useEffect(() => {
    const previous = previousWinner.current
    if (previous !== state.winner && state.winner !== null) {
      previousWinner.current = state.winner
    }
  }, [state.winner])

  const newGame = useCallback(
    (difficulty: Difficulty = state.difficulty) => {
      setState(createInitialState(difficulty, DEFAULT_STATS))
      previousWinner.current = null
    },
    [state.difficulty],
  )

  return {
    state,
    placeCurrentShip,
    toggleOrientation,
    fire,
    newGame,
  }
}