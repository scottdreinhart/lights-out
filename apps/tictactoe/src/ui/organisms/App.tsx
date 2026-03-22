/**
 * App — Phase-based navigation wrapper for TicTacToeGame.
 *
 * Manages game phases: menu → playing → game-over
 * Plus: settings, help, stats overlays accessible from menu and during play
 */

import { useStats, useSoundEffects } from '@/app'
import type { Difficulty } from '@/domain'
import {
  GameOverOverlay,
  HelpOverlay,
  MainMenu,
  SettingsOverlay,
  StatsOverlay,
} from '@/ui/molecules'
import { useCallback, useState } from 'react'
import TicTacToeGame from './TicTacToeGame'

type AppPhase = 'menu' | 'playing' | 'settings' | 'help' | 'stats' | 'game-over'

interface GameOverState {
  outcome: any
  timeToWin?: number
  streak?: number
  seriesWinner?: string | null
  seriesScore?: [number, number]
}

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('menu')
  const [gameOverState] = useState<GameOverState | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [seriesLength, setSeriesLength] = useState(1)

  const { stats, resetStats } = useStats()
  const { soundEnabled, toggleSound } = useSoundEffects()

  // Navigation callbacks
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
  return <TicTacToeGame />
}
