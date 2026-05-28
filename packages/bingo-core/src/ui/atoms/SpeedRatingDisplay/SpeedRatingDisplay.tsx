import { useSpeedRating } from '@games/bingo-core/app'
import React from 'react'
import styles from './SpeedRatingDisplay.module.css'

interface SpeedRatingDisplayProps {
  className?: string
  compact?: boolean
}

interface RatingMetric {
  label: string
  value: React.ReactNode
}

interface RatingDisplayViewProps {
  className?: string
  compact?: boolean
  skillLevel: string
  rating: React.ReactNode
  metrics: RatingMetric[]
}

const RatingDisplayView: React.FC<RatingDisplayViewProps> = ({
  className,
  compact = false,
  skillLevel,
  rating,
  metrics,
}) => {
  if (compact) {
    return (
      <div className={`${styles.root} ${styles.compact} ${className || ''}`}>
        <span className={styles.skillLevel}>{skillLevel}</span>
        <span className={styles.rating}>{rating}</span>
      </div>
    )
  }

  return (
    <div className={`${styles.root} ${className || ''}`}>
      <div className={styles.header}>
        <span className={styles.skillLevel}>{skillLevel}</span>
        <span className={styles.combinedRating}>{rating}</span>
      </div>
      <div className={styles.metrics}>
        {metrics.map((metric) => (
          <div key={metric.label} className={styles.metric}>
            <span className={styles.metricLabel}>{metric.label}</span>
            <span className={styles.metricValue}>{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const SpeedRatingDisplay: React.FC<SpeedRatingDisplayProps> = ({
  className,
  compact = false,
}) => {
  const { speedScore, accuracyScore, combinedRating, skillLevel } = useSpeedRating()

  return (
    <RatingDisplayView
      className={className}
      compact={compact}
      skillLevel={skillLevel}
      rating={combinedRating}
      metrics={[
        { label: 'Speed', value: speedScore },
        { label: 'Accuracy', value: accuracyScore },
      ]}
    />
  )
}
