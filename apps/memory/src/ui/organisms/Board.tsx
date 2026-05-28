/**
 * Memory Game Board: Main Game Organism
 */

import { useMemory } from '@/app'
import { ActionBar, Button, StatPill, StatsBar } from '@games/assets-shared'
import { Card } from '../atoms'
import styles from './Board.module.css'

export function Board() {
  const { state, selectCard, reset, elapsedTime, isWon } = useMemory()

  return (
    <div className={styles.board}>
      <header className={styles.header}>
        <h1>Memory Game</h1>
        <StatsBar className={styles.stats}>
          <StatPill label="Moves" value={state.moves} />
          <StatPill label="Matches" value={`${state.matches}/${state.cards.length / 2}`} />
          <StatPill label="Time" value={`${elapsedTime}s`} />
        </StatsBar>
      </header>

      {isWon && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>🎉 You Won!</h2>
            <p>
              Completed in {state.moves} moves and {elapsedTime} seconds
            </p>
            <Button type="button" onClick={reset} className={styles.button} variant="primary">
              Play Again
            </Button>
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

      <ActionBar>
        <Button type="button" onClick={reset} className={styles.resetButton} variant="secondary">
          Reset Game
        </Button>
      </ActionBar>
    </div>
  )
}
