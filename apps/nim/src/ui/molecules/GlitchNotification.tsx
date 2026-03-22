/**
 * GlitchNotification — Molecule combining GlitchText atom with notification styling.
 * Displays error, warning, success, or info messages with cyberpunk glitch effect.
 *
 * Usage:
 *   <GlitchNotification type="error" intensity="high">Game Over!</GlitchNotification>
 *   <GlitchNotification type="warning" intensity="medium">Low Health</GlitchNotification>
 */

import { ReactNode } from 'react'
import { GlitchText } from '@/ui/atoms'
import styles from './GlitchNotification.module.css'

interface GlitchNotificationProps {
  children: ReactNode
  type?: 'error' | 'warning' | 'success' | 'info'
  intensity?: 'low' | 'medium' | 'high'
  onDismiss?: () => void
}

export const GlitchNotification = ({
  children,
  type = 'info',
  intensity = 'medium',
  onDismiss,
}: GlitchNotificationProps) => {
  return (
    <div className={`${styles.root} ${styles[type]}`}>
      <div className={styles.glitchContainer}>
        <GlitchText intensity={intensity} className={styles.text}>
          {children}
        </GlitchText>
      </div>
      {onDismiss && (
        <button className={styles.dismissBtn} onClick={onDismiss} aria-label="Dismiss notification">
          ✕
        </button>
      )}
    </div>
  )
}
