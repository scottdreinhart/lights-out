import { useGameContext } from '@/app'
import type { Player } from '@/domain'
import { Button } from '@/ui/atoms'
import { useState } from 'react'
import styles from './GameSetup.module.css'

export function GameSetup() {
  const { dispatch } = useGameContext()
  const [numPlayers, setNumPlayers] = useState(2)
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2'])

  const handleNumPlayersChange = (num: number) => {
    setNumPlayers(num)
    setPlayerNames(Array.from({ length: num }, (_, i) => `Player ${i + 1}`))
  }

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames]
    newNames[index] = name || `Player ${index + 1}`
    setPlayerNames(newNames)
  }

  const handleStartGame = () => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name,
      score: 0,
      isAI: false,
    }))
    dispatch({ type: 'INITIALIZE_GAME', players })
  }

  return (
    <div className={styles.setup}>
      <div className={styles.container}>
        <h1>Shut the Box</h1>
        <p className={styles.subtitle}>
          Roll dice, flip numbered tiles to match the total. Lowest score wins!
        </p>

        <div className={styles.section}>
          <h2>Number of Players</h2>
          <div className={styles.playerCount}>
            {[2, 3, 4].map((num) => (
              <button
                key={num}
                className={`${styles.countButton} ${numPlayers === num ? styles.active : ''}`}
                onClick={() => handleNumPlayersChange(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Player Names</h2>
          <div className={styles.playerNames}>
            {playerNames.map((name, index) => (
              <input
                key={index}
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Player ${index + 1}`}
                className={styles.nameInput}
              />
            ))}
          </div>
        </div>

        <Button
          onClick={handleStartGame}
          variant="success"
          fullWidth
          className={styles.startButton}
        >
          Start Game
        </Button>
      </div>
    </div>
  )
}
