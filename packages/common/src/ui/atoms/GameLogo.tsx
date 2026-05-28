/**
 * Reusable GameLogo component for splash screens.
 * Displays game title with optional icon and subtitle.
 * Used by all games in their splash screen components.
 */

import type { ReactNode } from 'react'
import styles from './GameLogo.module.css'

interface GameLogoProps {
  /** Game name (e.g., "Blackjack", "Connect Four") */
  title: string
  /** Optional icon or SVG content */
  icon?: ReactNode
  /** Optional subtitle or flavor text */
  subtitle?: string
  /** Optional custom className for styling */
  className?: string
  /** Controls whether the title and subtitle are visible. */
  showTitle?: boolean
  /** Controls whether the icon wrapper pulses while the logo is visible. */
  pulse?: boolean
}

export function GameLogo({ title, icon, subtitle, className = '', showTitle = true, pulse = false }: GameLogoProps) {
  return (
    <div className={`${styles.gameLogoContainer} ${className}`}>
      {icon && <div className={`${styles.gameLogoIcon} ${pulse ? styles.gameLogoIconPulse : ''}`}>{icon}</div>}
      {showTitle && (
        <div className={`${styles.gameLogoText} ${styles.gameLogoTextVisible}`}>
          <h1 className={styles.gameLogoTitle}>{title}</h1>
          {subtitle && <p className={styles.gameLogoSubtitle}>{subtitle}</p>}
        </div>
      )}
    </div>
  )
}

export type { GameLogoProps }
