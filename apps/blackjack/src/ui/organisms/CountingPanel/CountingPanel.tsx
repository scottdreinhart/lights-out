import type { CardCountingState } from '@/domain'
import { useResponsiveState } from '@games/app-hook-utils'
import styles from './CountingPanel.module.css'

interface CountingPanelProps {
  countingState: CardCountingState | null
  countAccuracy: number
  difficulty: string
  penetrationPercent: number
  countingEnabled: boolean
  className?: string
}

/**
 * CountingPanel Component
 *
 * Displays Hi-Lo card counting information including:
 * - Running count and true count
 * - Deck penetration (cards dealt vs remaining)
 * - Player advantage estimate
 * - Betting strategy recommendations
 * - Counting accuracy (in learning mode)
 */
export function CountingPanel({
  countingState,
  countAccuracy,
  difficulty,
  penetrationPercent,
  countingEnabled,
  className,
}: CountingPanelProps) {
  const _responsive = useResponsiveState()

  if (!countingEnabled || !countingState) {
    return null
  }

  // Determine advantage level for color coding
  const advantageLevel = getAdvantageLevel(countingState.advantage)

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Card Counting</h3>
        <span className={`${styles.difficulty} ${styles[`difficulty-${difficulty}`]}`}>
          {formatDifficulty(difficulty)}
        </span>
      </div>

      {/* Count display */}
      <div className={styles.countsSection}>
        <div className={styles.countBox}>
          <div className={styles.countLabel}>Running Count</div>
          <div
            className={`${styles.countValue} ${countingState.runningCount >= 0 ? styles.positive : styles.negative}`}
          >
            {formatCount(countingState.runningCount)}
          </div>
        </div>

        <div className={styles.countBox}>
          <div className={styles.countLabel}>True Count</div>
          <div
            className={`${styles.countValue} ${countingState.trueCount >= 1 ? styles.positive : styles.negative}`}
          >
            {formatCount(countingState.trueCount)}
          </div>
        </div>
      </div>

      {/* Advantage indicator */}
      <div className={`${styles.advantage} ${styles[`advantage-${advantageLevel}`]}`}>
        <div className={styles.advantageLabel}>Player Advantage</div>
        <div className={styles.advantageValue}>{(countingState.advantage * 100).toFixed(2)}%</div>
        <div className={styles.advantageBar}>
          <div
            className={styles.advantageFill}
            style={{ width: `${Math.min(Math.max(countingState.advantage * 100 + 3, 0), 100)}%` }}
          />
        </div>
      </div>

      {/* Penetration */}
      <div className={styles.penetration}>
        <div className={styles.penetrationLabel}>Deck Penetration</div>
        <div className={styles.penetrationBar}>
          <div className={styles.penetrationFill} style={{ width: `${penetrationPercent}%` }} />
        </div>
        <div className={styles.penetrationText}>{penetrationPercent.toFixed(0)}%</div>
      </div>

      {/* Betting advice */}
      {countingState.advantage > 0 && (
        <div className={styles.advice}>
          <div className={styles.adviceLabel}>Suggested Bet: </div>
          <div className={styles.adviceValue}>
            {formatBetMultiplier(countingState.betMultiplier)}× base
          </div>
        </div>
      )}

      {/* Counting accuracy (learning mode) */}
      {countAccuracy !== undefined && (
        <div className={styles.accuracy}>
          <div className={styles.accuracyLabel}>Accuracy</div>
          <div
            className={`${styles.accuracyValue} ${countAccuracy >= 80 ? styles.excellent : countAccuracy >= 60 ? styles.good : styles.needsWork}`}
          >
            {Math.round(countAccuracy)}%
          </div>
        </div>
      )}

      {/* Remaining decks */}
      <div className={styles.remaining}>
        <div className={styles.remainingLabel}>Approx. Decks Remaining</div>
        <div className={styles.remainingValue}>{countingState.decksRemaining.toFixed(1)}</div>
      </div>
    </div>
  )
}

/**
 * Format count value
 */
function formatCount(count: number): string {
  return count >= 0 ? `+${count}` : `${count}`
}

/**
 * Format difficulty level
 */
function formatDifficulty(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'Beginner'
    case 'intermediate':
      return 'Intermediate'
    case 'advanced':
      return 'Advanced'
    default:
      return difficulty
  }
}

/**
 * Format bet multiplier
 */
function formatBetMultiplier(multiplier: number): string {
  return multiplier.toFixed(1)
}

/**
 * Determine advantage level for styling
 */
function getAdvantageLevel(advantage: number): string {
  if (advantage > 0.02) {
    return 'strong'
  }
  if (advantage > 0.01) {
    return 'good'
  }
  if (advantage > -0.01) {
    return 'neutral'
  }
  if (advantage > -0.02) {
    return 'slight'
  }
  return 'disadvantage'
}
