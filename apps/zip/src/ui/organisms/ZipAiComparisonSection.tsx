import { Card } from '@games/assets-shared/components'
import styles from './ZipGame.module.css'

type ZipAiComparisonSummary = {
  playerMoves: number
  playerTimeSeconds: number
  optimalMoves: number
  replayTimeMs: number
  savedMoves: number
  savedSeconds: number
}

type ZipAiComparisonSectionProps = {
  summary: ZipAiComparisonSummary
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const ZipAiComparisonSection = ({ summary }: ZipAiComparisonSectionProps) => (
  <Card className={styles.aiComparison}>
    <h3 className={styles.aiComparisonTitle}>AI Run Comparison</h3>
    <div className={styles.aiComparisonGrid}>
      <div className={styles.aiComparisonCell}>
        <span className={styles.aiComparisonLabel}>Player</span>
        <strong>{summary.playerMoves} moves</strong>
        <span>{formatTime(summary.playerTimeSeconds)}</span>
      </div>
      <div className={styles.aiComparisonCell}>
        <span className={styles.aiComparisonLabel}>AI Optimal</span>
        <strong>{summary.optimalMoves} moves</strong>
        <span>{(summary.replayTimeMs / 1000).toFixed(2)}s replay</span>
      </div>
      <div className={styles.aiComparisonCell}>
        <span className={styles.aiComparisonLabel}>Savings</span>
        <strong>{summary.savedMoves} moves</strong>
        <span>{summary.savedSeconds.toFixed(2)}s</span>
      </div>
    </div>
  </Card>
)
