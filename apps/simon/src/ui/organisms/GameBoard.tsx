import { useKeyboardControls } from '@/app'
import type { SimonColor, SimonGameState, SimonRuleConfig } from '@/domain'
import { buildSimonSignalProfile, getColorSequence, SIMON_COLOR_VALUES } from '@/domain'
import {
  ActionBar as SharedActionBar,
  Button as SharedButton,
  StatPill as SharedStatPill,
  StatsBar as SharedStatsBar,
} from '@games/assets-shared'
import type { GameOutcome } from '@games/common'
import { GameOutcomeOverlay, ProgressMeters } from '@games/common'
import type { ButtonHTMLAttributes, ComponentType, HTMLAttributes, ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SimonPad } from '../atoms/SimonPad'
import styles from './GameBoard.module.css'
import { RulesModal } from './RulesModal'

interface PlaybackStep {
  color: SimonColor
  duration: number
}

type SharedButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: ReactNode
}

type SharedStatPillProps = {
  label: string
  value: ReactNode
  className?: string
}

const ActionBar = SharedActionBar as unknown as ComponentType<HTMLAttributes<HTMLDivElement>>
const StatsBar = SharedStatsBar as unknown as ComponentType<HTMLAttributes<HTMLDivElement>>
const StatPill = SharedStatPill as unknown as ComponentType<SharedStatPillProps>
const Button = SharedButton as unknown as ComponentType<SharedButtonProps>

interface GameBoardProps {
  state: SimonGameState
  rules: SimonRuleConfig
  showRules: boolean
  onColorClick: (color: SimonColor) => void
  onStart: () => void
  onPlaySequence: () => Promise<PlaybackStep[]>
  onReset: () => void
  onToggleRules: () => void
  onCloseRules: () => void
  onDifficultyChange: (level: 1 | 2 | 3 | 4) => void
}

export const GameBoard = ({
  state,
  rules,
  showRules,
  onColorClick,
  onStart,
  onPlaySequence,
  onReset,
  onToggleRules,
  onCloseRules,
  onDifficultyChange,
}: GameBoardProps) => {
  const colors = getColorSequence(rules.colorCount)
  const [isPlayingSequence, setIsPlayingSequence] = useState(false)
  const [playbackColor, setPlaybackColor] = useState<SimonColor | null>(null)
  const [playbackStep, setPlaybackStep] = useState<{
    index: number
    total: number
    step: PlaybackStep
  } | null>(null)
  const playbackRunIdRef = useRef(0)
  const timerStartRef = useRef<number | null>(null)
  const timerIntervalRef = useRef<number | null>(null)
  const [timeRemainingMs, setTimeRemainingMs] = useState(rules.inputTimeoutMs)
  const [overlayOutcome, setOverlayOutcome] = useState<GameOutcome | null>(null)
  const [overlayKey, setOverlayKey] = useState(0)
  const [showTurnCue, setShowTurnCue] = useState(false)
  const previousPhaseRef = useRef(state.phase)
  const signalProfile = useMemo(
    () => buildSimonSignalProfile(state, rules, timeRemainingMs),
    [rules, state, timeRemainingMs],
  )

  const animatePlaybackSequence = useCallback(async (sequence: PlaybackStep[]) => {
    const playbackRunId = playbackRunIdRef.current + 1
    playbackRunIdRef.current = playbackRunId

    setIsPlayingSequence(true)

    try {
      const total = sequence.length

      for (const [index, step] of sequence.entries()) {
        if (playbackRunIdRef.current !== playbackRunId) {
          return
        }

        setPlaybackStep({ index: index + 1, total, step })
        setPlaybackColor(step.color)
        await delay(step.duration)

        if (playbackRunIdRef.current !== playbackRunId) {
          return
        }

        setPlaybackColor(null)
        setPlaybackStep(null)
        await delay(120)
      }
    } finally {
      if (playbackRunIdRef.current === playbackRunId) {
        setIsPlayingSequence(false)
      }
    }
  }, [])

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current !== null) {
      window.clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
    timerStartRef.current = null
  }, [])

  const startTimer = useCallback(() => {
    if (rules.inputTimeoutMs <= 0) {
      setTimeRemainingMs(0)
      stopTimer()
      return
    }

    stopTimer()
    timerStartRef.current = window.performance.now()
    setTimeRemainingMs(rules.inputTimeoutMs)

    timerIntervalRef.current = window.setInterval(() => {
      if (timerStartRef.current === null) {
        return
      }

      const elapsed = window.performance.now() - timerStartRef.current
      const remaining = Math.max(0, rules.inputTimeoutMs - elapsed)
      setTimeRemainingMs(remaining)

      if (remaining <= 0) {
        stopTimer()
      }
    }, 100)
  }, [rules.inputTimeoutMs, stopTimer])

  useEffect(() => {
    const play = async () => {
      if (state.phase !== 'deviceTurn') {
        return
      }

      const sequence = await onPlaySequence()
      await animatePlaybackSequence(sequence)
    }

    void play()
  }, [state.phase, onPlaySequence, animatePlaybackSequence])

  useEffect(() => {
    if (state.phase === 'playerTurn') {
      startTimer()
      return
    }

    stopTimer()
    setTimeRemainingMs(rules.inputTimeoutMs)
  }, [rules.inputTimeoutMs, startTimer, state.phase, stopTimer])

  useEffect(() => {
    if (!state.gameOver) {
      setOverlayOutcome(null)
      return
    }

    const nextOutcome: GameOutcome =
      state.winner === 'player' || state.gameOverReason === 'maxSequence'
        ? 'win'
        : state.gameOverReason === 'mismatch' || state.gameOverReason === 'timeout'
          ? 'loss'
          : 'draw'

    setOverlayOutcome(nextOutcome)
    setOverlayKey((key) => key + 1)
  }, [state.currentRound, state.gameOver, state.gameOverReason, state.winner])

  useEffect(() => {
    const previousPhase = previousPhaseRef.current
    previousPhaseRef.current = state.phase

    if (previousPhase === 'deviceTurn' && state.phase === 'playerTurn') {
      setShowTurnCue(true)
      const cueTimer = window.setTimeout(() => {
        setShowTurnCue(false)
      }, 700)
      return () => {
        window.clearTimeout(cueTimer)
      }
    }

    if (state.phase !== 'playerTurn') {
      setShowTurnCue(false)
    }

    return undefined
  }, [state.phase])

  useEffect(() => {
    if (!overlayOutcome) {
      return
    }

    playOutcomeTone(overlayOutcome)
  }, [overlayOutcome])

  useEffect(() => {
    return () => {
      playbackRunIdRef.current += 1
      stopTimer()
      setPlaybackColor(null)
      setPlaybackStep(null)
      setIsPlayingSequence(false)
    }
  }, [stopTimer])

  const isGameInProgress =
    state.phase === 'playing' || state.phase === 'playerTurn' || state.phase === 'deviceTurn'

  const canReplaySequence = state.phase === 'playerTurn' && !isPlayingSequence

  const handleReplaySequence = useCallback(async () => {
    if (!canReplaySequence) {
      return
    }

    const sequence = await onPlaySequence()
    await animatePlaybackSequence(sequence)
  }, [animatePlaybackSequence, canReplaySequence, onPlaySequence])

  const handlePrimaryAction = useCallback(() => {
    if (state.gameOver) {
      onReset()
      return
    }

    if (state.phase === 'idle') {
      onStart()
      return
    }

    if (state.phase === 'playerTurn' && !isPlayingSequence) {
      void handleReplaySequence()
    }
  }, [handleReplaySequence, isPlayingSequence, onReset, onStart, state.gameOver, state.phase])

  const keyboardBindings = useMemo(
    () => [
      {
        action: 'close-rules',
        keys: ['Escape'],
        onTrigger: onCloseRules,
        enabled: showRules,
      },
      {
        action: 'primary-action',
        keys: ['Enter', 'Space'],
        onTrigger: handlePrimaryAction,
        enabled: !showRules,
      },
      {
        action: 'reset-game',
        keys: ['KeyR'],
        onTrigger: onReset,
        enabled: !showRules,
      },
      ...colors.slice(0, 4).map((color, index) => ({
        action: `play-${color}`,
        keys: [`Digit${index + 1}`],
        onTrigger: () => {
          if (!showRules && state.phase === 'playerTurn' && !isPlayingSequence) {
            onColorClick(color)
          }
        },
        enabled: !showRules,
      })),
    ],
    [
      colors,
      handlePrimaryAction,
      isPlayingSequence,
      onCloseRules,
      onColorClick,
      onReset,
      showRules,
      state.phase,
    ],
  )

  useKeyboardControls(keyboardBindings)

  const primaryActionButton = state.gameOver ? (
    <Button className={styles.primaryButton} variant="primary" disabled>
      Game Over
    </Button>
  ) : state.phase === 'idle' ? (
    <Button className={styles.primaryButton} variant="primary" onClick={onStart}>
      Start Game
    </Button>
  ) : state.phase === 'deviceTurn' ? (
    <>
      <Button className={styles.primaryButton} variant="primary" disabled>
        Playing...
      </Button>
      <Button className={styles.secondaryButton} variant="secondary" disabled>
        Replay Sequence
      </Button>
    </>
  ) : (
    <>
      <Button className={styles.primaryButton} variant="primary" disabled>
        Your Turn
      </Button>
      <Button
        className={styles.secondaryButton}
        variant="secondary"
        onClick={handleReplaySequence}
        disabled={!canReplaySequence}
      >
        Replay Sequence
      </Button>
    </>
  )

  const controls = state.gameOver ? (
    <Button className={styles.secondaryButton} variant="secondary" onClick={onReset}>
      Play Again
    </Button>
  ) : state.phase === 'playerTurn' ? (
    <Button
      className={styles.secondaryButton}
      variant="secondary"
      onClick={handleReplaySequence}
      disabled={!canReplaySequence}
    >
      Replay Sequence
    </Button>
  ) : state.phase === 'deviceTurn' ? (
    <Button className={styles.secondaryButton} variant="secondary" disabled>
      Replay Sequence
    </Button>
  ) : null

  return (
    <div className={styles.container} id="game-board">
      {/* Header */}
      <div className={styles.header}>
        <StatsBar className={styles.stats}>
          <StatPill label="Round" value={state.currentRound} />
          <StatPill label="Score" value={state.score} />
          <StatPill label="High Score" value={state.highScore} />
        </StatsBar>
      </div>

      {/* Main play area */}
      <div className={`${styles.playArea} ${showTurnCue ? styles.playAreaTurnCue : ''}`}>
        <SimonPad
          colors={colors}
          onColorClick={onColorClick}
          activeColor={playbackColor ?? state.activeColor}
          colorValues={SIMON_COLOR_VALUES}
          disabled={!isGameInProgress || isPlayingSequence}
        />
      </div>

      <div className={styles.statusCluster}>
        <div className={styles.signalCluster}>
          <div className={styles.signalLabel}>Signal Profile</div>
          <ProgressMeters
            focus={signalProfile.focus}
            intensity={signalProfile.intensity}
            progress={signalProfile.progress}
            styles={styles}
          />
          <div className={styles.pressureRow}>
            <span className={styles.pressureLabel}>Pressure</span>
            <span className={styles.pressureValue}>{signalProfile.pressure}%</span>
          </div>
        </div>

        <div className={styles.statusRow}>
          <div className={styles.difficultyColumn}>
            <span className={styles.difficultyLabel}>Difficulty</span>
            <div
              className={styles.difficultyButtons}
              role="group"
              aria-label="Simon difficulty levels"
            >
              {[1, 2, 3, 4].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`${styles.difficultyButton} ${
                    rules.difficultyLevel === level ? styles.difficultyButtonActive : ''
                  }`}
                  onClick={() => onDifficultyChange(level as 1 | 2 | 3 | 4)}
                  aria-pressed={rules.difficultyLevel === level}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.actionColumn}>{primaryActionButton}</div>
        </div>

        <div className={styles.playbackStatus} aria-live="polite">
          <div className={styles.playbackRow}>
            <span className={styles.playbackLabel}>Pattern</span>
            <span className={styles.playbackValue}>
              {playbackStep
                ? `Step ${playbackStep.index}/${playbackStep.total} · ${playbackStep.step.color} · ${playbackStep.step.duration}ms`
                : 'Sequence ready'}
            </span>
          </div>
          <div className={styles.playbackRow}>
            <span className={styles.playbackLabel}>Time Left</span>
            <span className={styles.playbackValue}>
              {state.phase === 'playerTurn' && rules.inputTimeoutMs > 0
                ? `${formatTimeRemaining(timeRemainingMs)} / ${formatTimeRemaining(rules.inputTimeoutMs)}`
                : 'Waiting'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.rulesButtonRow}>
        <button
          className={styles.rulesButton}
          onClick={onToggleRules}
          aria-label="Show rules"
          title="Rules"
        >
          ?
        </button>
      </div>

      {/* Message */}
      <div className={styles.message}>
        {state.message}
        {state.error && <div className={styles.error}>{state.error}</div>}
      </div>

      {/* Controls */}
      <ActionBar className={styles.controls}>{controls}</ActionBar>

      <div className={styles.notificationPortal} aria-hidden="true">
        <div className={styles.notificationStage}>
          {overlayOutcome ? (
            <GameOutcomeOverlay
              key={`${overlayKey}-${state.currentRound}-${overlayOutcome}`}
              outcome={overlayOutcome}
              durationMs={2200}
              onComplete={() => setOverlayOutcome(null)}
            />
          ) : null}
        </div>
      </div>

      {/* Rules Modal */}
      <RulesModal
        isOpen={showRules}
        onClose={onCloseRules}
        rules={rules}
        variant={ruleVariantFromConfig(rules)}
      />
    </div>
  )
}

function ruleVariantFromConfig(rules: SimonRuleConfig): string {
  if (rules.playerAddsMode) {
    return 'PLAYER_ADDS'
  }
  if (rules.multiplayerMode) {
    return 'MULTIPLAYER'
  }
  if (rules.inputTimeoutMs === 3000) {
    return 'TIMED_MODE'
  }
  if (rules.inputMode === 'gesture') {
    return 'SIMON_AIR'
  }
  if (rules.inputMode === 'swipe') {
    return 'SIMON_SWIPE'
  }
  return 'CLASSIC'
}

const delay = (duration: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration)
  })

function formatTimeRemaining(milliseconds: number): string {
  return `${Math.ceil(Math.max(0, milliseconds) / 1000)}s`
}

function playOutcomeTone(outcome: GameOutcome): void {
  const toneByOutcome: Record<GameOutcome, number[]> = {
    win: [523.25, 659.25, 783.99],
    loss: [392.0, 329.63, 261.63],
    draw: [440.0, 440.0],
  }

  try {
    const AudioCtor =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

    if (!AudioCtor) {
      return
    }

    const audioContext = new AudioCtor()
    const gain = audioContext.createGain()
    gain.connect(audioContext.destination)
    gain.gain.value = 0.06

    const sequence = toneByOutcome[outcome]
    const noteDuration = 0.12
    const noteGap = 0.05
    const startAt = audioContext.currentTime + 0.01

    sequence.forEach((frequency, index) => {
      const start = startAt + index * (noteDuration + noteGap)
      const oscillator = audioContext.createOscillator()
      oscillator.type = outcome === 'loss' ? 'triangle' : 'sine'
      oscillator.frequency.setValueAtTime(frequency, start)
      oscillator.connect(gain)
      oscillator.start(start)
      oscillator.stop(start + noteDuration)
    })

    const totalDuration = sequence.length * (noteDuration + noteGap) + 0.05
    window.setTimeout(
      () => {
        void audioContext.close()
      },
      Math.ceil(totalDuration * 1000),
    )
  } catch {
    // Ignore audio failures in restricted environments.
  }
}
