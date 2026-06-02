import { useCallback, useReducer } from 'react'
import { createGameState, drawNumber, getGameStats, resetGame } from '@games/bingo-domain'
import type { BingoGameState, DrawResult } from '@games/bingo-domain'

// ─── State ───────────────────────────────────────────────────────────────────

interface GameStore {
  state: BingoGameState
  lastResult: DrawResult | null
  totalGamesPlayed: number
  totalBingos: number
}

type GameAction =
  | { type: 'DRAW' }
  | { type: 'RESET' }
  | { type: 'NEW_GAME'; cardCount?: number }

function reducer(store: GameStore, action: GameAction): GameStore {
  switch (action.type) {
    case 'DRAW': {
      // Operate on a copy to avoid direct mutation of Set
      const stateCopy: BingoGameState = {
        ...store.state,
        drawnNumbers: new Set(store.state.drawnNumbers),
        cards: store.state.cards.map((c) => ({
          ...c,
          grid: c.grid.map((row) => row.map((cell) => ({ ...cell }))),
        })),
      }
      const result = drawNumber(stateCopy)
      return {
        ...store,
        state: stateCopy,
        lastResult: result,
        totalBingos: store.totalBingos + (result?.winners.length ?? 0),
      }
    }
    case 'RESET':
      return {
        ...store,
        state: resetGame(store.state),
        lastResult: null,
        totalGamesPlayed: store.totalGamesPlayed + 1,
      }
    case 'NEW_GAME':
      return {
        ...store,
        state: createGameState(action.cardCount ?? 1),
        lastResult: null,
        totalGamesPlayed: store.totalGamesPlayed + 1,
      }
    default:
      return store
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export interface UseGameReturn {
  gameState: BingoGameState
  lastResult: DrawResult | null
  stats: ReturnType<typeof getGameStats>
  totalGamesPlayed: number
  totalBingos: number
  drawNumber: () => void
  resetGame: () => void
  newGame: (cardCount?: number) => void
}

export function useGame(initialCardCount = 1): UseGameReturn {
  const [store, dispatch] = useReducer(reducer, undefined, () => ({
    state: createGameState(initialCardCount),
    lastResult: null,
    totalGamesPlayed: 0,
    totalBingos: 0,
  }))

  const handleDraw = useCallback(() => dispatch({ type: 'DRAW' }), [])
  const handleReset = useCallback(() => dispatch({ type: 'RESET' }), [])
  const handleNewGame = useCallback(
    (cardCount?: number) => dispatch({ type: 'NEW_GAME', cardCount }),
    [],
  )

  return {
    gameState: store.state,
    lastResult: store.lastResult,
    stats: getGameStats(store.state),
    totalGamesPlayed: store.totalGamesPlayed,
    totalBingos: store.totalBingos,
    drawNumber: handleDraw,
    resetGame: handleReset,
    newGame: handleNewGame,
  }
}
