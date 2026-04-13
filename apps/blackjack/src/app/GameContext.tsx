/**
 * Game Context - Central game state management
 * Provides a React Context for sharing game state across components
 */

import type { GameAction, GameState } from '@/domain'
import { createGameState, dealInitialHands, playDealerTurn, processPlayerAction } from '@/domain'
import React, { createContext, ReactNode, useReducer } from 'react'

export interface GameContextValue {
  gameState: GameState
  dispatch: React.Dispatch<GameContextAction>
}

export type GameContextAction =
  | { type: 'RESET_GAME'; payload?: { balance?: number } }
  | { type: 'SET_BET'; payload: number }
  | { type: 'DEAL_HANDS'; payload: { playerCards: any[]; dealerCards: any[] } }
  | { type: 'PLAYER_ACTION'; payload: { action: GameAction; card?: any } }
  | { type: 'DEALER_TURN'; payload: { cards: any[] } }
  | { type: 'SETTLEMENT' }
  | { type: 'NEW_ROUND' }

function gameReducer(state: GameState, action: GameContextAction): GameState {
  switch (action.type) {
    case 'RESET_GAME':
      return createGameState(action.payload?.balance)

    case 'SET_BET': {
      const player = state.players[0]
      if (!player) return state
      return {
        ...state,
        players: [
          {
            ...player,
            currentHand: {
              ...player.currentHand,
              bet: action.payload,
            },
          },
          ...state.players.slice(1),
        ],
      }
    }

    case 'DEAL_HANDS':
      return dealInitialHands(state, action.payload.playerCards, action.payload.dealerCards)

    case 'PLAYER_ACTION':
      return processPlayerAction(state, action.payload.action)

    case 'DEALER_TURN':
      return playDealerTurn(state)

    case 'SETTLEMENT':
      return {
        ...state,
        phase: 'settling',
      }

    case 'NEW_ROUND': {
      const player = state.players[0]
      const balance = player?.balance ?? 0
      return createGameState(balance)
    }

    default:
      return state
  }
}

export const GameContext = createContext<GameContextValue | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, dispatch] = useReducer(gameReducer, createGameState())

  return <GameContext.Provider value={{ gameState, dispatch }}>{children}</GameContext.Provider>
}

export function useGameContext() {
  const context = React.useContext(GameContext)
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider')
  }
  return context
}
