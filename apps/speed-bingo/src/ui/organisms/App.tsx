import { useGame } from '@/app'
import { MAX_CARDS, MIN_CARDS } from '@/domain'
import { SplashScreen } from '@/ui'
import { BingoCard, DrawPanel } from '@/ui/organisms'
import { useCallback, useState } from 'react'

type BingoPhase = 'splash' | 'playing' | 'help'

/**
 * Speed Bingo Application - Ultra-fast draw rate variant
 */
export function App() {
  const [phase, setPhase] = useState<BingoPhase>('splash')
  const [cardCount, setCardCount] = useState(1)
  const [showHints, setShowHints] = useState(false)
  const {
    gameState,
    drawSingleNumber,
    handleReset,
    handleNewGame,
    changeDrawSpeed,
    toggleAutoDraw,
    getWinnerChecks,
    getHintPositions,
  } = useGame(cardCount)

  const handleSplashComplete = useCallback(() => setPhase('playing'), [])
  const handleHowToPlay = useCallback(() => setPhase('help'), [])
  const handleLetsPlay = useCallback(() => setPhase('playing'), [])
  const handleDraw = () => drawSingleNumber()
  const handleNewGameClick = () => handleNewGame(cardCount)
  const handleCardCountChange = (newCount: number) => {
    setCardCount(newCount)
    handleNewGame(newCount)
  }
  const handleToggleHints = () => setShowHints(!showHints)

  if (phase === 'splash') {
    return (
      <SplashScreen
        onComplete={handleSplashComplete}
        onHowToPlay={handleHowToPlay}
        onLetsPlay={handleLetsPlay}
        title="SPEED BINGO"
      />
    )
  }
  if (phase === 'help') {
    return (
      <div className="bingo-help-screen">
        <h2>How to Play Speed Bingo</h2>
        <p>
          Numbers are called continuously. Mark fast, complete a line, and win before the pool runs
          dry.
        </p>
        <button onClick={handleLetsPlay} className="bingo-action-button">
          Let's Play
        </button>
      </div>
    )
  }

  return (
    <div className="bingo-container">
      <div className="bingo-app-header">
        <div className="app-header-content">
          <h1 className="app-title">Speed Bingo</h1>
          <div className="header-controls">
            <label htmlFor="card-count">Cards</label>
            <select
              id="card-count"
              value={cardCount}
              onChange={(e) => handleCardCountChange(Number(e.target.value))}
            >
              {Array.from({ length: MAX_CARDS - MIN_CARDS + 1 }, (_, i) => i + MIN_CARDS).map(
                (num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ),
              )}
            </select>
            <button
              type="button"
              onClick={handleToggleHints}
              className="control-button"
              aria-label={showHints ? 'Hide hints' : 'Show hints'}
            >
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </button>
            <button
              type="button"
              onClick={handleNewGameClick}
              className="control-button"
              aria-label="Start new game"
            >
              New Game
            </button>
            <button type="button" onClick={handleReset} className="control-button">
              Reset
            </button>
          </div>
        </div>
      </div>
      <div className="bingo-game">
        <div className="draw-panel-container">
          <DrawPanel
            currentNumber={gameState.currentDrawn}
            numbersDrawn={gameState.drawnNumbers.size}
            totalNumbers={75}
            drawSpeed={gameState.drawSpeed}
            isAutoDrawing={gameState.isAutoDrawing}
            onDraw={handleDraw}
            onReset={handleReset}
            onToggleAutoDraw={toggleAutoDraw}
            onDrawSpeedChange={changeDrawSpeed}
            disabled={!gameState.gameActive}
            winners={gameState.winners}
          />
        </div>
        <div className="cards-container">
          {gameState.cards.map((card) => {
            const winnerCheck = getWinnerChecks(card.id)
            const hintPositions = showHints ? getHintPositions(card.id) : []
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
    </div>
  )
}
