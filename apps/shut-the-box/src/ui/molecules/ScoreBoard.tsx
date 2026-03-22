import type { Player } from '@/domain'
import { PlayerStats } from './PlayerStats'
import styles from './ScoreBoard.module.css'

interface ScoreBoardProps {
  players: Player[]
  currentPlayerIndex: number
}

export function ScoreBoard({ players, currentPlayerIndex }: ScoreBoardProps) {
  return (
    <div className={styles.scoreboard}>
      <h2>Players</h2>
      <div className={styles.playersList}>
        {players.map((player, index) => (
          <PlayerStats
            key={player.id}
            player={player}
            isCurrentPlayer={index === currentPlayerIndex}
            score={player.score}
          />
        ))}
      </div>
    </div>
  )
}
