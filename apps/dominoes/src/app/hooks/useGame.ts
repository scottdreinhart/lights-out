import type { Domino, GameState } from '@/domain'
import { createGameState, getValidMoves } from '@/domain'
import { useCallback, useReducer } from 'react'

// ─── Reducer ─────────────────────────────────────────────────────────────────

type GameAction =
  | { type: 'START' }
  | { type: 'PLACE_TILE'; domino: Domino; side: 'left' | 'right' }
  | { type: 'DRAW_FROM_BONEYARD' }
  | { type: 'CPU_TURN' }
  | { type: 'RESET' }

function getTableEnds(table: Domino[]): { left: number | null; right: number | null } {
  if (table.length === 0) {return { left: null, right: null }}
  return { left: table[0].left, right: table[table.length - 1].right }
}

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
    case 'RESET':
      return createGameState()

    case 'PLACE_TILE': {
      if (state.currentPlayer !== 'player') {return state}
      const { domino, side } = action
      const table = [...state.table]

      let placedDomino: Domino = domino
      if (side === 'left') {
        const leftEnd = table[0]?.left ?? null
        if (leftEnd !== null && domino.right !== leftEnd) {
          placedDomino = { left: domino.right, right: domino.left }
        }
        table.unshift(placedDomino)
      } else {
        const rightEnd = table[table.length - 1]?.right ?? null
        if (rightEnd !== null && domino.left !== rightEnd) {
          placedDomino = { left: domino.right, right: domino.left }
        }
        table.push(placedDomino)
      }

      const playerHand = state.playerHand.filter((d) => d !== domino)
      const gameOver = playerHand.length === 0
      return {
        ...state,
        table,
        playerHand,
        phase: gameOver ? 'game-over' : 'playing',
        gameOver,
        currentPlayer: 'computer',
      }
    }

    case 'DRAW_FROM_BONEYARD': {
      if (state.boneyard.length === 0) {return state}
      const [drawn, ...remaining] = state.boneyard
      return {
        ...state,
        playerHand: [...state.playerHand, drawn],
        boneyard: remaining,
      }
    }

    case 'CPU_TURN': {
      if (state.currentPlayer !== 'computer') {return state}
      const { left, right } = getTableEnds(state.table)
      const valid = getValidMoves(state.computerHand, left, right)

      if (valid.length === 0) {
        // CPU passes — switch back
        return { ...state, currentPlayer: 'player' }
      }

      const chosen = valid[0]
      const table = [...state.table]
      if (left === null || chosen.left === right || chosen.right === right) {
        table.push(chosen)
      } else {
        table.unshift({ left: chosen.right, right: chosen.left })
      }

      const computerHand = state.computerHand.filter((d) => d !== chosen)
      const gameOver = computerHand.length === 0
      return {
        ...state,
        table,
        computerHand,
        phase: gameOver ? 'game-over' : 'playing',
        gameOver,
        currentPlayer: 'player',
      }
    }

    default:
      return state
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export interface UseGameReturn {
  gameState: GameState
  isPlayerTurn: boolean
  validPlayerMoves: Domino[]
  start: () => void
  placeTile: (domino: Domino, side: 'left' | 'right') => void
  drawFromBoneyard: () => void
  cpuTurn: () => void
  reset: () => void
}

export function useGame(): UseGameReturn {
  const [state, dispatch] = useReducer(reducer, undefined, createGameState)

  const start = useCallback(() => dispatch({ type: 'START' }), [])
  const placeTile = useCallback(
    (domino: Domino, side: 'left' | 'right') => dispatch({ type: 'PLACE_TILE', domino, side }),
    [],
  )
  const drawFromBoneyard = useCallback(() => dispatch({ type: 'DRAW_FROM_BONEYARD' }), [])
  const cpuTurn = useCallback(() => dispatch({ type: 'CPU_TURN' }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  const { left, right } = getTableEnds(state.table)
  const validPlayerMoves = getValidMoves(state.playerHand, left, right)

  return {
    gameState: state,
    isPlayerTurn: state.currentPlayer === 'player',
    validPlayerMoves,
    start,
    placeTile,
    drawFromBoneyard,
    cpuTurn,
    reset,
  }
}
