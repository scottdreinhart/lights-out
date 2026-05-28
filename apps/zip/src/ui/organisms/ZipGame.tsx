/**
 * Zip Game Component
 * Main Zip maze navigation interface
 */

import { useZipGame, useZipInput } from '@/app'
import type { Difficulty, Move, Position } from '@/domain'
import {
  ActionBar,
  Button,
  Card,
  CounterBadge,
  FormGroup,
  Legend,
  LegendItem,
  StatPill,
  StatsBar,
} from '@games/assets-shared/components'
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { ZipBoard } from './ZipBoard'
import styles from './ZipGame.module.css'

type TrailPulseState = {
  shouldPulsePlayerCount: boolean
  shouldPulseAiCount: boolean
  shouldPulseSharedCount: boolean
}

type TrailCounts = {
  player: number
  ai: number
  shared: number
}

const TRAIL_PULSE_SETTLE_MS = 150

const positionKey = (position: Position): string => `${position.row},${position.col}`

const buildVisitedCellSet = (moves: Move[]): Set<string> => {
  const visited = new Set<string>()
  if (moves.length === 0) {
    return visited
  }

  visited.add(positionKey(moves[0].from))
  for (const move of moves) {
    visited.add(positionKey(move.to))
  }

  return visited
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const useZipTrailPulseState = ({
  counts,
  isActive,
}: {
  counts: TrailCounts
  isActive: boolean
}): TrailPulseState => {
  const previousCountsRef = useRef(counts)
  const playerPulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const aiPulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sharedPulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isPlayerPulseLatched, setIsPlayerPulseLatched] = useState(false)
  const [isAiPulseLatched, setIsAiPulseLatched] = useState(false)
  const [isSharedPulseLatched, setIsSharedPulseLatched] = useState(false)

  const clearPulseTimers = useCallback(() => {
    if (playerPulseTimerRef.current) {
      clearTimeout(playerPulseTimerRef.current)
    }
    if (aiPulseTimerRef.current) {
      clearTimeout(aiPulseTimerRef.current)
    }
    if (sharedPulseTimerRef.current) {
      clearTimeout(sharedPulseTimerRef.current)
    }
  }, [])

  const resetPulseState = useCallback(() => {
    setIsPlayerPulseLatched(false)
    setIsAiPulseLatched(false)
    setIsSharedPulseLatched(false)
    clearPulseTimers()
  }, [clearPulseTimers])

  const syncPlayerPulse = useCallback(() => {
    if (counts.player !== previousCountsRef.current.player) {
      setIsPlayerPulseLatched(true)
      if (playerPulseTimerRef.current) {
        clearTimeout(playerPulseTimerRef.current)
      }
      playerPulseTimerRef.current = setTimeout(() => {
        setIsPlayerPulseLatched(false)
      }, TRAIL_PULSE_SETTLE_MS)
    }
  }, [counts.player])

  const syncAiPulse = useCallback(() => {
    if (counts.ai !== previousCountsRef.current.ai) {
      setIsAiPulseLatched(true)
      if (aiPulseTimerRef.current) {
        clearTimeout(aiPulseTimerRef.current)
      }
      aiPulseTimerRef.current = setTimeout(() => {
        setIsAiPulseLatched(false)
      }, TRAIL_PULSE_SETTLE_MS)
    }
  }, [counts.ai])

  const syncSharedPulse = useCallback(() => {
    if (counts.shared !== previousCountsRef.current.shared) {
      setIsSharedPulseLatched(true)
      if (sharedPulseTimerRef.current) {
        clearTimeout(sharedPulseTimerRef.current)
      }
      sharedPulseTimerRef.current = setTimeout(() => {
        setIsSharedPulseLatched(false)
      }, TRAIL_PULSE_SETTLE_MS)
    }
  }, [counts.shared])

  useEffect(() => {
    if (!isActive) {
      resetPulseState()
      return
    }

    syncPlayerPulse()
    syncAiPulse()
    syncSharedPulse()
  }, [isActive, resetPulseState, syncAiPulse, syncPlayerPulse, syncSharedPulse])

  useEffect(() => {
    previousCountsRef.current = {
      player: counts.player,
      ai: counts.ai,
      shared: counts.shared,
    }
  }, [counts.ai, counts.player, counts.shared])

  useEffect(() => {
    return () => {
      clearPulseTimers()
    }
  }, [clearPulseTimers])

  return {
    shouldPulsePlayerCount: isPlayerPulseLatched,
    shouldPulseAiCount: isAiPulseLatched,
    shouldPulseSharedCount: isSharedPulseLatched,
  }
}

const ZipRulesPanel = lazy(async () => {
  const module = await import('./ZipRulesPanel')
  return { default: module.ZipRulesPanel }
})

const ZipAiComparisonSection = lazy(async () => {
  const module = await import('./ZipAiComparisonSection')
  return { default: module.ZipAiComparisonSection }
})

type StatusBannerProps = {
  isComplete: boolean
  collectedItems: number
  totalItems: number
  gameTime: number
  moveCount: number
}

const StatusBanner = ({
  isComplete,
  collectedItems,
  totalItems,
  gameTime,
  moveCount,
}: StatusBannerProps) => (
  <div className={`${styles.status} ${isComplete ? styles.success : styles.info}`}>
    {isComplete
      ? `🎉 Maze Complete! Collected ${collectedItems}/${totalItems} items in ${formatTime(gameTime)} with ${moveCount} moves!`
      : `Collect ${totalItems - collectedItems} more items and reach the goal`}
  </div>
)

type ProgressMeterProps = {
  collectedItems: number
  totalItems: number
}

const ProgressMeter = ({ collectedItems, totalItems }: ProgressMeterProps) => {
  const progressPercent = totalItems > 0 ? (collectedItems / totalItems) * 100 : 100

  return (
    <div className={styles.progress}>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
      </div>
      <span className={styles.progressText}>
        Items: {collectedItems}/{totalItems}
      </span>
    </div>
  )
}

type StatsOverviewProps = {
  moveCount: number
  gameTime: number
  mazeWidth: number
  mazeHeight: number
  lastAiLatencyMs: number | null
  lastAiEngine: 'wasm' | 'js' | null
}

const StatsOverview = ({
  moveCount,
  gameTime,
  mazeWidth,
  mazeHeight,
  lastAiLatencyMs,
  lastAiEngine,
}: StatsOverviewProps) => (
  <StatsBar>
    <StatPill label="Moves" value={moveCount} />
    <StatPill label="Time" value={formatTime(gameTime)} />
    <StatPill label="Size" value={`${mazeWidth}×${mazeHeight}`} />
    <StatPill
      label="AI"
      value={lastAiLatencyMs === null ? '--' : `${lastAiLatencyMs}ms`}
      addon={
        <div
          className={`${styles.engineBadge} ${lastAiEngine === 'wasm' ? styles.engineWasm : styles.engineJs}`}
        >
          {lastAiEngine === null ? '--' : lastAiEngine.toUpperCase()}
        </div>
      }
    />
  </StatsBar>
)

type TrailLegendSectionProps = {
  playerTrailCells: number
  aiTrailCells: number
  sharedTrailCount: number
  pulseState: TrailPulseState
}

const TrailLegendSection = ({
  playerTrailCells,
  aiTrailCells,
  sharedTrailCount,
  pulseState,
}: TrailLegendSectionProps) => (
  <Card className={styles.trailLegend}>
    <Legend legendTitle="Path Legend">
      <LegendItem swatchClassName={styles.trailSwatchPlayer}>
        <CounterBadge
          tone="player"
          pulse={pulseState.shouldPulsePlayerCount}
          label="P"
          value={playerTrailCells}
        />
      </LegendItem>
      <LegendItem swatchClassName={styles.trailSwatchAi}>
        <CounterBadge
          tone="ai"
          pulse={pulseState.shouldPulseAiCount}
          label="AI"
          value={aiTrailCells}
        />
      </LegendItem>
      <LegendItem swatchClassName={styles.trailSwatchShared}>
        <CounterBadge
          tone="shared"
          pulse={pulseState.shouldPulseSharedCount}
          label="S"
          value={sharedTrailCount}
        />
      </LegendItem>
    </Legend>
  </Card>
)

type ControlToolbarProps = {
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
  isAiBusy: boolean
  isAiReplayRunning: boolean
  isComplete: boolean
  onReset: () => void
  onNewPuzzle: () => void
  onHint: () => void
  onRunAiReplay: () => void
  onSolveAll: () => void
  onToggleRules: () => void
}

const ControlToolbar = ({
  difficulty,
  onDifficultyChange,
  isAiBusy,
  isAiReplayRunning,
  isComplete,
  onReset,
  onNewPuzzle,
  onHint,
  onRunAiReplay,
  onSolveAll,
  onToggleRules,
}: ControlToolbarProps) => (
  <Card className={styles.controls}>
    <ActionBar>
      <FormGroup
        label="Grid Size:"
        labelHtmlFor="difficulty-select"
        className={styles.controlGroup}
      >
        <select
          id="difficulty-select"
          className={styles.select}
          value={difficulty}
          onChange={(event) => onDifficultyChange(event.target.value as Difficulty)}
          disabled={isAiBusy}
        >
          <option value="easy">Easy (8×6)</option>
          <option value="medium">Medium (12×8)</option>
          <option value="hard">Hard (16×10)</option>
          <option value="expert">Expert (20×12)</option>
        </select>
      </FormGroup>
      <Button
        className={`${styles.button} ${styles.secondary}`}
        variant="secondary"
        onClick={onToggleRules}
        aria-controls="zip-rules-panel"
      >
        RULES
      </Button>
      <Button
        className={`${styles.button} ${styles.secondary}`}
        variant="secondary"
        onClick={onReset}
        disabled={isAiBusy}
      >
        Reset
      </Button>
      <Button
        className={`${styles.button} ${styles.primary}`}
        variant="primary"
        onClick={onNewPuzzle}
        disabled={isAiBusy}
      >
        New Maze
      </Button>
      <Button
        className={`${styles.button} ${styles.secondary}`}
        variant="secondary"
        onClick={onHint}
        disabled={isAiBusy}
      >
        {isAiBusy ? 'Thinking...' : 'Hint'}
      </Button>
      <Button
        className={`${styles.button} ${styles.secondary}`}
        variant="secondary"
        onClick={onRunAiReplay}
        disabled={isAiBusy || !isComplete}
      >
        {isAiReplayRunning ? 'AI Running...' : 'AI Run'}
      </Button>
      <Button
        className={`${styles.button} ${styles.danger}`}
        variant="danger"
        onClick={onSolveAll}
        disabled={isAiBusy}
      >
        {isAiBusy ? 'Solving...' : 'Solve All'}
      </Button>
    </ActionBar>
  </Card>
)

export function ZipGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [showHint, setShowHint] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [hintPosition, setHintPosition] = useState<Position | null>(null)

  const {
    gameState,
    gameTime,
    moveCount,
    isAiBusy,
    lastAiLatencyMs,
    lastAiEngine,
    isAiReplayRunning,
    aiRunnerPosition,
    aiReplayCollectedItems,
    aiReplayMoves,
    lastAiRunSummary,
    makePlayerMove,
    canMove,
    newPuzzle,
    resetCurrentGame,
    getHint,
    solveCompletely,
    changeDifficulty,
    runAiReplay,
  } = useZipGame(difficulty)

  const isInputLocked = gameState.isComplete || isAiReplayRunning
  const activePlayerPosition =
    isAiReplayRunning && aiRunnerPosition ? aiRunnerPosition : gameState.playerPosition
  const activeCollectedItems = isAiReplayRunning ? aiReplayCollectedItems : gameState.collectedItems
  const playerTrailCells = buildVisitedCellSet(gameState.moves)
  const aiTrailCells = buildVisitedCellSet(aiReplayMoves)
  const sharedTrailCount = [...playerTrailCells].filter((cell) => aiTrailCells.has(cell)).length
  const trailPulseState = useZipTrailPulseState({
    counts: {
      player: playerTrailCells.size,
      ai: aiTrailCells.size,
      shared: sharedTrailCount,
    },
    isActive: isAiReplayRunning,
  })

  const clearHint = () => {
    setShowHint(false)
    setHintPosition(null)
  }

  const { handleCellClick } = useZipInput({
    isComplete: isInputLocked,
    playerPosition: gameState.playerPosition,
    canMove,
    makePlayerMove,
    clearHint,
  })

  const handleHint = async () => {
    const hint = await getHint()
    if (hint) {
      setHintPosition(hint)
      setShowHint(true)
      setTimeout(() => {
        clearHint()
      }, 3000)
    }
  }

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)
    void changeDifficulty(newDifficulty)
    clearHint()
  }

  const handleRulesToggle = () => {
    setShowRules((previous) => !previous)
  }

  const handleRulesClose = () => {
    setShowRules(false)
  }

  const handleReplayRun = async () => {
    if (isAiBusy || isAiReplayRunning || !gameState.isComplete) {
      return
    }

    await runAiReplay()
  }

  return (
    <div className={styles.game}>
      <StatusBanner
        isComplete={gameState.isComplete}
        collectedItems={gameState.collectedItems.length}
        totalItems={gameState.items.length}
        gameTime={gameTime}
        moveCount={moveCount}
      />

      <ProgressMeter
        collectedItems={gameState.collectedItems.length}
        totalItems={gameState.items.length}
      />

      <StatsOverview
        moveCount={moveCount}
        gameTime={gameTime}
        mazeWidth={gameState.maze[0].length}
        mazeHeight={gameState.maze.length}
        lastAiLatencyMs={lastAiLatencyMs}
        lastAiEngine={lastAiEngine}
      />

      <ZipBoard
        maze={gameState.maze}
        playerPosition={activePlayerPosition}
        collectedItems={activeCollectedItems}
        totalItems={gameState.items.length}
        playerPathMoves={gameState.moves}
        aiPathMoves={aiReplayMoves}
        highlightedPosition={showHint ? hintPosition : null}
        onCellClick={handleCellClick}
      />

      <TrailLegendSection
        playerTrailCells={playerTrailCells.size}
        aiTrailCells={aiTrailCells.size}
        sharedTrailCount={sharedTrailCount}
        pulseState={trailPulseState}
      />

      <ControlToolbar
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        isAiBusy={isAiBusy}
        isAiReplayRunning={isAiReplayRunning}
        isComplete={gameState.isComplete}
        onReset={resetCurrentGame}
        onNewPuzzle={() => void newPuzzle()}
        onHint={() => void handleHint()}
        onRunAiReplay={handleReplayRun}
        onSolveAll={() => void solveCompletely()}
        onToggleRules={handleRulesToggle}
      />

      {lastAiRunSummary && (
        <Suspense fallback={null}>
          <ZipAiComparisonSection summary={lastAiRunSummary} />
        </Suspense>
      )}

      {showRules && (
        <Suspense fallback={null}>
          <ZipRulesPanel isOpen={showRules} onClose={handleRulesClose} />
        </Suspense>
      )}
    </div>
  )
}
