import React from 'react'

import type { Score, SeriesScore, Token } from '@/domain'
import OMark from '../atoms/OMark.tsx'
import XMark from '../atoms/XMark.tsx'
import { cx } from '../utils/cssModules.ts'
import styles from './Scoreboard.module.css'

interface ScoreboardProps {
  score: Score
  turn: Token
  isGameOver: boolean
  seriesLength: number
  seriesScore: SeriesScore
  seriesWinner?: string | null
  gamesPlayed: number
  onNewSeries: () => void
}

const Scoreboard: React.FC<ScoreboardProps> = ({
  score,
  turn,
  isGameOver,
  seriesLength,
  seriesScore,
  seriesWinner,
  gamesPlayed,
  onNewSeries,
}) => {
  const displayScore = seriesLength > 0 ? seriesScore : score
  const draws = seriesLength > 0 ? gamesPlayed - seriesScore.X - seriesScore.O : score.draws

  return (
    <div className={styles.root} role="region" aria-label="Scoreboard">
      <div className={styles.scoreRow}>
        <div
          className={cx(
            styles.player,
            styles.playerX,
            turn === 'X' && !isGameOver && styles.activePlayer,
          )}
        >
          <XMark className={cx(styles.markIcon, styles.markX)} />
          <span className={styles.value}>{displayScore.X}</span>
        </div>

        <div className={styles.center}>
          <span className={styles.draws}>{draws}</span>
          <span className={styles.drawsLabel}>draws</span>
        </div>

        <div
          className={cx(
            styles.player,
            styles.playerO,
            turn === 'O' && !isGameOver && styles.activePlayer,
          )}
        >
          <span className={styles.value}>{displayScore.O}</span>
          <OMark className={cx(styles.markIcon, styles.markO)} />
        </div>
      </div>

      <div
        className={cx(
          styles.turnIndicator,
          isGameOver && styles.hidden,
          turn === 'X' ? styles.turnX : styles.turnO,
        )}
      >
        {`${turn}'s turn`}
      </div>

      {seriesLength > 0 && !seriesWinner && (
        <div className={styles.seriesInfo}>
          Best of {seriesLength} &middot; Game {gamesPlayed + 1}
        </div>
      )}

      {seriesWinner && (
        <div className={styles.seriesResult}>
          <span className={styles.seriesWonText}>
            {seriesWinner === 'X' ? 'You' : 'CPU'} won the series!
          </span>
          <button type="button" className={styles.newSeriesBtn} onClick={onNewSeries}>
            New Series
          </button>
        </div>
      )}
    </div>
  )
}

Scoreboard.displayName = 'Scoreboard'

export default Scoreboard
