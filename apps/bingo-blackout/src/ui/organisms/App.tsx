import { useGame } from '@/app'
import { MAX_CARDS, MIN_CARDS } from '@/domain'
import { BingoCard, DrawPanel } from '@/ui/organisms'
import { useCallback, useState } from 'react'

type AppPhase = 'splash' | 'help' | 'playing'

export function App() {
  const [phase, setPhase] = useState<AppPhase>('splash')
  const [cardCount, setCardCount] = useState(1)
  const [showHints, setShowHints] = useState(false)
  const {
    gameState,
    drawSingleNumber,
    handleReset,
    handleNewGame,
    toggleAutoDraw,
    changeDrawSpeed,
    getWinnerChecks,
    getHintPositions,
  } = useGame(cardCount)

  const handlePlay = useCallback(() => setPhase('playing'), [])
  const handleHelp = useCallback(() => setPhase('help'), [])

  if (phase === 'splash') {
    return (
      <main className="help-screen">
        <h1>Bingo Blackout</h1>
        <p>Call numbers and cover every playable cell on your card to hit a blackout.</p>
        <button type="button" className="control-button" onClick={handlePlay}>
          Start Game
        </button>
        <button type="button" className="control-button" onClick={handleHelp}>
          How To Play
        </button>
      </main>
    )
  }

  if (phase === 'help') {
    return (
      <main className="help-screen">
        <h2>How to Play Bingo Blackout</h2>
        <p>
          Draw numbers from 1 to 90. Matching numbers are auto-marked on every card. Mark all 24
          playable cells (plus free center) on a card to win.
        </p>
        <button type="button" className="control-button" onClick={handlePlay}>
          Let&apos;s Play
        </button>
      </main>
    )
  }

  return (
    <main className="blackout-app">
      <header className="blackout-header">
        <h1>Bingo Blackout</h1>
        <div className="blackout-controls">
          <label htmlFor="card-count">Cards</label>
          <select
            id="card-count"
            value={cardCount}
            onChange={(event) => {
              const count = Number(event.target.value)
              setCardCount(count)
              handleNewGame(count)
            }}
          >
            {Array.from({ length: MAX_CARDS - MIN_CARDS + 1 }, (_, i) => i + MIN_CARDS).map(
              (value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ),
            )}
          </select>
          <button
            type="button"
            className="control-button"
            onClick={() => setShowHints((value) => !value)}
            aria-label={showHints ? 'Hide hints' : 'Show hints'}
          >
            {showHints ? 'Hide Hints' : 'Show Hints'}
          </button>
          <button type="button" className="control-button" onClick={() => handleNewGame(cardCount)}>
            New Game
          </button>
          <button type="button" className="control-button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </header>

      <section className="blackout-main">
        <DrawPanel
          currentNumber={gameState.currentDrawn}
          numbersDrawn={gameState.drawnNumbers.size}
          totalNumbers={90}
          drawSpeed={gameState.drawSpeed}
          isAutoDrawing={gameState.isAutoDrawing}
          disabled={!gameState.gameActive}
          winners={gameState.winners}
          onDraw={drawSingleNumber}
          onReset={handleReset}
          onToggleAutoDraw={toggleAutoDraw}
          onDrawSpeedChange={changeDrawSpeed}
        />

        <div className="cards-container">
          {gameState.cards.map((card) => {
            const winnerCheck = getWinnerChecks(card.id)
            const hints = showHints ? getHintPositions(card.id) : []
            return (
              <BingoCard
                key={card.id}
                card={card}
                patterns={winnerCheck.patterns}
                hintPositions={hints}
                showHints={showHints}
              />
            )
          })}
        </div>
      </section>
    </main>
  )
}
