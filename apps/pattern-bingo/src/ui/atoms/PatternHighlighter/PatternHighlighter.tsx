import { usePatternDetection } from '@/app'
import React from 'react'
import styles from './PatternHighlighter.module.css'

interface PatternHighlighterProps {
  className?: string
  onPatternClick?: (patternType: string) => void
}

const PatternHighlighter: React.FC<PatternHighlighterProps> = ({ className, onPatternClick }) => {
  const { detectedPatterns, availablePatterns, currentMultiplier } = usePatternDetection()

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

  return (
    <div
      className={`${styles.root} ${className || ''}`}
      role="region"
      aria-label="Pattern detection status"
    >
      <div className={styles.header}>
        <div className={styles.title}>Patterns</div>
        {currentMultiplier > 1 && (
          <div className={styles.multiplier}>{currentMultiplier}x Multiplier</div>
        )}
      </div>

      <div className={styles.patterns}>
        {availablePatterns.map((patternType) => {
          const isDetected = detectedPatterns.includes(patternType)
          return (
            <button
              key={patternType}
              className={`${styles.pattern} ${isDetected ? styles.detected : styles.available}`}
              onClick={() => onPatternClick?.(patternType)}
              aria-label={`${getPatternName(patternType)} pattern ${isDetected ? 'detected' : 'available'}`}
              aria-pressed={isDetected}
            >
              <div className={styles.icon}>{getPatternIcon(patternType)}</div>
              <div className={styles.name}>{getPatternName(patternType)}</div>
              {isDetected && <div className={styles.checkmark}>✓</div>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default PatternHighlighter
