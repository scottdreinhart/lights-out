import { usePatternDetection } from '@/app'
import React from 'react'
import styles from './PatternList.module.css'

interface PatternListProps {
  className?: string
  showScores?: boolean
}

const PatternList: React.FC<PatternListProps> = ({ className, showScores = true }) => {
  const { detectedPatterns, patternScores, totalScore } = usePatternDetection()

  const getPatternIcon = (patternType: string): string => {
    const icons: Record<string, string> = {
      LINE: '📏',
      CORNERS: '🔲',
      FRAME: '🔳',
      PLUS: '➕',
      FULL_HOUSE: '🏠',
    }
    return icons[patternType] || '❓'
  }

  const getPatternName = (patternType: string): string => {
    const names: Record<string, string> = {
      LINE: 'Line',
      CORNERS: 'Corners',
      FRAME: 'Frame',
      PLUS: 'Plus',
      FULL_HOUSE: 'Full House',
    }
    return names[patternType] || patternType
  }

  if (detectedPatterns.length === 0) {
    return (
      <div className={`${styles.root} ${className || ''}`}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🎯</div>
          <div className={styles.emptyText}>No patterns detected yet</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.root} ${className || ''}`} role="list" aria-label="Detected patterns">
      <div className={styles.header}>
        <div className={styles.title}>Detected Patterns</div>
        {showScores && <div className={styles.totalScore}>Total: {totalScore} pts</div>}
      </div>

      <div className={styles.list}>
        {detectedPatterns.map((patternType) => (
          <div key={patternType} className={styles.patternItem} role="listitem">
            <div className={styles.patternInfo}>
              <div className={styles.icon}>{getPatternIcon(patternType)}</div>
              <div className={styles.name}>{getPatternName(patternType)}</div>
            </div>
            {showScores && (
              <div className={styles.score}>{patternScores[patternType] || 0} pts</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PatternList
