import { useGame, useTheme } from '@/app'
import {
  AboutModal,
  BingoCard,
  DrawPanel,
  HamburgerMenu,
  RulesModal,
  SettingsModal,
} from '@/ui/organisms'
import { useScoring } from '@games/bingo-game-hooks'
import { SplashScreen } from '@games/common'
import type { BingoTheme } from '@games/theme-context'
import { useCallback, useEffect, useState } from 'react'

type BingoPhase = 'splash' | 'playing' | 'help'

/**
 * Pattern Bingo Application
 * 
 * Multiple pattern objectives with multiplier scoring system.
 * Complete full integration with splash, help, modals, and game orchestration.
 */
export function App() {
  const [phase, setPhase] = useState<BingoPhase>('splash')
  const [cardCount, setCardCount] = useState(1)
  const [showHints, setShowHints] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const { theme, setTheme } = useTheme()
  const {
    gameState,
    drawSingleNumber,
    handleReset,
    handleNewGame,
    getWinnerChecks,
    getHintPositions,
  } = useGame(cardCount)

  // Initialize scoring system for variant
  const { scoreWin, getLeaderboard, getStats } = useScoring('pattern', gameState)

  // Apply theme to document root for CSS theming
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleSplashComplete = useCallback(() => {
    setPhase('playing')
  }, [])

  const handleHowToPlay = useCallback(() => {
    setPhase('help')
  }, [])

  const handleLetsPlay = useCallback(() => {
    setPhase('playing')
  }, [])

  const handleDraw = () => {
    drawSingleNumber()
  }

  const handleNewGameClick = () => {
    handleNewGame(cardCount)
  }

  const handleCardCountChange = (newCount: number) => {
    setCardCount(newCount)
    handleNewGame(newCount)
  }

  const handleToggleHints = () => {
    setShowHints(!showHints)
  }

  // Splash Screen
  if (phase === 'splash') {
    return (
      <SplashScreen
        onComplete={handleSplashComplete}
        onHowToPlay={handleHowToPlay}
        onLetsPlay={handleLetsPlay}
        title="PATTERN BINGO"
      />
    )
  }

  // Help Screen
  if (phase === 'help') {
    return (
      <div className="bingo-help-screen">
        <h2>How to Play Pattern Bingo</h2>
        <p>
          Mark off numbers on your cards as they are called. Complete multiple pattern objectives 
          to earn multiplier bonuses! Patterns include lines, corners, frames, plus signs, and full house.
        </p>
        <button onClick={handleLetsPlay} className="bingo-action-button">
          Let's Play
        </button>
      </div>
    )
  }

  // Playing Screen
  return (
    <VariantProvider variantId="pattern">
    <div className="bingo-container">
      <div className="bingo-app-header">
        <div className="app-header-content">
          <h1 className="app-title">Pattern Bingo</h1>
          <div className="header-controls">
            <HamburgerMenu
              onRules={() => setShowRules(true)}
              onSettings={() => setShowSettings(true)}
              onAbout={() => setShowAbout(true)}
            />
          </div>
        </div>
      </div>

      {/* Score Display */}
      <div className="score-display">
        {getLeaderboard.length > 0 && (
          <div className="score-board">
            <h3>Leaderboard</h3>
            <ul className="leaderboard-list">
              {getLeaderboard.map((entry, idx) => (
                <li key={entry.cardId} className="leaderboard-entry">
                  <span className="rank">#{idx + 1}</span>
                  <span className="card-label">Card {entry.cardId}</span>
                  <span className="score">{entry.score} pts</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {getStats && (
          <div className="game-stats">
            <div className="stat">
              <span className="label">Total Wins:</span>
              <span className="value">{getStats.totalWins}</span>
            </div>
            <div className="stat">
              <span className="label">Total Points:</span>
              <span className="value">{getStats.totalPoints}</span>
            </div>
          </div>
        )}
      </div>

      <div className="bingo-game">
        <div className="draw-panel-container">
          <div className="card-count-control">
            <label htmlFor="card-count">Cards:</label>
            <select
              id="card-count"
              value={cardCount}
              onChange={(e) => handleCardCountChange(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="controls-toolbar">
            <button
              onClick={handleToggleHints}
              className="control-button"
              aria-label={showHints ? 'Hide hints' : 'Show hints'}
            >
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </button>
            <button
              onClick={handleNewGameClick}
              className="control-button"
              aria-label="Start a new game"
            >
              New Game
            </button>
            <button
              onClick={handleReset}
              className="control-button"
              aria-label="Reset current game"
            >
              Reset
            </button>
          </div>

          <DrawPanel
            currentNumber={gameState.currentDrawn}
            numbersDrawn={gameState.drawnNumbers.size}
            totalNumbers={75}
            onDraw={handleDraw}
            onReset={handleReset}
            disabled={!gameState.gameActive}
            winners={gameState.winners}
          />
        </div>

        <div className="cards-container">
          {gameState.cards.map((card) => {
            const winnerCheck = getWinnerChecks(card.id)
            const hintPositions = showHints ? getHintPositions(card.id) : []
            if (winnerCheck.patterns.length > 0) {
              winnerCheck.patterns.forEach((pattern) => {
                scoreWin(card.id, pattern)
              })
            }
            return (
              <BingoCard
                key={card.id}
                card={card}
                patterns={winnerCheck.patterns}
                hintPositions={hintPositions}
                showHints={showHints}
              />
            )
          })}
        </div>
      </div>

      {/* Modals - only accessible in playing phase */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        selectedTheme={theme}
        onThemeChange={setTheme}
      />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
    </div>
    </VariantProvider>
  )
}
