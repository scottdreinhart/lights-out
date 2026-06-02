import React, { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './TimerDisplay.module.css'

export interface TimerDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  value: React.ReactNode
  status?: 'idle' | 'running' | 'expired'
}

/**
 * TimerDisplay atom — generic label/value timer pill with status styling.
 */
export const TimerDisplay = forwardRef<HTMLDivElement, TimerDisplayProps>(
  ({ className, label = 'Time', value, status = 'idle', ...rest }, ref) => {
    return (
      <div ref={ref} className={clsx(styles.root, styles[status], className)} {...rest}>
        {label ? <span className={styles.label}>{label}:</span> : null}
        <span className={styles.value}>{value}</span>
      </div>
    )
  },
)

TimerDisplay.displayName = 'TimerDisplay'
