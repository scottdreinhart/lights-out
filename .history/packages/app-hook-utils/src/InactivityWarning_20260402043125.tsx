import React from 'react'
import styles from './InactivityWarning.module.css'

export interface InactivityWarningProps {
  /**
   * Whether the warning is visible
   */
  isVisible: boolean

  /**
   * Time remaining in seconds before timeout
   */
  secondsRemaining?: number

  /**
   * Callback when user dismisses warning
   */
  onDismiss: () => void

  /**
   * Callback when timeout occurs
   */
  onTimeout?: () => void
}

/**
 * Modal warning shown when user has been inactive
 * Allows user to dismiss and continue, or waits for timeout
 */
export function InactivityWarning({
  isVisible,
  secondsRemaining = 30,
  onDismiss,
  onTimeout,
}: InactivityWarningProps) {
  if (!isVisible) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-labelledby="warning-title" aria-modal="true">
        <h2 id="warning-title" className={styles.title}>
          Inactivity Detected
        </h2>

        <p className={styles.message}>
          You've been inactive for a while. Your session will be closed in{' '}
          <span className={styles.timer}>{secondsRemaining}</span> seconds.
        </p>

        <p className={styles.subtext}>
          Click the button below or move your mouse/keyboard to continue playing.
        </p>

        <button
          onClick={onDismiss}
          className={styles.button}
          aria-label="Continue playing"
        >
          Continue Playing
        </button>

        <p className={styles.footer}>
          You will be returned to the menu if you remain inactive.
        </p>
      </div>
    </div>
  )
}
