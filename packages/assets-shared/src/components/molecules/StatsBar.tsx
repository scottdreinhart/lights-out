import React, { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './StatsBar.module.css'

export interface StatsBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

/**
 * StatsBar molecule — horizontal metric layout with wrapping support.
 */
export const StatsBar = forwardRef<HTMLDivElement, StatsBarProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={clsx(styles.root, className)} {...rest}>
        {children}
      </div>
    )
  },
)

StatsBar.displayName = 'StatsBar'
