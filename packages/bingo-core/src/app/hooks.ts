/**
 * React hooks for bingo games
 * Composable game logic and state management
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type {
  GameConfig,
  GameState,
  Player,
  PlayerAccuracy,
  SpeedRating,
  StampAttempt,
  StampingMode,
} from '../domain'
import { SPEED_RATING_CONFIG, STAMPING_PENALTIES } from '../domain/constants'
import {
  calculatePlayerAccuracy,
  calculateSpeedRating,
  detectMissedStamps,
  getEarlyCompletionBonus,
  validateStampAttempt,
} from '../domain/rules'

/**
 * Hook for managing bingo game state and operations
 */
export const useBingoGame = (initialConfig: GameConfig) => {
  const [gameState, setGameState] = useState<GameState>({
    id: crypto.randomUUID(),
    difficulty: initialConfig.difficulty,
    cards: [],
    calledNumbers: [],
    gameStartTime: Date.now(),
    isGameActive: false,
    currentCallIndex: 0,
  })

  const resetGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      calledNumbers: [],
      currentCallIndex: 0,
      isGameActive: false,
      gameEndTime: undefined,
      winner: undefined,
    }))
  }, [])

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gameStartTime: Date.now(),
      isGameActive: true,
    }))
  }, [])

  const endGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gameEndTime: Date.now(),
      isGameActive: false,
    }))
  }, [])

  return {
    gameState,
    setGameState,
    resetGame,
    startGame,
    endGame,
  }
}

/**
 * Hook for managing the calling system
 */
export const useBingoCaller = (callInterval: number = 3000) => {
  const [recentCalls, setRecentCalls] = useState<number[]>([])
  const [nextNumber, setNextNumber] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const startCalling = useCallback(() => {
    setIsRunning(true)
  }, [])

  const stopCalling = useCallback(() => {
    setIsRunning(false)
  }, [])

  const addCall = useCallback((number: number) => {
    setRecentCalls((prev) => [...prev, number].slice(-5)) // Keep last 5
    setNextNumber(number)
  }, [])

  return {
    recentCalls,
    nextNumber,
    isRunning,
    startCalling,
    stopCalling,
    addCall,
  }
}

/**
 * Hook for tracking player cards and scores
 */
export const useBingoPlayers = () => {
  const [players, setPlayers] = useState<Player[]>([])

  const addPlayer = useCallback((player: Player) => {
    setPlayers((prev) => [...prev, player])
  }, [])

  const updatePlayerScore = useCallback((playerId: string, scoreIncrease: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, totalScore: p.totalScore + scoreIncrease } : p)),
    )
  }, [])

  const setPlayerCards = useCallback((playerId: string, cards: string[]) => {
    setPlayers((prev) => prev.map((p) => (p.id === playerId ? { ...p, cards } : p)))
  }, [])

  return {
    players,
    setPlayers,
    addPlayer,
    updatePlayerScore,
    setPlayerCards,
  }
}

/**
 * Hook for managing reaction time tracking
 */
export const useBingoReactions = () => {
  const [reactionTimes, setReactionTimes] = useState<Record<string, number[]>>({})

  const recordReaction = useCallback((playerId: string, reactionMs: number) => {
    setReactionTimes((prev) => ({
      ...prev,
      [playerId]: [...(prev[playerId] || []), reactionMs],
    }))
  }, [])

  const getAverageReaction = useCallback(
    (playerId: string): number => {
      const times = reactionTimes[playerId] || []
      if (times.length === 0) return 0
      return times.reduce((a, b) => a + b, 0) / times.length
    },
    [reactionTimes],
  )

  return {
    reactionTimes,
    recordReaction,
    getAverageReaction,
  }
}

/**
 * Hook for managing bonus calculation
 */
export const useBingoScoring = () => {
  const calculateBonus = useCallback(
    (baseScore: number, bonuses: Record<string, number | undefined>) => {
      return baseScore + Object.values(bonuses).reduce((sum, b) => sum + (b || 0), 0)
    },
    [],
  )

  return {
    calculateBonus,
  }
}

/**
 * Hook for managing stamping mode and stamp validation
 * Tracks stamp attempts, errors, and accuracy metrics
 *
 * Supports two modes:
 * - 'auto': Numbers automatically marked as called
 * - 'manual': Player must manually stamp called numbers
 *
 * Applies penalties:
 * - 10 points for wrong stamp
 * - 5 points for missed stamp
 */
export const useStamping = (initialMode: StampingMode = 'auto') => {
  const [stampingMode, setStampingMode] = useState<StampingMode>(initialMode)
  const [stampAttempts, setStampAttempts] = useState<StampAttempt[]>([])
  const [accuracy, setAccuracy] = useState<PlayerAccuracy>({
    totalAttempts: 0,
    correctStamps: 0,
    wrongStamps: 0,
    missedStamps: 0,
    totalPenalty: 0,
  })

  const stampNumber = useCallback((number: number, calledNumbers: number[]) => {
    const isValid = validateStampAttempt(number, calledNumbers)

    const attempt: StampAttempt = {
      number,
      timestamp: Date.now(),
      isValid,
      penalty: !isValid ? STAMPING_PENALTIES.WRONG_STAMP : 0,
    }

    setStampAttempts((prev) => [...prev, attempt])

    // Update accuracy metrics
    setAccuracy((prev) => ({
      totalAttempts: prev.totalAttempts + 1,
      correctStamps: prev.correctStamps + (isValid ? 1 : 0),
      wrongStamps: prev.wrongStamps + (!isValid ? 1 : 0),
      missedStamps: prev.missedStamps, // Tracked separately below
      totalPenalty: prev.totalPenalty + (isValid ? 0 : STAMPING_PENALTIES.WRONG_STAMP),
    }))

    return isValid
  }, [])

  const checkMissedStamps = useCallback((calledNumbers: number[], attemptedNumbers: number[]) => {
    const missedCount = detectMissedStamps(calledNumbers, attemptedNumbers)

    setAccuracy((prev) => ({
      ...prev,
      missedStamps: missedCount,
      totalPenalty: prev.totalPenalty + missedCount * STAMPING_PENALTIES.MISSED_STAMP,
    }))

    return missedCount
  }, [])

  const getAccuracyMetrics = useCallback(() => {
    return calculatePlayerAccuracy(accuracy)
  }, [accuracy])

  const resetStamping = useCallback(() => {
    setStampAttempts([])
    setAccuracy({
      totalAttempts: 0,
      correctStamps: 0,
      wrongStamps: 0,
      missedStamps: 0,
      totalPenalty: 0,
    })
  }, [])

  return {
    stampingMode,
    setStampingMode,
    stampAttempts,
    accuracy,
    stampNumber,
    checkMissedStamps,
    getAccuracyMetrics,
    resetStamping,
  }
}

/**
 * Hook for managing round timer and completion
 * Tracks countdown and early completion bonus
 *
 * Provides:
 * - Countdown in seconds
 * - Time expiration detection
 * - Completion signaling for bonus calculation
 *
 * Constants:
 * - Uses EARLY_COMPLETION_CONFIG for bonus calculation
 *   (max 50 points, awarded if time >30%)
 */
export const useRoundTimer = (durationSeconds: number) => {
  const [startTime, setStartTime] = useState<number | null>(null)
  const [isTimeExpired, setIsTimeExpired] = useState(false)
  const [countdownSeconds, setCountdownSeconds] = useState(durationSeconds)

  // Timer countdown effect
  useEffect(() => {
    if (!startTime || isTimeExpired) return

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = Math.max(0, durationSeconds - elapsed)

      setCountdownSeconds(remaining)

      if (remaining === 0) {
        setIsTimeExpired(true)
        clearInterval(interval)
      }
    }, 100) // Update every 100ms for smooth countdown

    return () => clearInterval(interval)
  }, [startTime, isTimeExpired, durationSeconds])

  const startTimer = useCallback(() => {
    setStartTime(Date.now())
    setIsTimeExpired(false)
    setCountdownSeconds(durationSeconds)
  }, [durationSeconds])

  const stopTimer = useCallback(() => {
    setIsTimeExpired(true)
  }, [])

  const resetTimer = useCallback(() => {
    setStartTime(null)
    setIsTimeExpired(false)
    setCountdownSeconds(durationSeconds)
  }, [durationSeconds])

  const signalCompletion = useCallback(() => {
    if (!startTime) return { completion: null, bonus: 0 }

    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
    const remainingSeconds = Math.max(0, durationSeconds - elapsedSeconds)
    const completionTime = durationSeconds - remainingSeconds

    // Calculate early completion bonus (0-50 points)
    const bonus = getEarlyCompletionBonus(completionTime, durationSeconds)

    return {
      completion: {
        elapsedSeconds,
        remainingSeconds,
        completionTime,
      },
      bonus,
    }
  }, [startTime, durationSeconds])

  return {
    countdownSeconds,
    isTimeExpired,
    startTimer,
    stopTimer,
    resetTimer,
    signalCompletion,
  }
}

/**
 * Hook for calculating speed and accuracy ratings
 * Produces dual-dimension scoring system
 *
 * Dimensions:
 * - speedScore: 0-100 (faster = higher)
 * - accuracyScore: 0-100 (more accurate = higher)
 * - combinedRating: Average of speed and accuracy
 *
 * Used by UI to display skill level feedback
 * Constants from SPEED_RATING_CONFIG
 */
export const useSpeedRating = (
  accuracy: PlayerAccuracy,
  completionTime: number,
  totalTime: number,
) => {
  const [speedRating, setSpeedRating] = useState<SpeedRating>({
    speedScore: 0,
    accuracyScore: 0,
    combinedRating: 0,
  })

  // Recalculate whenever inputs change
  useEffect(() => {
    const rating = calculateSpeedRating(completionTime, totalTime, accuracy)
    setSpeedRating(rating)
  }, [accuracy, completionTime, totalTime])

  const getSkillLevel = useCallback((): 'beginner' | 'intermediate' | 'advanced' | 'expert' => {
    const combined = speedRating.combinedRating

    if (combined >= SPEED_RATING_CONFIG.MAX * 0.9) return 'expert' // 90+
    if (combined >= SPEED_RATING_CONFIG.MAX * 0.7) return 'advanced' // 70-89
    if (combined >= SPEED_RATING_CONFIG.MAX * 0.5) return 'intermediate' // 50-69
    return 'beginner' // 0-49
  }, [speedRating.combinedRating])

  return {
    speedRating,
    getSkillLevel,
  }
}

/**
 * Provide bingo game context to all nested components
 */
interface BingoContextType {
  gameConfig: GameConfig
  gameState: GameState
}

const BingoContext = createContext<BingoContextType | undefined>(undefined)

export const useBingoContext = () => {
  const context = useContext(BingoContext)
  if (!context) {
    throw new Error('useBingoContext must be used within BingoProvider')
  }
  return context
}

export { BingoContext }
