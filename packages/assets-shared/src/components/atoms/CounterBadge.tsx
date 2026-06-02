import React, { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './CounterBadge.module.css'

export interface CounterBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'default' | 'player' | 'ai' | 'shared'
  pulse?: boolean
  label?: string
  value: React.ReactNode
}

/**
 * CounterBadge atom — compact count badge with optional pulsing state.
 */
export const CounterBadge = forwardRef<HTMLSpanElement, CounterBadgeProps>(
  ({ className, tone = 'default', pulse = false, label, value, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(styles.badge, styles[tone], className, { [styles.pulse]: pulse })}
        {...rest}
      >
        {label ? `${label}: ${value}` : value}
      </span>
    )
  },
)

CounterBadge.displayName = 'CounterBadge'
