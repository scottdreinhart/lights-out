import React, { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './StatPill.module.css'

export interface StatPillProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: React.ReactNode
  addon?: React.ReactNode
}

/**
 * StatPill atom — compact label/value metric presentation with optional addon.
 */
export const StatPill = forwardRef<HTMLDivElement, StatPillProps>(
  ({ className, label, value, addon, ...rest }, ref) => {
    return (
      <div ref={ref} className={clsx(styles.root, className)} {...rest}>
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>{value}</div>
        {addon ? <div className={styles.addon}>{addon}</div> : null}
      </div>
    )
  },
)

StatPill.displayName = 'StatPill'
