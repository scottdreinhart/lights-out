import { useCallback, useEffect, useMemo, useState } from 'react'

import { TOKENS } from '@/domain'
import type { Board, GameState, Notification, Outcome } from '@/domain'
import usePrevious from './usePrevious.ts'

interface Sounds {
  playMove: () => void
  playWin: () => void
  playLoss: () => void
  playDraw: () => void
}

interface Notifications {
  enqueue: (notification: {
    message: string
    variant: string
    duration: number
    hasAction?: boolean
  }) => void
  clear: () => void
  updateCurrent: (updates: Partial<Notification>) => void
}

interface UseGameOrchestrationConfig {
  board: Board
  gameState: GameState
  secondsLeft: number | null
  notification: Notification | null
  sounds: Sounds
  notifications: Notifications
  outcomeStyles: Record<string, string | undefined>
  rootClass: string | undefined
  cx: (...args: (string | Record<string, unknown> | null | undefined | false)[]) => string
}

interface UseGameOrchestrationReturn {
  outcome: Outcome | null
  showConfetti: boolean
  setShowConfetti: React.Dispatch<React.SetStateAction<boolean>>
  showOutcomeOverlay: boolean
  handleOverlayDone: () => void
  containerClass: string
}

const useGameOrchestration = ({
  board,
  gameState,
  secondsLeft,
  notification,
  sounds,
  notifications,
  outcomeStyles,
  rootClass,
  cx,
}: UseGameOrchestrationConfig): UseGameOrchestrationReturn => {
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showOutcomeOverlay, setShowOutcomeOverlay] = useState(false)

  const prevBoard = usePrevious(board)
  const prevGameOver = usePrevious(gameState.isOver)

  useEffect(() => {
    const boardChanged = prevBoard !== undefined && prevBoard !== board
    const justEnded = gameState.isOver && !prevGameOver

    if (boardChanged && !justEnded) {
      sounds.playMove()
    }

    if (justEnded) {
      let outcomeType: Outcome = 'draw'
      if (gameState.winner === TOKENS.HUMAN) {
        sounds.playWin()
        outcomeType = 'win'
        setShowConfetti(true)
      } else if (gameState.winner === TOKENS.CPU) {
        sounds.playLoss()
        outcomeType = 'loss'
      } else {
        sounds.playDraw()
      }
      setOutcome(outcomeType)
      setShowOutcomeOverlay(true)
    }

    if (!gameState.isOver && prevGameOver) {
      setOutcome(null)
      setShowConfetti(false)
      setShowOutcomeOverlay(false)
      notifications.clear()
    }
  }, [board, gameState.isOver, gameState.winner, sounds, notifications, prevBoard, prevGameOver])

  useEffect(() => {
    if (notification?.variant === 'countdown' && secondsLeft !== null && secondsLeft > 0) {
      notifications.updateCurrent({
        message: `New game in ${secondsLeft} ${secondsLeft === 1 ? 'second' : 'seconds'}`,
      })
    }
  }, [secondsLeft, notification?.variant, notifications])

  const containerClass = useMemo(() => {
    const outcomeClass = outcome ? outcomeStyles[outcome] : null
    return cx(rootClass, outcomeClass)
  }, [outcome, outcomeStyles, rootClass, cx])

  const handleOverlayDone = useCallback(() => {
    setShowOutcomeOverlay(false)
    notifications.enqueue({
      message: 'New game in 15 seconds',
      variant: 'countdown',
      duration: 0,
      hasAction: true,
    })
  }, [notifications])

  return {
    outcome,
    showConfetti,
    setShowConfetti,
    showOutcomeOverlay,
    handleOverlayDone,
    containerClass,
  }
}

export default useGameOrchestration
