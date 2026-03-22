import React, { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './Card.module.css'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean
  children: React.ReactNode
}

/**
 * Card atom — reusable container with consistent padding, shadows, and spacing.
 * Used as a building block for content layout across all apps.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevated = false, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(styles.card, className, { [styles.elevated]: elevated })}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

Card.displayName = 'Card'
