import type { Player } from '@/domain'
import styles from './PlayerStats.module.css'

interface PlayerStatsProps {
  player: Player
  isCurrentPlayer: boolean
  score: number
}

export function PlayerStats({ player, isCurrentPlayer, score }: PlayerStatsProps) {
  return (
    <div className={`${styles.stats} ${isCurrentPlayer ? styles.active : ''}`}>
      <div className={styles.name}>
        {player.name}
        {player.isAI && <span className={styles.ai}> (AI)</span>}
      </div>
      <div className={styles.score}>{score}</div>
      {isCurrentPlayer && <div className={styles.badge}>Current Turn</div>}
    </div>
  )
}
