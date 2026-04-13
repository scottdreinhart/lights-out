import { useGame } from '@/app'
import { BingoCard, DrawPanel, HamburgerMenu } from '@/ui/organisms'
import { useState } from 'react'
import styles from './App.module.css'

export const App: React.FC = () => {
  const [cardCount, setCardCount] = useState(1)
  const [showRules, setShowRules] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const { cards, currentNumber, drawNumber, resetGame, winners, drawnCount } = useGame(cardCount)

  return (
    <div className={styles.app}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid #ccc',
        }}
      >
        <h1>Progressive Bingo</h1>
        <HamburgerMenu
          onRules={() => setShowRules(true)}
          onSettings={() => setShowSettings(true)}
          onAbout={() => setShowAbout(true)}
        />
      </header>
      <div className={styles.container}>
        <div className={styles.cardsSection}>
          {cards.map((card, idx) => (
            <div key={idx} className={styles.cardWrapper}>
              <BingoCard card={card} />
            </div>
          ))}
        </div>

        <div className={styles.controlsSection}>
          <DrawPanel
            currentNumber={currentNumber}
            onDraw={drawNumber}
            onReset={resetGame}
            cardCount={cardCount}
            onCardCountChange={setCardCount}
            winners={winners}
            drawnCount={drawnCount}
          />
        </div>
      </div>

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
            <h2>How to Play Progressive Bingo</h2>
            <p>
              Bingo with progressive difficulty. As you win more rounds, the game becomes more
              challenging.
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
            <h2>About Progressive Bingo</h2>
            <p>Progressive bingo variant with escalating difficulty. From the Game Platform.</p>
            <button onClick={() => setShowAbout(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
