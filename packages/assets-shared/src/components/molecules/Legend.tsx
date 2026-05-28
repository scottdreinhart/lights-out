import React, { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './Legend.module.css'

export interface LegendProps extends React.HTMLAttributes<HTMLDivElement> {
  legendTitle: React.ReactNode
  children: React.ReactNode
}

export interface LegendItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  swatchClassName?: string
  children: React.ReactNode
}

/**
 * Legend molecule — titled key/value legend container.
 */
export const Legend = forwardRef<HTMLDivElement, LegendProps>(
  ({ className, legendTitle, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={clsx(styles.root, className)} {...rest}>
        <span className={styles.title}>{legendTitle}</span>
        <div className={styles.items}>{children}</div>
      </div>
    )
  },
)

Legend.displayName = 'Legend'

/**
 * LegendItem molecule — swatch + label/count row for legend entries.
 */
export const LegendItem = forwardRef<HTMLSpanElement, LegendItemProps>(
  ({ className, swatchClassName, children, ...rest }, ref) => {
    return (
      <span ref={ref} className={clsx(styles.item, className)} {...rest}>
        <span className={clsx(styles.swatch, swatchClassName)} aria-hidden="true" />
        {children}
      </span>
    )
  },
)

LegendItem.displayName = 'LegendItem'
