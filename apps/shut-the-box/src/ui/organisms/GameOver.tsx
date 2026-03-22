import { useGameContext } from '@/app'
import type { Player } from '@/domain'
import { Button } from '@/ui/atoms'
import styles from './GameOver.module.css'

interface GameOverProps {
  winner: Player | null
  players: Player[]
}

export function GameOver({ winner, players }: GameOverProps) {
  const { resetGame } = useGameContext()

  const sortedPlayers = [...players].sort((a, b) => a.score - b.score)

  return (
    <div className={styles.gameOver}>
      <div className={styles.content}>
        <h1 className={styles.title}>Game Over!</h1>

        {winner && (
          <div className={styles.winner}>
            <div className={styles.winnerBadge}>🎉</div>
            <h2>{winner.name} Wins!</h2>
            <p className={styles.winnerScore}>Final Score: {winner.score}</p>
          </div>
        )}

        <div className={styles.leaderboard}>
          <h3>Final Scores</h3>
          <div className={styles.scoresList}>
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`${styles.scoreRow} ${player.id === winner?.id ? styles.isWinner : ''}`}
              >
                <div className={styles.position}>#{index + 1}</div>
                <div className={styles.playerName}>{player.name}</div>
                <div className={styles.finalScore}>{player.score}</div>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={resetGame} variant="success" fullWidth className={styles.playAgain}>
          Play Again
        </Button>
      </div>
    </div>
  )
}
