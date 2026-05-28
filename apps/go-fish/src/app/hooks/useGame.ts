import type { CardRank, GameState } from '@/domain'
import { collectBooks, createGameState, isGameOver, processAsk } from '@/domain'
import { useCallback, useReducer } from 'react'

type GameAction =
  | { type: 'START' }
  | { type: 'PLAYER_ASK'; rank: CardRank }
  | { type: 'CPU_TURN' }
  | { type: 'RESET' }

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
    case 'RESET':
      return createGameState()

    case 'PLAYER_ASK': {
      const { rank } = action
      const result = processAsk(state.playerHand, state.computerHand, rank)
      let { askerHand, targetHand } = result
      const { goFish } = result

      if (goFish && state.deck.length > 0) {
        askerHand = [...askerHand, state.deck[0]]
      }

      const { hand: cleanPlayerHand, booksFound } = collectBooks(askerHand)

      const newState: GameState = {
        ...state,
        playerHand: cleanPlayerHand,
        computerHand: targetHand,
        deck: goFish ? state.deck.slice(1) : state.deck,
        playerSets: state.playerSets + booksFound,
        currentPlayer: goFish ? 'computer' : 'player',
      }

      const done = isGameOver(newState)
      return { ...newState, gameOver: done, phase: done ? 'game-over' : 'playing' }
    }

    case 'CPU_TURN': {
      if (state.currentPlayer !== 'computer' || state.computerHand.length === 0) return state

      const rankCounts = new Map<CardRank, number>()
      for (const card of state.computerHand) {
        rankCounts.set(card.rank, (rankCounts.get(card.rank) ?? 0) + 1)
      }
      const askRank = [...rankCounts.entries()].sort((a, b) => b[1] - a[1])[0][0]

      const result = processAsk(state.computerHand, state.playerHand, askRank)
      let { askerHand, targetHand } = result
      const { goFish } = result

      if (goFish && state.deck.length > 0) {
        askerHand = [...askerHand, state.deck[0]]
      }

      const { hand: cleanCpuHand, booksFound } = collectBooks(askerHand)

      const newState: GameState = {
        ...state,
        computerHand: cleanCpuHand,
        playerHand: targetHand,
        deck: goFish ? state.deck.slice(1) : state.deck,
        computerSets: state.computerSets + booksFound,
        currentPlayer: goFish ? 'player' : 'computer',
      }

      const done = isGameOver(newState)
      return { ...newState, gameOver: done, phase: done ? 'game-over' : 'playing' }
    }

    default:
      return state
  }
}

export interface UseGameReturn {
  gameState: GameState
  isPlayerTurn: boolean
  isGameOver: boolean
  winner: 'player' | 'computer' | 'draw' | null
  start: () => void
  playerAsk: (rank: CardRank) => void
  cpuTurn: () => void
  reset: () => void
}

export function useGame(): UseGameReturn {
  const [state, dispatch] = useReducer(reducer, undefined, createGameState)

  const start = useCallback(() => dispatch({ type: 'START' }), [])
  const playerAsk = useCallback((rank: CardRank) => dispatch({ type: 'PLAYER_ASK', rank }), [])
  const cpuTurn = useCallback(() => dispatch({ type: 'CPU_TURN' }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  const winner = state.gameOver
    ? state.playerSets > state.computerSets
      ? 'player'
      : state.computerSets > state.playerSets
        ? 'computer'
        : 'draw'
    : null

  return {
    gameState: state,
    isPlayerTurn: state.currentPlayer === 'player',
    isGameOver: state.gameOver,
    winner,
    start,
    playerAsk,
    cpuTurn,
    reset,
  }
}
