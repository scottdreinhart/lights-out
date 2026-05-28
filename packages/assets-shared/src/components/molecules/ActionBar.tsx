import React, { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './ActionBar.module.css'

export interface ActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

/**
 * ActionBar molecule — shared action button row with responsive wrapping.
 */
export const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={clsx(styles.root, className)} {...rest}>
        {children}
      </div>
    )
  },
)

ActionBar.displayName = 'ActionBar'
