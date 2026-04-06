import React from 'react'
import { useGame } from '@/app'
import { BingoCard } from './BingoCard'
import { DrawPanel } from './DrawPanel'
import styles from './App.module.css'

export const App: React.FC = () => {
  const {
    card,
    drawnNumbers,
    currentNumber,
    winners,
    gameActive,
    cardCount,
    showHints,
    hints,
    draw,
    reset,
    toggleHints,
  } = useGame()

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <h1>Pattern Bingo</h1>
        <p className={styles.subtitle}>Match special patterns to win!</p>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Draw Panel */}
        <div className={styles.drawPanelContainer}>
          <DrawPanel
            currentNumber={currentNumber}
            drawnCount={drawnNumbers.length}
            patterns={winners}
            gameActive={gameActive}
            onDraw={draw}
            onReset={reset}
          />
        </div>

        {/* Bingo Card */}
        <div className={styles.cardContainer}>
          <BingoCard
            grid={card}
            drawnNumbers={drawnNumbers}
            hints={showHints ? hints : []}
          />
        </div>
      </main>

      {/* Win Message */}
      {winners.length > 0 && (
        <div className={styles.winMessage} role="status" aria-live="polite">
          <h2>🎉 You won!</h2>
          <p>Pattern: {winners[0]}</p>
        </div>
      )}

      {/* Footer Controls */}
      <footer className={styles.footer}>
        <button
          onClick={toggleHints}
          className={`${styles.hint} ${showHints ? styles.active : ''}`}
          aria-pressed={showHints}
        >
          {showHints ? '✓ Hints' : 'Hints'}
        </button>
        <span className={styles.drawnInfo}>
          {drawnNumbers.length}/75 drawn
        </span>
      </footer>
    </div>
  )
}
