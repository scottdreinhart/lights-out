import React, { startTransition, useCallback, useMemo, useState } from 'react'

import { useThemeContext } from '@/app'
import { useKeyboardControls } from '@games/app-hook-utils'
import useAutoReset from '../../app/useAutoReset.ts'
import useGameOrchestration from '../../app/useGameOrchestration.ts'
import useNotificationQueue from '../../app/useNotificationQueue.ts'
import useSeries from '../../app/useSeries.ts'
import useSoundEffects from '../../app/useSoundEffects.ts'
import { useTicTacToe } from '../../app/useTicTacToe.ts'
import { TOKENS } from '@/domain'
import type { Token } from '@/domain'
import ConfettiOverlay from '../atoms/ConfettiOverlay.tsx'
import DifficultyToggle from '../atoms/DifficultyToggle.tsx'
import GameOutcomeOverlay from '../atoms/GameOutcomeOverlay.tsx'
import NotificationBanner from '../atoms/NotificationBanner.tsx'
import SeriesSelector from '../atoms/SeriesSelector.tsx'
import SoundToggle from '../atoms/SoundToggle.tsx'
import BoardGrid from '../molecules/BoardGrid.tsx'
import CoinFlip from '../molecules/CoinFlip.tsx'
import HamburgerMenu from '../molecules/HamburgerMenu.tsx'
import Instructions from '../molecules/Instructions.tsx'
import MoveTimeline from '../molecules/MoveTimeline.tsx'
import Scoreboard from '../molecules/Scoreboard.tsx'
import SplashScreen from '../molecules/SplashScreen.tsx'
import ThemeSelector from '../molecules/ThemeSelector.tsx'
import { cx } from '../utils/cssModules.ts'
import styles from './TicTacToeGame.module.css'

/**
 * TicTacToeGame — Organism
 *
 * Top-level game component. Orchestrates the application hooks
 * and composes atoms / molecules.
 */
const TicTacToeGame: React.FC = () => {
  const {
    board,
    turn,
    gameState,
    score,
    difficulty,
    streak,
    bestTime,
    moveHistory,
    currentMoveIndex,
    canUndo,
    canRedo,
    handleHumanSelect,
    handleFocusChange,
    focusedIndex,
    handleReset,
    handleSetDifficulty,
    handleUndo,
    handleRedo,
    setFirstPlayer,
  } = useTicTacToe()

  const { soundEnabled, toggleSound, playMove, playNav, playTap, playWin, playLoss, playDraw } =
    useSoundEffects()
  const { settings, setColorTheme, setMode, setColorblind } = useThemeContext()

  // Series mode — Best-of-N tracking
  const { seriesLength, seriesScore, seriesWinner, gamesPlayed, setSeriesLength, resetSeries } =
    useSeries(gameState)

  const handleSeriesChange = useCallback(
    (length: number) => {
      setSeriesLength(length)
      handleReset()
    },
    [setSeriesLength, handleReset],
  )

  const handleNewSeries = useCallback(() => {
    resetSeries()
    handleReset()
  }, [resetSeries, handleReset])

  const [showSplash, setShowSplash] = useState(true)
  const [showCoinFlip, setShowCoinFlip] = useState(false)

  const handleSplashBeginTransition = useCallback(() => {
    startTransition(() => {
      setShowCoinFlip(true)
    })
  }, [])

  const handleSplashComplete = useCallback(() => {
    startTransition(() => {
      setShowSplash(false)
    })
  }, [])

  // Coin flip state - show at app startup
  const [coinFlipDone, setCoinFlipDone] = useState(false)
  const handleCoinFlipComplete = useCallback(
    (isXFirst: boolean) => {
      if (!isXFirst) {
        setFirstPlayer(TOKENS.CPU as Token)
      }
      setCoinFlipDone(true)
    },
    [setFirstPlayer],
  )

  // Auto-reset countdown (15 s)
  const { secondsLeft, resetNow } = useAutoReset(gameState.isOver, handleReset)

  // Notification queue — unified status / countdown / reset messaging
  const {
    current: notification,
    enqueue,
    dismiss,
    clear: clearNotifications,
    updateCurrent,
  } = useNotificationQueue()

  // Stable references for orchestration hook
  const sounds = useMemo(
    () => ({ playMove, playWin, playLoss, playDraw }),
    [playMove, playWin, playLoss, playDraw],
  )
  const notifications = useMemo(
    () => ({ enqueue, clear: clearNotifications, updateCurrent }),
    [enqueue, clearNotifications, updateCurrent],
  )

  // Outcome styles lookup for orchestration
  const outcomeStyles = useMemo(
    () => ({
      win: styles.outcomeWin,
      loss: styles.outcomeLoss,
      draw: styles.outcomeDraw,
    }),
    [],
  )

  // Game orchestration — sounds, confetti, notifications, outcome CSS
  const {
    showConfetti,
    setShowConfetti,
    outcome,
    showOutcomeOverlay,
    handleOverlayDone,
    containerClass,
  } = useGameOrchestration({
    board,
    gameState,
    secondsLeft,
    notification,
    sounds,
    notifications,
    outcomeStyles,
    rootClass: styles.root,
    cx,
  })

  // Keyboard shortcuts for undo/redo
  const keyboardBindings = useMemo(
    () => [
      {
        action: 'undo',
        keys: ['Ctrl+KeyZ'],
        onTrigger: handleUndo,
        enabled: canUndo,
      },
      {
        action: 'redo-y',
        keys: ['Ctrl+KeyY'],
        onTrigger: handleRedo,
        enabled: canRedo,
      },
      {
        action: 'redo-z',
        keys: ['Ctrl+Shift+KeyZ'],
        onTrigger: handleRedo,
        enabled: canRedo,
      },
    ],
    [canUndo, canRedo, handleUndo, handleRedo],
  )
  useKeyboardControls(keyboardBindings)

  return (
    <div className={styles.page}>
      {showSplash && (
        <SplashScreen
          onBeginTransition={handleSplashBeginTransition}
          onComplete={handleSplashComplete}
        />
      )}

      <header className={styles.appBar}>
        <h1 className={styles.title}>Tic Tac Toe</h1>
        <HamburgerMenu>
          <div className={styles.menuSection} role="group" aria-label="Difficulty">
            <span className={styles.menuLabel}>Difficulty</span>
            <DifficultyToggle difficulty={difficulty} onSelect={handleSetDifficulty} />
          </div>
          <div className={styles.menuSection} role="group" aria-label="Series">
            <span className={styles.menuLabel}>Series</span>
            <SeriesSelector seriesLength={seriesLength} onSelect={handleSeriesChange} />
          </div>
          <div className={styles.menuSection} role="group" aria-label="Sound">
            <span className={styles.menuLabel}>Sound</span>
            <SoundToggle soundEnabled={soundEnabled} onToggle={toggleSound} />
          </div>
          <div className={styles.menuSection} role="group" aria-label="Theme">
            <span className={styles.menuLabel}>Theme</span>
            <ThemeSelector
              settings={settings}
              onColorTheme={setColorTheme}
              onMode={setMode}
              onColorblind={setColorblind}
            />
          </div>
          <div className={styles.menuSection} role="group" aria-label="Help">
            <span className={styles.menuLabel}>Help</span>
            <Instructions />
          </div>
        </HamburgerMenu>
      </header>

      <Scoreboard
        score={score}
        turn={turn}
        isGameOver={gameState.isOver}
        seriesLength={seriesLength}
        seriesScore={seriesScore}
        seriesWinner={seriesWinner}
        gamesPlayed={gamesPlayed}
        onNewSeries={handleNewSeries}
      />

      <div className={containerClass}>
        {showCoinFlip && !coinFlipDone && <CoinFlip onFlipComplete={handleCoinFlipComplete} />}
        <a href="#game-board" className={styles.skipToContent}>
          Skip to game board
        </a>
        {showConfetti && (
          <ConfettiOverlay
            className={styles.confettiCanvas}
            onDone={() => setShowConfetti(false)}
          />
        )}
        {showOutcomeOverlay && outcome && (
          <GameOutcomeOverlay outcome={outcome} onComplete={handleOverlayDone} />
        )}

        <BoardGrid
          board={board}
          focusedIndex={focusedIndex}
          onFocusChange={handleFocusChange}
          onSelect={handleHumanSelect}
          isGameOver={gameState.isOver}
          winLine={gameState.winLine}
          onNav={playNav}
          onTap={playTap}
          id="game-board"
        >
          <NotificationBanner notification={notification} onDismiss={dismiss} onAction={resetNow} />
        </BoardGrid>

        <MoveTimeline
          moveHistory={moveHistory}
          currentIndex={currentMoveIndex}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          score={score}
          streak={streak}
          bestTime={bestTime}
        />
      </div>
    </div>
  )
}

export default TicTacToeGame
