import type { StrategyState } from '@/domain'
import { useResponsiveState } from '@games/app-hook-utils'
import styles from './StrategyAdvisor.module.css'

interface StrategyAdvisorProps {
  strategyState: StrategyState
  sessionAccuracy: number
  className?: string
}

/**
 * StrategyAdvisor Component
 *
 * Displays basic strategy recommendations and learning feedback
 *
 * Features:
 * - Current strategy recommendation (action + confidence)
 * - Expected value for recommended play
 * - Learning mode feedback (correct/incorrect decision)
 * - Session accuracy tracking
 * - Hint system with priority levels
 */
export function StrategyAdvisor({
  strategyState,
  sessionAccuracy,
  className,
}: StrategyAdvisorProps) {
  const _responsive = useResponsiveState()

  // Determine visibility based on mode
  const isVisible = strategyState.mode !== 'none'
  const isLearningMode = strategyState.learningModeEnabled && strategyState.mode === 'learning'

  if (!isVisible) {
    return null
  }

  // Get the current hint
  const hint = strategyState.currentHint

  // Format accuracy percentage
  const accuracyPercent = Math.round(sessionAccuracy * 100)

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Strategy Advisor</h3>
        {isLearningMode && <span className={styles.learningBadge}>Learning Mode</span>}
      </div>

      {/* Mode indicator */}
      <div className={styles.modeIndicator}>
        <div className={styles.modeLabel}>Mode:</div>
        <div className={`${styles.modeName} ${styles[`mode-${strategyState.mode}`]}`}>
          {formatMode(strategyState.mode)}
        </div>
      </div>

      {/* Hint display */}
      {hint && (
        <div className={`${styles.hint} ${styles[`hint-${hint.type}`]}`}>
          <div className={styles.hintIcon}>{getHintIcon(hint.type)}</div>
          <div className={styles.hintContent}>
            <div className={styles.hintMessage}>{hint.message}</div>
            {isLearningMode && <div className={styles.hintPriority}>Priority: {hint.priority}</div>}
          </div>
        </div>
      )}

      {/* Session stats */}
      {isLearningMode && (
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statLabel}>Accuracy</div>
            <div
              className={`${styles.statValue} ${accuracyPercent >= 80 ? styles.excellent : accuracyPercent >= 60 ? styles.good : styles.needsWork}`}
            >
              {accuracyPercent}%
            </div>
          </div>

          <div className={styles.stat}>
            <div className={styles.statLabel}>Decisions</div>
            <div className={styles.statValue}>{strategyState.sessionStats.totalDecisions}</div>
          </div>

          <div className={styles.stat}>
            <div className={styles.statLabel}>Correct</div>
            <div className={styles.statValue}>{strategyState.sessionStats.correctDecisions}</div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hint && (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No recommendation available</p>
        </div>
      )}
    </div>
  )
}

/**
 * Format strategy mode for display
 */
function formatMode(mode: string): string {
  switch (mode) {
    case 'basic':
      return 'Basic Strategy'
    case 'card-counting':
      return 'Card Counting'
    case 'learning':
      return 'Learning Mode'
    default:
      return 'Off'
  }
}

/**
 * Get icon for hint type
 */
function getHintIcon(type: string): string {
  switch (type) {
    case 'recommendation':
      return '💡'
    case 'correction':
      return '✓'
    case 'tip':
      return '⭐'
    case 'warning':
      return '⚠️'
    default:
      return '•'
  }
}
