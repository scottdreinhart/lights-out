import { useGame } from '@/app'
import { BingoCard, DrawPanel, HamburgerMenu } from '@/ui/organisms'
import { useState } from 'react'
import styles from './App.module.css'

export const App: React.FC = () => {
  const [showRules, setShowRules] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div>
            <h1>Pattern Bingo</h1>
            <p className={styles.subtitle}>Match special patterns to win!</p>
          </div>
          <HamburgerMenu
            onRules={() => setShowRules(true)}
            onSettings={() => setShowSettings(true)}
            onAbout={() => setShowAbout(true)}
          />
        </div>
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
          <BingoCard grid={card} drawnNumbers={drawnNumbers} hints={showHints ? hints : []} />
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
        <span className={styles.drawnInfo}>{drawnNumbers.length}/75 drawn</span>
      </footer>

      {showRules && (
        <div
          onClick={() => setShowRules(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
          >
            <h2>How to Play Pattern Bingo</h2>
            <p>
              Match special patterns on your card as numbers are drawn. Different patterns win at
              different times during the game. Numbers 1-75.
            </p>
            <button onClick={() => setShowRules(false)}>Close</button>
          </div>
        </div>
      )}
      {showSettings && (
        <div
          onClick={() => setShowSettings(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
          >
            <h2>Settings</h2>
            <p>Game settings and preferences.</p>
            <button onClick={() => setShowSettings(false)}>Close</button>
          </div>
        </div>
      )}
      {showAbout && (
        <div
          onClick={() => setShowAbout(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
          >
            <h2>About Pattern Bingo</h2>
            <p>
              Pattern-based bingo variant where special patterns determine winners. From the Game
              Platform.
            </p>
            <button onClick={() => setShowAbout(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

const oldReturn = `
        </button>
        <span className={styles.drawnInfo}>
          {drawnNumbers.length}/75 drawn
        </span>
      </footer>
    </div>
  )
}`
