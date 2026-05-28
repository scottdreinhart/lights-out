/**
 * LoadingSpinner — Reusable spinner component with variants
 *
 * Usage:
 *   <LoadingSpinner size="medium" variant="default" message="Loading..." />
 */

import type React from 'react'
import styles from './LoadingSpinner.module.css'

export interface LoadingSpinnerProps {
  /** Size of spinner (default: "medium") */
  size?: 'small' | 'medium' | 'large'
  /** Spinner variant (default: "default") */
  variant?: 'default' | 'pulse' | 'dots' | 'bar'
  /** Optional message to display below spinner */
  message?: string
  /** Custom className */
  className?: string
}

export function LoadingSpinner({
  size = 'medium',
  variant = 'default',
  message,
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={`${styles.container} ${styles[size]} ${className || ''}`}>
      <div className={`${styles.spinner} ${styles[variant]}`}>
        {variant === 'dots' && (
          <>
            <div className={styles.dot} />
            <div className={styles.dot} />
            <div className={styles.dot} />
          </>
        )}
        {variant === 'bar' && <div className={styles.bar} />}
        {(variant === 'default' || variant === 'pulse') && (
          <div className={styles.ring} />
        )}
      </div>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  )
}
