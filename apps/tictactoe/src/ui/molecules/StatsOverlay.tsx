/**
 * StatsOverlay — high scores and session statistics.
 */

import styles from './Overlay.module.css'

interface StatsOverlayProps {
  wins: number
  losses: number
  streak: number
  bestStreak: number
  bestTime: number | null
  onReset: () => void
  onBack: () => void
}

export function StatsOverlay({
  wins,
  losses,
  streak,
  bestStreak,
  bestTime,
  onReset,
  onBack,
}: StatsOverlayProps) {
  const winRate = wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0

  return (
    <div className={styles.overlay}>
      <h1 className={styles.title}>Stats</h1>

      <div className={styles.statsRow} style={{ marginTop: '2rem', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1rem' }}>
          <div className={styles.scoreDisplay}>{wins}</div>
          <div className={styles.label} style={{ marginTop: 0 }}>
            Wins
          </div>
        </div>
      </div>

      <div className={styles.statsRow} style={{ gap: '1.5rem', marginTop: '1rem' }}>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent, #667eea)' }}>
            {losses}
          </div>
          <div className={styles.label} style={{ marginTop: '0.25rem', marginBottom: 0 }}>
            Losses
          </div>
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent, #667eea)' }}>
            {winRate}%
          </div>
          <div className={styles.label} style={{ marginTop: '0.25rem', marginBottom: 0 }}>
            Win Rate
          </div>
        </div>
      </div>

      <div className={styles.statsRow} style={{ gap: '1.5rem', marginTop: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent, #667eea)' }}>
            {streak}
          </div>
          <div className={styles.label} style={{ marginTop: '0.25rem', marginBottom: 0 }}>
            Streak
          </div>
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent, #667eea)' }}>
            {bestStreak}
          </div>
          <div className={styles.label} style={{ marginTop: '0.25rem', marginBottom: 0 }}>
            Best Streak
          </div>
        </div>
      </div>

      {bestTime !== null && (
        <div className={styles.statsRow} style={{ marginTop: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent, #667eea)' }}>
              {bestTime.toFixed(1)}s
            </div>
            <div className={styles.label} style={{ marginTop: '0.25rem', marginBottom: 0 }}>
              Fastest Win
            </div>
          </div>
        </div>
      )}

      <div className={styles.menu} style={{ marginTop: '2rem', width: '100%', maxWidth: '300px' }}>
        <button className={styles.menuBtn} onClick={onReset}>
          Reset Stats
        </button>
        <button className={styles.menuBtnPrimary} onClick={onBack} autoFocus>
          Back
        </button>
      </div>
    </div>
  )
}
