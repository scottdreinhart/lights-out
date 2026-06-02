import React, { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './RatingDisplay.module.css'

export interface RatingDisplayMetric {
  label: string
  value: React.ReactNode
}

export interface RatingDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  skillLevel: string
  rating: React.ReactNode
  metrics?: RatingDisplayMetric[]
  compact?: boolean
}

/**
 * RatingDisplay atom — generic skill/rating view with optional metric details.
 */
export const RatingDisplay = forwardRef<HTMLDivElement, RatingDisplayProps>(
  ({ className, skillLevel, rating, metrics = [], compact = false, ...rest }, ref) => {
    if (compact) {
      return (
        <div ref={ref} className={clsx(styles.root, styles.compact, className)} {...rest}>
          <span className={styles.skillLevel}>{skillLevel}</span>
          <span className={styles.rating}>{rating}</span>
        </div>
      )
    }

    return (
      <div ref={ref} className={clsx(styles.root, className)} {...rest}>
        <div className={styles.header}>
          <span className={styles.skillLevel}>{skillLevel}</span>
          <span className={styles.combinedRating}>{rating}</span>
        </div>

        {metrics.length > 0 ? (
          <div className={styles.metrics}>
            {metrics.map((metric) => (
              <div key={metric.label} className={styles.metric}>
                <span className={styles.metricLabel}>{metric.label}</span>
                <span className={styles.metricValue}>{metric.value}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    )
  },
)

RatingDisplay.displayName = 'RatingDisplay'
