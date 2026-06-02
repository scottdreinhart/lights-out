import { usePatternDetection } from '@/app'
import React from 'react'
import styles from './MultiplierIndicator.module.css'

interface MultiplierIndicatorProps {
  className?: string
}

const MultiplierIndicator: React.FC<MultiplierIndicatorProps> = ({ className }) => {
  const { multiplier, nextMultiplierProgress } = usePatternDetection()

  const progressPercentage = Math.min(100, (nextMultiplierProgress / 100) * 100)

  return (
    <div className={`${styles.root} ${className || ''}`}>
      <div className={styles.header}>
        <span className={styles.label}>Multiplier</span>
        <span className={styles.currentMultiplier}>×{multiplier.toFixed(1)}</span>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }} />
        </div>
        <span className={styles.progressText}>
          {nextMultiplierProgress}/100 to ×{(multiplier + 0.5).toFixed(1)}
        </span>
      </div>

      <div className={styles.multiplierLevels}>
        {[1.0, 1.5, 2.0, 2.5].map((level) => (
          <div
            key={level}
            className={`${styles.level} ${multiplier >= level ? styles.achieved : ''}`}
          >
            ×{level.toFixed(1)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MultiplierIndicator
