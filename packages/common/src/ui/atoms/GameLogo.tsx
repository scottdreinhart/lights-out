/**
 * Reusable GameLogo component for splash screens.
 * Displays game title with optional icon and subtitle.
 * Used by all games in their splash screen components.
 */

import React from 'react'
import styles from './GameLogo.module.css'

interface GameLogoProps {
  /** Game name (e.g., "Blackjack", "Connect Four") */
  title: string
  /** Optional icon or SVG content */
  icon?: React.ReactNode
  /** Optional subtitle or flavor text */
  subtitle?: string
  /** Optional custom className for styling */
  className?: string
}

export function GameLogo({ title, icon, subtitle, className = '' }: GameLogoProps) {
  return (
    <div className={`${styles.gameLogoContainer} ${className}`}>
      {icon && <div className={styles.gameLogoIcon}>{icon}</div>}
      <h1 className={styles.gameLogoTitle}>{title}</h1>
      {subtitle && <p className={styles.gameLogoSubtitle}>{subtitle}</p>}
    </div>
  )
}

export type { GameLogoProps }
