import React from 'react'
import styles from './GameStats.module.css'

interface GameStatsProps {
  elapsedTime: number
  difficulty: string
}

export const GameStats: React.FC<GameStatsProps> = ({ elapsedTime, difficulty }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className={styles.stats}>
      <div className={styles.stat}>
        <div>Time</div>
        <span className={styles.statValue}>{formatTime(elapsedTime)}</span>
      </div>
      <div className={styles.stat}>
        <div>Difficulty</div>
        <span className={styles.statValue}>{difficulty.toUpperCase()}</span>
      </div>
    </div>
  )
}