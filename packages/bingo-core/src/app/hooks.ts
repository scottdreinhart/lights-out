import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type {
  CallRecord,
  GameConfig,
  GameState,
  Player,
  PlayerAccuracy,
  SpeedRating,
  StampAttempt,
  StampingMode,
} from '../domain'
import {
  EARLY_COMPLETION_CONFIG,
  SPEED_RATING_CONFIG,
  STAMPING_PENALTIES,
} from '../domain/constants'
import {
  calculateSpeedRating,
  getEarlyCompletionBonus,
  validateStampAttempt,
} from '../domain/rules'

interface BingoCallerState {
  currentCall: number | null
  calledNumbers: number[]
  isCalling: boolean
  addCall: (number: number) => void
  resetCalls: () => void
}

interface BingoPlayersState {
  players: Player[]
  addPlayer: (player: Player) => void
  removePlayer: (playerId: string) => void
  updatePlayer: (playerId: string, updates: Partial<Player>) => void
}

interface BingoReactionsState {
  reactionTimes: Map<string, number[]>
  recordReaction: (playerId: string, reactionTime: number) => void
  getAverageReaction: (playerId: string) => number
}

interface BingoScoringState {
  calculateBonus: (baseScore: number, bonuses: Record<string, number>) => number
}

interface StampingState {
  stampingMode: StampingMode
  stampAttempts: StampAttempt[]
  accuracy: PlayerAccuracy
  setStampingMode: (mode: StampingMode) => void
  stampNumber: (number: number, calledNumbers: number[]) => boolean
  checkMissedStamps: (calledNumbers: number[], attemptedNumbers: number[]) => number
  getAccuracyMetrics: () => PlayerAccuracy
  resetStamping: () => void
}

interface RoundTimerState {
  timeRemaining: number
  isComplete: boolean
  countdownSeconds: number
  isRunning: boolean
  isExpired: boolean
  bonusMultiplier: number
  startTimer: () => void
  stopTimer: () => void
  resetTimer: () => void
  signalCompletion: () => { elapsedTime: number; earlyCompletionBonus: number }
}

interface SpeedRatingState {
  speedRating: SpeedRating
  speedScore: number
  accuracyScore: number
  combinedRating: number
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  getSkillLevel: () => 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

interface BingoContextType {
  gameState: GameState | null
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>
  currentGameConfig: GameConfig | null
  setCurrentGameConfig: React.Dispatch<React.SetStateAction<GameConfig | null>>
}

const BingoContext = createContext<BingoContextType | undefined>(undefined)

const createInitialAccuracy = (playerId = 'player-1'): PlayerAccuracy => ({
  playerId,
  totalNumbersCalled: 0,
  stampsMissed: 0,
  stampErrors: 0,
  accumulatedPenalty: 0,
})

const createInitialSpeedRating = (totalRoundTime = 0): SpeedRating => ({
  timeToComplete: 0,
  totalRoundTime,
  speedScore: 0,
  accuracyScore: 0,
  combinedRating: 0,
})

export const useBingoGame = (initialConfig: GameConfig) => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    id: crypto.randomUUID(),
    difficulty: initialConfig.difficulty,
    cards: [] as GameState['cards'],
    calledNumbers: [] as CallRecord[],
    currentCallIndex: 0,
    gameStartTime: Date.now(),
    isGameActive: false,
    roundEndTime: undefined,
    roundStartTime: undefined,
    stampAttempts: [] as GameState['stampAttempts'],
    stampingMode: initialConfig.stampingMode,
    playerAccuracy: {} as Record<string, PlayerAccuracy>,
    winner: undefined,
  }))

  const [currentGameConfig, setCurrentGameConfig] = useState<GameConfig>(initialConfig)

  const startGame = useCallback(() => {
    setGameState((previousState) => ({
      ...previousState,
      gameStartTime: Date.now(),
      isGameActive: true,
      roundStartTime: Date.now(),
      roundEndTime: undefined,
      calledNumbers: [],
      currentCallIndex: 0,
      stampAttempts: [],
      playerAccuracy: {},
      winner: undefined,
      stampingMode: currentGameConfig.stampingMode,
    }))
  }, [currentGameConfig.stampingMode])

  const endGame = useCallback(() => {
    setGameState((previousState) => ({
      ...previousState,
      isGameActive: false,
      roundEndTime: Date.now(),
    }))
  }, [])

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState((previousState) => ({
      ...previousState,
      ...updates,
    }))
  }, [])

  return {
    gameState,
    currentGameConfig,
    setCurrentGameConfig,
    startGame,
    endGame,
    updateGameState,
  }
}

export const useBingoCaller = (_callInterval = 3000): BingoCallerState => {
  const [currentCall, setCurrentCall] = useState<number | null>(null)
  const [calledNumbers, setCalledNumbers] = useState<number[]>([])
  const [isCalling, setIsCalling] = useState(false)

  const addCall = useCallback((number: number) => {
    setCurrentCall(number)
    setCalledNumbers((previousNumbers) => [...previousNumbers, number])
  }, [])

  const resetCalls = useCallback(() => {
    setCurrentCall(null)
    setCalledNumbers([])
    setIsCalling(false)
  }, [])

  return {
    currentCall,
    calledNumbers,
    isCalling,
    addCall,
    resetCalls,
  }
}

export const useBingoPlayers = (): BingoPlayersState => {
  const [players, setPlayers] = useState<Player[]>([])

  const addPlayer = useCallback((player: Player) => {
    setPlayers((previousPlayers) => [...previousPlayers, player])
  }, [])

  const removePlayer = useCallback((playerId: string) => {
    setPlayers((previousPlayers) => previousPlayers.filter((player) => player.id !== playerId))
  }, [])

  const updatePlayer = useCallback((playerId: string, updates: Partial<Player>) => {
    setPlayers((previousPlayers) =>
      previousPlayers.map((player) =>
        player.id === playerId ? { ...player, ...updates } : player,
      ),
    )
  }, [])

  return {
    players,
    addPlayer,
    removePlayer,
    updatePlayer,
  }
}

export const useBingoReactions = (): BingoReactionsState => {
  const [reactionTimes, setReactionTimes] = useState<Map<string, number[]>>(() => new Map())

  const recordReaction = useCallback((playerId: string, reactionTime: number) => {
    setReactionTimes((previousTimes) => {
      const nextTimes = new Map(previousTimes)
      const playerTimes = nextTimes.get(playerId) ?? []
      nextTimes.set(playerId, [...playerTimes, reactionTime])
      return nextTimes
    })
  }, [])

  const getAverageReaction = useCallback(
    (playerId: string) => {
      const times = reactionTimes.get(playerId) ?? []
      if (times.length === 0) {
        return 0
      }

      return times.reduce((sum, time) => sum + time, 0) / times.length
    },
    [reactionTimes],
  )

  return {
    reactionTimes,
    recordReaction,
    getAverageReaction,
  }
}

export const useBingoScoring = (): BingoScoringState => {
  const calculateBonus = useCallback((baseScore: number, bonuses: Record<string, number>) => {
    const bonusTotal = Object.values(bonuses).reduce((sum, bonus) => sum + bonus, 0)
    return baseScore + bonusTotal
  }, [])

  return {
    calculateBonus,
  }
}

export const useStamping = (initialStampingMode: StampingMode = 'manual'): StampingState => {
  const [stampingMode, setStampingMode] = useState<StampingMode>(initialStampingMode)
  const [stampAttempts, setStampAttempts] = useState<StampAttempt[]>([])
  const [accuracy, setAccuracy] = useState<PlayerAccuracy>(() => createInitialAccuracy())

  const stampNumber = useCallback((number: number, calledNumbers: number[]) => {
    const attemptedStamp: StampAttempt = {
      number,
      row: 0,
      col: 0,
      attemptedAt: Date.now(),
      success: false,
      calledNumbers,
    }

    const validation = validateStampAttempt(attemptedStamp, calledNumbers)
    const success = validation.valid && validation.correct

    setStampAttempts((previousAttempts) => [...previousAttempts, { ...attemptedStamp, success }])
    setAccuracy((previousAccuracy) => ({
      ...previousAccuracy,
      totalNumbersCalled: Math.max(previousAccuracy.totalNumbersCalled, calledNumbers.length),
      stampErrors: previousAccuracy.stampErrors + (success ? 0 : 1),
      accumulatedPenalty:
        previousAccuracy.accumulatedPenalty + (success ? 0 : STAMPING_PENALTIES.wrongStamp),
    }))

    return success
  }, [])

  const checkMissedStamps = useCallback((calledNumbers: number[], attemptedNumbers: number[]) => {
    const missedStamps = calledNumbers.filter(
      (calledNumber) => !attemptedNumbers.includes(calledNumber),
    )

    setAccuracy((previousAccuracy) => ({
      ...previousAccuracy,
      totalNumbersCalled: Math.max(previousAccuracy.totalNumbersCalled, calledNumbers.length),
      stampsMissed: missedStamps.length,
      accumulatedPenalty:
        previousAccuracy.accumulatedPenalty + missedStamps.length * STAMPING_PENALTIES.missedStamp,
    }))

    return missedStamps.length
  }, [])

  const getAccuracyMetrics = useCallback(() => accuracy, [accuracy])

  const resetStamping = useCallback(() => {
    setStampAttempts([])
    setAccuracy(createInitialAccuracy())
  }, [])

  return {
    stampingMode,
    stampAttempts,
    accuracy,
    setStampingMode,
    stampNumber,
    checkMissedStamps,
    getAccuracyMetrics,
    resetStamping,
  }
}

export const useRoundTimer = (durationSeconds = 180): RoundTimerState => {
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [bonusMultiplier, setBonusMultiplier] = useState(1)

  useEffect(() => {
    if (startTime === null) {
      return undefined
    }

    if (isComplete) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
      const remainingSeconds = Math.max(0, durationSeconds - elapsedSeconds)

      setTimeRemaining(remainingSeconds)
      if (remainingSeconds === 0) {
        setIsComplete(true)
        window.clearInterval(intervalId)
      }
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [durationSeconds, isComplete, startTime])

  const startTimer = useCallback(() => {
    setStartTime(Date.now())
    setIsComplete(false)
    setTimeRemaining(durationSeconds)
    setBonusMultiplier(1)
  }, [durationSeconds])

  const stopTimer = useCallback(() => {
    setStartTime(null)
  }, [])

  const resetTimer = useCallback(() => {
    setStartTime(null)
    setIsComplete(false)
    setTimeRemaining(durationSeconds)
    setBonusMultiplier(1)
  }, [durationSeconds])

  const signalCompletion = useCallback(() => {
    const elapsedTime = startTime === null ? 0 : Date.now() - startTime
    const earlyCompletionBonus = getEarlyCompletionBonus(elapsedTime, durationSeconds * 1000, {
      ...EARLY_COMPLETION_CONFIG,
      enabled: true,
      totalDuration: durationSeconds,
      speedRating: true,
      earlyCompletionBonus: true,
    })

    setBonusMultiplier(Math.max(1, Math.ceil(earlyCompletionBonus / 10)))

    setIsComplete(true)
    setStartTime(null)
    setTimeRemaining(0)

    return {
      elapsedTime,
      earlyCompletionBonus,
    }
  }, [durationSeconds, startTime])

  return {
    timeRemaining,
    isComplete,
    countdownSeconds: timeRemaining,
    isRunning: startTime !== null && !isComplete,
    isExpired: isComplete,
    bonusMultiplier,
    startTimer,
    stopTimer,
    resetTimer,
    signalCompletion,
  }
}

export const useSpeedRating = (
  accuracy: PlayerAccuracy = createInitialAccuracy(),
  completionTime = 0,
  totalTime = 0,
): SpeedRatingState => {
  const [speedRating, setSpeedRating] = useState<SpeedRating>(() =>
    createInitialSpeedRating(totalTime),
  )

  useEffect(() => {
    setSpeedRating(calculateSpeedRating(0, completionTime, totalTime, accuracy))
  }, [accuracy, completionTime, totalTime])

  const getSkillLevel = useCallback(() => {
    if (speedRating.combinedRating >= SPEED_RATING_CONFIG.maxCombinedRating * 0.85) {
      return 'expert'
    }

    if (speedRating.combinedRating >= SPEED_RATING_CONFIG.maxCombinedRating * 0.65) {
      return 'advanced'
    }

    if (speedRating.combinedRating >= SPEED_RATING_CONFIG.maxCombinedRating * 0.35) {
      return 'intermediate'
    }

    return 'beginner'
  }, [speedRating.combinedRating])

  return {
    speedRating,
    speedScore: speedRating.speedScore,
    accuracyScore: speedRating.accuracyScore,
    combinedRating: speedRating.combinedRating,
    skillLevel: getSkillLevel(),
    getSkillLevel,
  }
}

export const useBingoContext = () => {
  const context = useContext(BingoContext)
  if (!context) {
    throw new Error('useBingoContext must be used within a BingoProvider')
  }
  return context
}

export { BingoContext }
