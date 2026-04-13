/**
 * App — Phase-based navigation wrapper for TicTacToeGame.
 *
 * Manages game phases: splash → menu → playing → game-over
 * Plus: settings, help, stats overlays accessible from menu and during play
 */

import { useSoundEffects, useStats } from '@/app'
import type { Difficulty } from '@/domain'
import {
  GameOverOverlay,
  HelpOverlay,
  MainMenu,
  SettingsOverlay,
  StatsOverlay,
} from '@/ui/molecules'
import SplashScreen from '@/ui/molecules/SplashScreen'
import { useCallback, useState } from 'react'
import TicTacToeGame from './TicTacToeGame'
import { HamburgerMenu } from './HamburgerMenu'

type AppPhase = 'splash' | 'menu' | 'playing' | 'settings' | 'help' | 'stats' | 'game-over'

interface GameOverState {
  outcome: any
  timeToWin?: number
  streak?: number
  seriesWinner?: string | null
  seriesScore?: [number, number]
}

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('splash')
  const [gameOverState] = useState<GameOverState | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [seriesLength, setSeriesLength] = useState(1)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const { stats, resetStats } = useStats()
  const { soundEnabled, toggleSound } = useSoundEffects()

  // Navigation callbacks
  const handleSplashComplete = useCallback(() => {
    setPhase('menu')
  }, [])

  const handleHowToPlay = useCallback(() => {
    setPhase('help')
  }, [])

  const handlePlayClicked = useCallback(() => {
    setPhase('playing')
  }, [])

  const handleSettingsClicked = useCallback(() => {
    setPhase('settings')
  }, [])

  const handleHelpClicked = useCallback(() => {
    setPhase('help')
  }, [])

  const handleStatsClicked = useCallback(() => {
    setPhase('stats')
  }, [])

  const handleBackToMenu = useCallback(() => {
    setPhase('menu')
  }, [])

  const handleResetStats = useCallback(() => {
    resetStats()
  }, [resetStats])

  const handleSetDifficulty = useCallback((d: Difficulty) => {
    setDifficulty(d)
  }, [])

  const handleSetSeriesLength = useCallback((n: number) => {
    setSeriesLength(n)
  }, [])

  // Shows SplashScreen with interactive buttons
  if (phase === 'splash') {
    return (
      <SplashScreen
        onComplete={handleSplashComplete}
        onHowToPlay={handleHowToPlay}
        onLetsPlay={handlePlayClicked}
      />
    )
  }

  // Shows MainMenu
  if (phase === 'menu') {
    return (
      <MainMenu
        onPlay={handlePlayClicked}
        onSettings={handleSettingsClicked}
        onHelp={handleHelpClicked}
        onStats={handleStatsClicked}
      />
    )
  }

  // Shows SettingsOverlay
  if (phase === 'settings') {
    return (
      <SettingsOverlay
        difficulty={difficulty}
        seriesLength={seriesLength}
        soundEnabled={soundEnabled}
        onSetDifficulty={handleSetDifficulty}
        onSetSeriesLength={handleSetSeriesLength}
        onToggleSound={toggleSound}
        onBack={handleBackToMenu}
      />
    )
  }

  // Shows HelpOverlay
  if (phase === 'help') {
    return <HelpOverlay onBack={handleBackToMenu} />
  }

  // Shows StatsOverlay
  if (phase === 'stats') {
    return (
      <StatsOverlay
        wins={stats.wins}
        losses={stats.losses}
        streak={stats.streak}
        bestStreak={stats.bestStreak}
        bestTime={null}
        onReset={handleResetStats}
        onBack={handleBackToMenu}
      />
    )
  }

  // Shows GameOverOverlay
  if (phase === 'game-over' && gameOverState) {
    return (
      <GameOverOverlay
        outcome={gameOverState.outcome}
        timeToWin={gameOverState.timeToWin}
        streak={gameOverState.streak}
        seriesWinner={gameOverState.seriesWinner}
        seriesScore={gameOverState.seriesScore}
        onPlayAgain={handlePlayClicked}
        onMenu={handleBackToMenu}
      />
    )
  }

  // Shows TicTacToeGame (playing phase)
  // Note: TicTacToeGame currently manages its own settings via hooks
  // Future: pass difficulty/seriesLength as props to TicTacToeGame
  return (
    <div className="game-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <h1>TicTacToe</h1>
        <HamburgerMenu
          onRules={() => setShowRulesModal(true)}
          onSettings={() => setShowSettingsModal(true)}
          onHelp={() => setShowHelpModal(true)}
        />
      </header>

      <main style={{ flex: 1, overflow: 'auto' }}>
        <TicTacToeGame />
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
            <h2>How to Play</h2>
            <p>TicTacToe is a classic game where you compete against the AI to get three in a row (horizontal, vertical, or diagonal).</p>
            <p>Choose your difficulty level and play series of matches to rack up wins!</p>
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
            <p>Sound: {soundEnabled ? '🔊 On' : '🔇 Off'}</p>
            <button onClick={toggleSound}>
              {soundEnabled ? 'Disable' : 'Enable'} Sound
            </button>
          </div>
        </div>
      )}

      {showHelpModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowHelpModal(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowHelpModal(false)}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
        >
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowHelpModal(false)}>
              ✕
            </button>
            <h2>Help</h2>
            <p>Click on any square to make your move. The AI will respond with its move.</p>
            <p>First to get three in a row wins the round. Win enough rounds to win the series!</p>
          </div>
        </div>
      )}
    </div>
  )
}
