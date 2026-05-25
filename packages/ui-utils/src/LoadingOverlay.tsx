/**
 * LoadingOverlay — Full-screen loading modal with spinner and progress
 *
 * Usage:
 *   <LoadingOverlay
 *     isVisible={isLoading}
 *     message="Loading game..."
 *     progress={75}
 *     showProgress
 *   />
 */

import React from 'react'
import styles from './LoadingOverlay.module.css'

export interface LoadingOverlayProps {
  /** Whether the overlay is visible */
  isVisible: boolean
  /** Message to display (default: "Loading...") */
  message?: string
  /** Progress value 0-100 */
  progress?: number
  /** Show progress bar (default: false) */
  showProgress?: boolean
  /** Callback when user clicks cancel (shows cancel button if provided) */
  onCancel?: () => void
  /** Severity level for styling (default: "normal") */
  severity?: 'normal' | 'warning' | 'error'
  /** Custom className for root */
  className?: string
}

export function LoadingOverlay({
  isVisible,
  message = 'Loading...',
  progress = 0,
  showProgress = false,
  onCancel,
  severity = 'normal',
  className,
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className={`${styles.overlay} ${styles[severity]} ${className || ''}`}>
      <div className={styles.container}>
        <div className={styles.spinner} />

        <p className={styles.message}>{message}</p>

        {showProgress && (
          <div className={styles.progressContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
            <span className={styles.progressText}>{Math.round(progress)}%</span>
          </div>
        )}

        {onCancel && (
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
