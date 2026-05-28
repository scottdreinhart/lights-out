import { useGame } from '@/app'
import { BingoCard, DrawPanel } from '@/ui/organisms'
import { FeatureShell } from '@/ui/organisms/platform'
import styles from './App.module.css'

export const App: React.FC = () => {
  const {
    card,
    drawnNumbers,
    currentNumber,
    winners,
    gameActive,
    showHints,
    hints,
    draw,
    reset,
    toggleHints,
  } = useGame()

  return (
    <FeatureShell title="Pattern Bingo">
      <div className={styles.app}>
        <div className={styles.main}>
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

          <div className={styles.cardContainer}>
            <BingoCard grid={card} drawnNumbers={drawnNumbers} hints={showHints ? hints : []} />
          </div>
        </div>

        {winners.length > 0 && (
          <div className={styles.winMessage} role="status" aria-live="polite">
            <h2>🎉 You won!</h2>
            <p>Pattern: {winners[0]}</p>
          </div>
        )}

        <footer className={styles.footer}>
          <button
            onClick={toggleHints}
            className={`${styles.hint} ${showHints ? styles.active : ''}`}
            aria-pressed={showHints}
          >
            {showHints ? '✓ Hints' : 'Hints'}
          </button>
          <span className={styles.drawnInfo}>{drawnNumbers.length}/75 drawn</span>
        </footer>
      </div>
    </FeatureShell>
  )
}
