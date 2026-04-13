import { useSpeedRating } from '@bingo-core/app'
import React from 'react'
import styles from './SpeedRatingDisplay.module.css'

interface SpeedRatingDisplayProps {
  className?: string
  compact?: boolean
}

export const SpeedRatingDisplay: React.FC<SpeedRatingDisplayProps> = ({
  className,
  compact = false,
}) => {
  const { speedScore, accuracyScore, combinedRating, skillLevel } = useSpeedRating()

  // Simple responsive classes based on window width
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 900
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600

  if (compact) {
    return (
      <div
        className={`${styles.root} ${styles.compact} ${className || ''}`}
        style={{
          padding: isMobile ? '6px 10px' : isDesktop ? '8px 16px' : '7px 12px',
        }}
      >
        <span className={styles.skillLevel}>{skillLevel}</span>
        <span className={styles.rating}>{combinedRating}</span>
      </div>
    )
  }

  return (
    <div
      className={`${styles.root} ${className || ''}`}
      style={{
        padding: isMobile ? '10px 14px' : isDesktop ? '14px 20px' : '12px 16px',
      }}
    >
      <div className={styles.header}>
        <span className={styles.skillLevel}>{skillLevel}</span>
        <span className={styles.combinedRating}>{combinedRating}</span>
      </div>
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Speed</span>
          <span className={styles.metricValue}>{speedScore}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Accuracy</span>
          <span className={styles.metricValue}>{accuracyScore}</span>
        </div>
      </div>
    </div>
  )
}
