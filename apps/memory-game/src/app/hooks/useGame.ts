import { useCallback, useReducer } from 'react'

// ─── Local game types and reducer state for memory-game card matching logic ─

export type CardSymbol = '🐶' | '🐱' | '🐸' | '🦊' | '🐻' | '🐼' | '🐨' | '🐯'

export interface MemoryCard {
  id: number
  symbol: CardSymbol
  isFlipped: boolean
  isMatched: boolean
}

export type GamePhase = 'idle' | 'playing' | 'checking' | 'won'

export interface MemoryGameState {
  cards: MemoryCard[]
  flippedIds: number[]
  matchedPairs: number
  moves: number
  phase: GamePhase
}

const SYMBOLS: CardSymbol[] = ['🐶', '🐱', '🐸', '🦊', '🐻', '🐼', '🐨', '🐯']

function createDeck(): MemoryCard[] {
  const pairs = [...SYMBOLS, ...SYMBOLS]
  const shuffled = pairs.sort(() => Math.random() - 0.5)
  return shuffled.map((symbol, id) => ({ id, symbol, isFlipped: false, isMatched: false }))
}

function createInitialState(): MemoryGameState {
  return {
    cards: createDeck(),
    flippedIds: [],
    matchedPairs: 0,
    moves: 0,
    phase: 'idle',
  }
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

type GameAction =
  | { type: 'START' }
  | { type: 'FLIP'; id: number }
  | { type: 'CHECK_MATCH' }
  | { type: 'RESET' }

function reducer(state: MemoryGameState, action: GameAction): MemoryGameState {
  switch (action.type) {
    case 'START':
      return { ...createInitialState(), phase: 'playing' }

    case 'FLIP': {
      if (state.phase !== 'playing') {
        return state
      }
      if (state.flippedIds.length >= 2) {
        return state
      }
      if (state.flippedIds.includes(action.id)) {
        return state
      }

      const newFlipped = [...state.flippedIds, action.id]
      const newCards = state.cards.map((c) => (c.id === action.id ? { ...c, isFlipped: true } : c))
      const newPhase = newFlipped.length === 2 ? 'checking' : 'playing'
      return { ...state, cards: newCards, flippedIds: newFlipped, phase: newPhase as GamePhase }
    }

    case 'CHECK_MATCH': {
      if (state.flippedIds.length !== 2) {
        return state
      }
      const [a, b] = state.flippedIds.map((id) => state.cards.find((c) => c.id === id)!)
      const isMatch = a.symbol === b.symbol
      const newMatchedPairs = state.matchedPairs + (isMatch ? 1 : 0)
      const newCards = state.cards.map((c) => {
        if (!state.flippedIds.includes(c.id)) {
          return c
        }
        return { ...c, isMatched: isMatch, isFlipped: isMatch ? true : false }
      })
      const won = newMatchedPairs === SYMBOLS.length
      return {
        ...state,
        cards: newCards,
        flippedIds: [],
        matchedPairs: newMatchedPairs,
        moves: state.moves + 1,
        phase: won ? 'won' : 'playing',
      }
    }

    case 'RESET':
      return createInitialState()

    default:
      return state
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export interface UseGameReturn {
  gameState: MemoryGameState
  isWon: boolean
  remainingPairs: number
  start: () => void
  flipCard: (id: number) => void
  checkMatch: () => void
  reset: () => void
}

export function useGame(): UseGameReturn {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)

  const start = useCallback(() => dispatch({ type: 'START' }), [])
  const flipCard = useCallback((id: number) => dispatch({ type: 'FLIP', id }), [])
  const checkMatch = useCallback(() => dispatch({ type: 'CHECK_MATCH' }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  return {
    gameState: state,
    isWon: state.phase === 'won',
    remainingPairs: SYMBOLS.length - state.matchedPairs,
    start,
    flipCard,
    checkMatch,
    reset,
  }
}
