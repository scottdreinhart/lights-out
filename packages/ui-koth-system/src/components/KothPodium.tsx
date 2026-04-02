import type { KothPodiumProps } from '../types/koth-types'
import styles from './KothPodium.module.css'

/**
 * Podium display for top 3 KotH entries with medals
 * Shows first, second, third place with visual hierarchy
 */
export function KothPodium({ first, second, third, accentColor = '#0087be' }: KothPodiumProps) {
  return (
    <div className={styles.podium}>
      {/* Second place (left) */}
      <div className={styles.position}>
        <div className={styles.medal} style={{ borderColor: '#c0c0c0' }}>
          🥈
        </div>
        {second ? (
          <>
            <h3 className={styles.rank}>2nd Place</h3>
            <p className={styles.name}>{second.username}</p>
            <p className={styles.score}>{second.score.toLocaleString()}</p>
          </>
        ) : (
          <p className={styles.empty}>No entry</p>
        )}
      </div>

      {/* First place (center) */}
      <div className={styles.position} data-position="first">
        <div
          className={styles.medal}
          style={{ borderColor: '#ffd700', backgroundColor: '#fffacd' }}
        >
          👑
        </div>
        {first ? (
          <>
            <h3 className={styles.rank}>1st Place</h3>
            <p className={styles.name}>{first.username}</p>
            <p className={styles.score}>{first.score.toLocaleString()}</p>
          </>
        ) : (
          <p className={styles.empty}>No entry</p>
        )}
      </div>

      {/* Third place (right) */}
      <div className={styles.position}>
        <div className={styles.medal} style={{ borderColor: '#cd7f32' }}>
          🥉
        </div>
        {third ? (
          <>
            <h3 className={styles.rank}>3rd Place</h3>
            <p className={styles.name}>{third.username}</p>
            <p className={styles.score}>{third.score.toLocaleString()}</p>
          </>
        ) : (
          <p className={styles.empty}>No entry</p>
        )}
      </div>
    </div>
  )
}
