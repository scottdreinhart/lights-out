/**
 * Memory Game Board: Main Game Organism
 */

import { useMemory } from '@/app'
import { Card } from '../atoms'
import styles from './Board.module.css'

export function Board() {
  const { state, selectCard, reset, elapsedTime, isWon } = useMemory()

  return (
    <div className={styles.board}>
      <header className={styles.header}>
        <h1>Memory Game</h1>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.label}>Moves:</span>
            <span className={styles.value}>{state.moves}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Matches:</span>
            <span className={styles.value}>
              {state.matches}/{state.cards.length / 2}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Time:</span>
            <span className={styles.value}>{elapsedTime}s</span>
          </div>
        </div>
      </header>

      {isWon && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>🎉 You Won!</h2>
            <p>
              Completed in {state.moves} moves and {elapsedTime} seconds
            </p>
            <button type="button" onClick={reset} className={styles.button}>
              Play Again
            </button>
          </div>
        </div>
      )}

      <div className={styles.grid}>
        {state.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={() => selectCard(card.id)}
            isSelectable={state.selectedCards.length < 2 && !state.isProcessing}
          />
        ))}
      </div>

      <button type="button" onClick={reset} className={styles.resetButton}>
        Reset Game
      </button>
    </div>
  )
}
