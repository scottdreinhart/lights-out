import { SudokuGame } from '@/ui/organisms'
import { SplashScreen } from '@games/common'
import React, { useCallback, useState } from 'react'
import styles from '../../styles.module.css'
import { HamburgerMenu } from './HamburgerMenu'

type AppPhase = 'splash' | 'playing' | 'help'

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>('splash')
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const handleSplashComplete = useCallback(() => {
    setPhase('playing')
  }, [])

  const handleHowToPlay = useCallback(() => {
    setPhase('help')
  }, [])

  const handleLetsPlay = useCallback(() => {
    setPhase('playing')
  }, [])

  if (phase === 'splash') {
    return (
      <SplashScreen
        onComplete={handleSplashComplete}
        onHowToPlay={handleHowToPlay}
        onLetsPlay={handleLetsPlay}
        title="SUDOKU"
      />
    )
  }

  if (phase === 'help') {
    return (
      <div className={styles.helpScreen}>
        <h2>How to Play Sudoku</h2>
        <p>
          Fill the 9×9 grid with digits 1 through 9 so that each row, column, and 3×3 box contains
          all digits 1–9.
        </p>
        <button onClick={handleLetsPlay} className={styles.actionButton}>
          Let's Play
        </button>
      </div>
    )
  }

  return (
    <div className={styles.appContainer} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <h1>Sudoku</h1>
        <HamburgerMenu
          onRules={() => setShowRulesModal(true)}
          onSettings={() => setShowSettingsModal(true)}
        />
      </header>

      <main style={{ flex: 1, overflow: 'auto' }}>
        <SudokuGame />
      </main>

      {/* Inline modals for during gameplay */}
      {showRulesModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowRulesModal(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowRulesModal(false)}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
        >
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowRulesModal(false)}>
              ✕
            </button>
            <h2>How to Play Sudoku</h2>
            <p>Fill the 9×9 grid with digits 1 through 9 so that each row, column, and 3×3 box contains all digits 1–9.</p>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSettingsModal(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowSettingsModal(false)}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
        >
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowSettingsModal(false)}>
              ✕
            </button>
            <h2>Settings</h2>
            <p>Settings coming soon in Phase 2!</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
