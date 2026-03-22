import React, { useCallback, useEffect, useState } from 'react'

import { useResponsiveState } from '@games/assets-shared'
import styles from './SplashScreen.module.css'

const SPLASH_DURATION_MS = 2200
const SPLASH_DURATION_COMPACT_MS = 1800
const SPLASH_DURATION_REDUCED_MS = 1600
const SPLASH_EXIT_MS = 420
const SPLASH_EXIT_REDUCED_MS = 120

interface SplashScreenProps {
  onBeginTransition: () => void
  onComplete: () => void
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onBeginTransition, onComplete }) => {
  const { compactViewport, prefersReducedMotion } = useResponsiveState()
  const [isExiting, setIsExiting] = useState(false)

  const beginExit = useCallback(() => {
    setIsExiting(true)
  }, [])

  useEffect(() => {
    if (!isExiting) {
      return
    }

    onBeginTransition()
  }, [isExiting, onBeginTransition])

  useEffect(() => {
    if (isExiting) {
      const exitDuration = prefersReducedMotion ? SPLASH_EXIT_REDUCED_MS : SPLASH_EXIT_MS
      const completeTimeout = window.setTimeout(onComplete, exitDuration)
      return () => window.clearTimeout(completeTimeout)
    }

    const duration = prefersReducedMotion
      ? SPLASH_DURATION_REDUCED_MS
      : compactViewport
        ? SPLASH_DURATION_COMPACT_MS
        : SPLASH_DURATION_MS

    const autoExitTimeout = window.setTimeout(beginExit, duration)
    return () => window.clearTimeout(autoExitTimeout)
  }, [beginExit, compactViewport, isExiting, onComplete, prefersReducedMotion])

  return (
    <div
      className={isExiting ? `${styles.root} ${styles.exit}` : styles.root}
      role="dialog"
      aria-modal="true"
      aria-label="Tic Tac Toe loading screen"
    >
      <div className={styles.backdrop} />
      <div className={styles.scanlines} aria-hidden="true" />

      <div className={styles.panel}>
        <div className={styles.logoStage} aria-hidden="true">
          <svg className={styles.wordmark} viewBox="0 0 520 180">
            <path
              className={styles.wordmarkFrame}
              d="M28 30h86M28 30v34M406 30h86M492 30v34M28 150h86M28 116v34M406 150h86M492 116v34"
            />
            <path className={styles.wordmarkBeam} d="M148 90h224" />
            <g className={styles.wordmarkGlyphX}>
              <path d="M70 64l28 28M98 64 70 92" />
            </g>
            <g className={styles.wordmarkGlyphO}>
              <circle cx="450" cy="78" r="18" />
            </g>
            <text x="260" y="64" className={styles.wordmarkKicker}>
              CHIBA CITY ARCADE
            </text>
            <text x="260" y="112" className={styles.wordmarkTitle}>
              TIC TAC TOE
            </text>
            <text x="260" y="148" className={styles.wordmarkSubtitle}>
              NEON GRID // PLAYER LINK ESTABLISHED
            </text>
          </svg>
        </div>

        <p className={styles.subtitle}>Booting neon grid and syncing first-player handshake.</p>

        <button className={styles.enterButton} type="button" onClick={beginExit}>
          Enter Grid
        </button>
      </div>
    </div>
  )
}

SplashScreen.displayName = 'SplashScreen'

export default SplashScreen
