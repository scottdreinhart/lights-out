import type { KothEntryRowProps } from '../types/koth-types'
import styles from './KothEntryRow.module.css'

/**
 * Single rank entry row in KotH leaderboard
 */
export function KothEntryRow({
  entry,
  isCurrentPlayer = false,
  accentColor = '#0087be',
}: KothEntryRowProps) {
  const timeAgo = getTimeAgoString(entry.timestamp)

  return (
    <div
      className={`${styles.row} ${isCurrentPlayer ? styles.currentPlayer : ''}`}
      style={isCurrentPlayer ? { borderLeftColor: accentColor } : {}}
    >
      <div className={styles.rank}>#{entry.rank}</div>

      <div className={styles.player}>
        <p className={styles.name}>
          {entry.username}
          {isCurrentPlayer && <span className={styles.badge}>You</span>}
        </p>
        {entry.difficulty && <p className={styles.meta}>{entry.difficulty}</p>}
      </div>

      <div className={styles.score}>
        <p className={styles.scoreValue}>{entry.score.toLocaleString()}</p>
        {entry.duration && <p className={styles.meta}>{formatSeconds(entry.duration)}</p>}
      </div>

      {entry.wins !== undefined && (
        <div className={styles.wins}>
          <p className={styles.winsValue}>{entry.wins}</p>
        </div>
      )}

      <div className={styles.time}>
        <p className={styles.timeAgo}>{timeAgo}</p>
      </div>
    </div>
  )
}

/**
 * Format seconds to human readable duration
 */
function formatSeconds(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (minutes < 60) return `${minutes}m ${secs}s`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

/**
 * Format timestamp to relative time (e.g., "2 hours ago")
 */
function getTimeAgoString(timestamp: number): string {
  const now = Date.now()
  const diffMs = now - timestamp
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  // For older entries, show date
  const date = new Date(timestamp)
  return date.toLocaleDateString()
}
