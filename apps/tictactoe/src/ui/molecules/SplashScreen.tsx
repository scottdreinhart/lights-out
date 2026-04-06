import { SplashScreen as SharedSplashScreen } from '@games/common'
import React from 'react'
import styles from './SplashScreen.module.css'

interface SplashScreenProps {
  onComplete: () => void
  onHowToPlay?: () => void
  onLetsPlay?: () => void
}

/**
 * TicTacToe SplashScreen with arcade/CRT aesthetic.
 * SVG wordmark with neon grid theme, integrated with shared SplashScreen.
 *
 * When onHowToPlay and/or onLetsPlay are provided, displays interactive buttons.
 * Otherwise, uses standard auto-dismiss behavior with onComplete callback.
 */
const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, onHowToPlay, onLetsPlay }) => {
  return (
    <SharedSplashScreen
      onComplete={onComplete}
      onHowToPlay={onHowToPlay}
      onLetsPlay={onLetsPlay}
      minimumDuration={2200}
      title="TIC TAC TOE"
      className={styles.arcadeSplash}
    >
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
    </SharedSplashScreen>
  )
}

SplashScreen.displayName = 'SplashScreen'

export default SplashScreen
