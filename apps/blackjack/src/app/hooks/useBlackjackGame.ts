/**
 * Comprehensive Blackjack Game Hook
 *
 * Combines game logic, statistics tracking, and game history.
 * This is the primary integration point for the complete blackjack experience.
 */

import type { HandHistory } from '@/domain'
import { useGame } from './useGame'
import { useGameHistory } from './useGameHistory'
import { useStats } from './useStats'

interface UseBlackjackGameResult {
  // Game state and actions (from useGame)
  gameState: ReturnType<typeof useGame>['gameState']
  undoRedoState: ReturnType<typeof useGame>['undoRedoState']
  placeBet: ReturnType<typeof useGame>['placeBet']
  hit: ReturnType<typeof useGame>['hit']
  stand: ReturnType<typeof useGame>['stand']
  doubleDown: ReturnType<typeof useGame>['doubleDown']
  split: ReturnType<typeof useGame>['split']
  playDealer: ReturnType<typeof useGame>['playDealer']
  newRound: ReturnType<typeof useGame>['newRound']
  getAvailableActions: ReturnType<typeof useGame>['getAvailableActions']

  // Undo/Redo functionality
  canUndo: ReturnType<typeof useGame>['canUndo']
  canRedo: ReturnType<typeof useGame>['canRedo']
  undo: ReturnType<typeof useGame>['undo']
  redo: ReturnType<typeof useGame>['redo']

  // Statistics tracking (from useStats)
  stats: ReturnType<typeof useStats>['stats']
  updateStats: ReturnType<typeof useStats>['updateStats']

  // Game history (from useGameHistory)
  history: ReturnType<typeof useGameHistory>['history']
  addGameToHistory: ReturnType<typeof useGameHistory>['addGameToHistory']
  getRecentGames: ReturnType<typeof useGameHistory>['getRecentGames']
  getTotalStats: ReturnType<typeof useGameHistory>['getTotalStats']
}

/**
 * Comprehensive blackjack game hook that integrates:
 * - Core game logic and state management
 * - Player statistics tracking
 * - Game history recording
 */
export function useBlackjackGame(initialBalance: number = 1000): UseBlackjackGameResult {
  // Initialize statistics and history hooks
  const { stats, updateStats } = useStats()
  const { history, addGameToHistory, getRecentGames, getTotalStats } = useGameHistory()

  // Handle game completion for statistics tracking
  const handleGameComplete = (handHistory: HandHistory) => {
    // Update statistics with the completed hand
    updateStats(handHistory)
    // Add to game history
    addGameToHistory(handHistory)
  }

  // Initialize game hook with completion callback
  const gameHook = useGame(initialBalance, handleGameComplete)

  return {
    // Game state and actions
    gameState: gameHook.gameState,
    undoRedoState: gameHook.undoRedoState,
    placeBet: gameHook.placeBet,
    hit: gameHook.hit,
    stand: gameHook.stand,
    doubleDown: gameHook.doubleDown,
    split: gameHook.split,
    playDealer: gameHook.playDealer,
    newRound: gameHook.newRound,
    getAvailableActions: gameHook.getAvailableActions,

    // Undo/Redo functionality
    canUndo: gameHook.canUndo,
    canRedo: gameHook.canRedo,
    undo: gameHook.undo,
    redo: gameHook.redo,

    // Statistics
    stats,
    updateStats,

    // Game history
    history,
    addGameToHistory,
    getRecentGames,
    getTotalStats,
  }
}

export default useBlackjackGame
