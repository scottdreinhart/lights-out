import type { Difficulty, GameState, Orientation } from '@/domain'
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
} from '@/domain'
import { useBattleshipWorker } from '@games/app-hook-utils'
import { useEffect, useRef, useState } from 'react'

import { useStats } from './useStats'

const createInitialState = (): GameState => {
  const difficulty: Difficulty = 'medium'
  return {
    phase: 'placement',
    turn: 'player',
    board: createBoard(), // Unified ocean — all ships and shots
    winner: null,
    difficulty,
    placementShipIndex: 0,
    placementOrientation: 'horizontal',
    message: 'Place your Carrier',
    startTime: null,
    endTime: null,
    stats: DEFAULT_STATS,
  }
}

export const useGame = () => {
  const [state, setState] = useState<GameState>(createInitialState)
  const { recordWin, recordLoss } = useStats()
  const previousWinner = useRef<'player' | 'cpu' | null>(null)
  const { getMoveAsync, getMoveSync } = useBattleshipWorker({
    moveCalculator: getCpuMove,
    useFallback: true,
  })

  const toggleOrientation = () => {
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
  }

  const placeCurrentShip = (row: number, col: number) => {
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
        'player', // Place as player's ship
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
          message: `Place your ${SHIP_DEFS[nextShipIndex].name}`,
        }
      }

      // All player ships placed — now place CPU ships on the same unified board
      const boardWithCpuShips = placeShipsRandomly(placedBoard, 'cpu')

      return {
        ...previous,
        phase: 'battle',
        turn: 'player',
        board: boardWithCpuShips,
        message: 'Fire at enemy waters',
        startTime: Date.now(), // Start timer when entering battle
      }
    })
  }

  const fire = (row: number, col: number) => {
    setState((previous) => {
      if (previous.phase !== 'battle' || previous.turn !== 'player') {
        return previous
      }

      // Prevent firing on your own ships
      const playerShipAtTarget = previous.board.ships.some(
        (ship) => ship.owner === 'player' && ship.cells.some((c) => c.row === row && c.col === col),
      )

      if (playerShipAtTarget) {
        return { ...previous, message: 'You cannot fire on your own ships!' }
      }

      const fired = fireAt(previous.board, { row, col }, 'player')
      if (fired.result.result === 'already') {
        return { ...previous, message: 'You already fired there' }
      }

      // Check if all CPU ships are sunk
      if (allShipsSunk(fired.board, 'cpu')) {
        return {
          ...previous,
          phase: 'gameOver',
          winner: 'player',
          board: fired.board,
          message: 'You win! Enemy fleet destroyed.',
          endTime: Date.now(), // Stop timer on game end
        }
      }

      return {
        ...previous,
        board: fired.board,
        turn: 'cpu',
        message: fired.result.result === 'hit' ? 'Direct hit! CPU turn...' : 'Miss. CPU turn...',
      }
    })
  }

  useEffect(() => {
    if (state.phase !== 'battle' || state.turn !== 'cpu') {
      return
    }

    const delay = DIFFICULTY_PRESETS[state.difficulty].delay
    const timerId = window.setTimeout(async () => {
      try {
        // Get CPU move asynchronously (with sync fallback if worker unavailable)
        const { move: target } = await getMoveAsync(state.board, state.difficulty)

        setState((previous) => {
          if (previous.phase !== 'battle' || previous.turn !== 'cpu') {
            return previous
          }

          const fired = fireAt(previous.board, target, 'cpu')

          // Check if all player ships are sunk
          if (allShipsSunk(fired.board, 'player')) {
            return {
              ...previous,
              phase: 'gameOver',
              winner: 'cpu',
              board: fired.board,
              message: 'CPU wins! Your fleet was sunk.',
              endTime: Date.now(), // Stop timer on game end
            }
          }

          return {
            ...previous,
            board: fired.board,
            turn: 'player',
            message:
              fired.result.result === 'hit'
                ? 'CPU scored a hit. Your turn.'
                : 'CPU missed. Your turn.',
          }
        })
      } catch (error) {
        console.error('Failed to get CPU move:', error)
        // Fallback to sync move on error
        setState((previous) => {
          if (previous.phase !== 'battle' || previous.turn !== 'cpu') {
            return previous
          }

          const { move: target } = getMoveSync(previous.board, previous.difficulty)
          const fired = fireAt(previous.board, target, 'cpu')

          // Check if all player ships are sunk
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
            message:
              fired.result.result === 'hit'
                ? 'CPU scored a hit. Your turn.'
                : 'CPU missed. Your turn.',
          }
        })
      }
    }, delay)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [state.phase, state.turn, state.board, state.difficulty, getMoveAsync, getMoveSync])

  // Track game outcome and record stats when game ends
  useEffect(() => {
    const prev = previousWinner.current
    if (prev !== state.winner && state.winner !== null) {
      if (state.winner === 'player') {
        recordWin()
      } else if (state.winner === 'cpu') {
        recordLoss()
      }
      previousWinner.current = state.winner
    }
  }, [state.winner, recordWin, recordLoss])

  const newGame = () => {
    setState(createInitialState())
    previousWinner.current = null
  }

  return {
    state,
    placeCurrentShip,
    toggleOrientation,
    fire,
    newGame,
  }
}
