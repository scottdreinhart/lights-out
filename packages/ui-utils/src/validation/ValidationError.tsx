/**
 * ValidationError — Display validation error messages
 *
 * Usage:
 *   <ValidationError errors={['Email is required', 'Invalid format']} />
 */

import React from 'react'
import styles from './validation.module.css'

export interface ValidationErrorProps {
  /** Array of error messages to display */
  errors?: string | string[]
  /** Field name for accessibility */
  field?: string
  /** Custom className */
  className?: string
  /** Severity level for styling */
  severity?: 'info' | 'warning' | 'error'
}

export function ValidationError({
  errors,
  field,
  className,
  severity = 'error',
}: ValidationErrorProps) {
  if (!errors) return null

  const errorList = Array.isArray(errors) ? errors : [errors]
  if (errorList.length === 0) return null

  return (
    <div
      className={`${styles.errorContainer} ${styles[severity]} ${className || ''}`}
      role="alert"
      aria-live="polite"
      aria-label={field ? `${field} error` : undefined}
    >
      {errorList.length === 1 ? (
        <p className={styles.message}>{errorList[0]}</p>
      ) : (
        <ul className={styles.list}>
          {errorList.map((error, idx) => (
            <li key={idx} className={styles.message}>
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
