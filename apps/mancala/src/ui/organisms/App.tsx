import { useGameState, useSoundEffects } from '@/app'
import type { Difficulty } from '@/domain'
import { SplashScreen } from '@/ui'
import Menu from '@/ui/molecules/Menu'
import { useCallback, useEffect, useState } from 'react'
import About from './About'
import styles from './App.module.css'
import GameEndNotification from './GameEndNotification'
import { HamburgerMenu } from './HamburgerMenu'
import Settings from './Settings'

type AppScreen = 'splash' | 'game' | 'settings' | 'about'

export default function App() {
  const [difficulty, setLocalDifficulty] = useState<Difficulty>('medium')
  const [appScreen, setAppScreen] = useState<AppScreen>('splash')
  const [menuOpen, setMenuOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)
  const game = useGameState(difficulty)
  const sounds = useSoundEffects()

  const handleSplashComplete = useCallback(() => {
    setAppScreen('game')
  }, [])

  // Activate/deactivate AI based on screen
  useEffect(() => {
    game.setGameActive(appScreen === 'game')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appScreen])

  const handlePitClick = (pit: number) => {
    if (!game.isHumanTurn || !game.validMoves.includes(pit)) {
      return
    }
    sounds.onSelect()
    game.makeMove(pit)
  }

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    sounds.onConfirm()
    setLocalDifficulty(newDifficulty)
    game.setGameActive(false) // Deactivate AI during difficulty change
    game.resetGame()
    // Re-activate after a small delay to ensure proper reset
    setTimeout(() => game.setGameActive(true), 100)
  }

  const handleNavigate = (screen: 'game' | 'settings' | 'about') => {
    setAppScreen(screen)
    setMenuOpen(false)
  }

  const handleNewGame = () => {
    sounds.onConfirm()
    game.resetGame()
    setAppScreen('game')
  }

  if (appScreen === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  if (appScreen === 'settings') {
    return (
      <Settings
        onBack={() => handleNavigate('game')}
        soundEnabled={soundEnabled}
        onSoundToggle={setSoundEnabled}
        darkMode={darkMode}
        onDarkModeToggle={setDarkMode}
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
      />
    )
  }

  if (appScreen === 'about') {
    return <About onBack={() => handleNavigate('game')} />
  }

  return (
    <div
      className={styles.app}
      style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
    >
      <Menu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={handleNavigate}
        onNewGame={handleNewGame}
      />

      <header
        className={styles.header}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
        }}
      >
        <div className={styles.headerContent}>
          <h1>Mancala</h1>
          <p>Kalah — Two-row capture game with AI</p>
        </div>
        <HamburgerMenu
          onRules={() => setShowRulesModal(true)}
          onSettings={() => setShowSettingsModal(true)}
          onAbout={() => setShowAboutModal(true)}
        />
      </header>

      <main style={{ flex: 1, overflow: 'auto' }}>
        <section className={styles.gameBoard}>
          <Board game={game} onPitClick={handlePitClick} />
        </section>

        <GameEndNotification
          winner={game.winner as 0 | 1 | null}
          humanPlayer={game.humanPlayer as 0 | 1}
          isVisible={game.isGameOver}
        />
      </main>

      {/* Rules Modal */}
      {showRulesModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowRulesModal(false)}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '2rem',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <button
              className="modal-close"
              onClick={() => setShowRulesModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
            <h2>How to Play Mancala</h2>
            <p>
              Mancala (also known as Kalah) is a two-player capture and move game. Each player
              controls the 6 pits on their side and attempts to move more stones into their store
              than their opponent.
            </p>
            <h3>Game Rules</h3>
            <ul>
              <li>Players alternate picking up stones from a pit on their side</li>
              <li>Stones are distributed one per pit by moving around the board</li>
              <li>If the last stone lands in a player's store, that player moves again</li>
              <li>
                If the last stone lands in an empty pit on a player's side, capture opposite stones
              </li>
              <li>Game ends when all pits on one side are empty</li>
              <li>Remaining stones go to the owner's store</li>
              <li>Player with the most stones in their store wins</li>
            </ul>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSettingsModal(false)}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '2rem',
              maxWidth: '400px',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <button
              className="modal-close"
              onClick={() => setShowSettingsModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
            <h2>Settings</h2>
            <p>Access the full settings screen to adjust difficulty, sound, and display options.</p>
            <button
              onClick={() => {
                setShowSettingsModal(false)
                handleNavigate('settings')
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Open Settings
            </button>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAboutModal(false)}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '2rem',
              maxWidth: '400px',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <button
              className="modal-close"
              onClick={() => setShowAboutModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
            <h2>About Mancala</h2>
            <p>
              Mancala (also known as Kalah) is an ancient two-player strategy game that dates back
              thousands of years. This digital version includes AI-powered opponents at various
              difficulty levels to challenge your strategic thinking.
            </p>
            <button
              onClick={() => {
                setShowAboutModal(false)
                handleNavigate('about')
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              View Full About
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Board({
  game,
  onPitClick,
}: {
  game: ReturnType<typeof useGameState>
  onPitClick: (pit: number) => void
  isGameOver?: boolean
  winner?: 0 | 1 | null
}) {
  const board = game.gameState.board
  const player0Pits = board.slice(0, 6)
  const player0Store = board[6]
  const player1Pits = board.slice(7, 13)
  const player1Store = board[13]

  return (
    <div className={styles.board}>
      {/* AI Store (left endcap) */}
      <div
        className={`${styles.storeEndcap} ${
          game.isGameOver ? (game.winner === 1 ? styles.winner : styles.loser) : ''
        }`}
        title="AI's Store"
      >
        <span className={styles.label}>AI</span>
        <span className={styles.score}>{player1Store}</span>
      </div>

      {/* Center: Both pit rows */}
      <div className={styles.center}>
        {/* Player 1 (opponent/AI) pits - top row */}
        <div className={styles.pits}>
          {player1Pits.map((stones, idx) => {
            const pitIndex = 12 - idx // Reverse order for opponent
            const isValid = game.validMoves.includes(pitIndex)
            const isDisabled = !game.isHumanTurn || game.isGameOver
            return (
              <button
                key={pitIndex}
                className={`${styles.pit} ${isValid && !isDisabled ? styles.validMove : ''} ${isDisabled ? styles.disabled : ''}`}
                onClick={() => onPitClick(pitIndex)}
                disabled={isDisabled}
                title={`Pit ${pitIndex + 1} (${stones} stones)`}
              >
                <span className={styles.stones}>{stones}</span>
              </button>
            )
          })}
        </div>

        {/* Player 0 (human) pits - bottom row */}
        <div className={styles.pits}>
          {player0Pits.map((stones, idx) => {
            const pitIndex = idx
            const isValid = game.validMoves.includes(pitIndex)
            const isDisabled = !game.isHumanTurn || game.isGameOver
            return (
              <button
                key={pitIndex}
                className={`${styles.pit} ${isValid && !isDisabled ? styles.validMove : ''} ${isDisabled ? styles.disabled : ''}`}
                onClick={() => onPitClick(pitIndex)}
                disabled={isDisabled}
                title={`Pit ${pitIndex + 1} (${stones} stones)`}
              >
                <span className={styles.stones}>{stones}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Player Store (right endcap) */}
      <div
        className={`${styles.storeEndcap} ${
          game.isGameOver ? (game.winner === 0 ? styles.winner : styles.loser) : ''
        }`}
        title="Your Store"
      >
        <span className={styles.label}>You</span>
        <span className={styles.score}>{player0Store}</span>
      </div>
    </div>
  )
}
