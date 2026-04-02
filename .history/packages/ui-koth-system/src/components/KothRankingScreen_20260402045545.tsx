import { memo } from 'react'
import { KothEntryRow } from './KothEntryRow'
import { KothPodium } from './KothPodium'
import styles from './KothRankingScreen.module.css'
import type { KothRankingScreenProps } from '../types/koth-types'

/**
 * Full screen KotH (King of the Hill) ranking display
 * Shows podium, leaderboard, and player's current score
 */
export const KothRankingScreen = memo(function KothRankingScreen({
  gameTitle,
  currentScore,
  entries,
  playerRank,
  playerName,
  onReturn,
  onPlayAgain,
  showTop = 10,
  accentColor = '#0087be',
}: KothRankingScreenProps) {
  const topEntries = entries.slice(0, showTop)
  const first = topEntries[0]
  const second = topEntries[1]
  const third = topEntries[2]

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>{gameTitle}</h1>
          <p className={styles.subtitle}>King of the Hill Rankings</p>
        </header>

        {/* Current Score Card */}
        <div className={styles.scoreCard} style={{ borderColor: accentColor }}>
          <div className={styles.scoreContent}>
            <p className={styles.scoreLabel}>Your Score</p>
            <p className={styles.scoreValue}>{currentScore.toLocaleString()}</p>
            {playerRank && (
              <p className={styles.rankLabel}>
                Rank: <span className={styles.rankValue}>#{playerRank}</span>
              </p>
            )}
          </div>
        </div>

        {/* Podium */}
        {(first || second || third) && (
          <KothPodium first={first} second={second} third={third} accentColor={accentColor} />
        )}

        {/* Leaderboard */}
        <div className={styles.leaderboard}>
          <h2 className={styles.leaderboardTitle}>Leaderboard</h2>

          {topEntries.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No rankings yet. Be the first to claim victory!</p>
            </div>
          ) : (
            <div className={styles.entries}>
              {topEntries.map((entry) => (
                <KothEntryRow
                  key={entry.id}
                  entry={entry}
                  isCurrentPlayer={playerName ? entry.username === playerName : false}
                  accentColor={accentColor}
                />
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {onPlayAgain && (
            <button className={styles.buttonPrimary} onClick={onPlayAgain}>
              Play Again
            </button>
          )}
          <button className={styles.buttonSecondary} onClick={onReturn}>
            Return to Menu
          </button>
        </div>
      </div>
    </div>
  )
})

KothRankingScreen.displayName = 'KothRankingScreen'
