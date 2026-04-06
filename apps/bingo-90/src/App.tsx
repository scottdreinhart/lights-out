import { BINGO_VARIANTS, StandardBingoRules, generateBingoCard } from '@games/bingo-core'
import { useCallback, useState } from 'react'
import './App.css'
import { BingoCard } from './BingoCard'

// Get the 90-ball variant
const variant = BINGO_VARIANTS['90-ball']

function App() {
  const [gameState, setGameState] = useState(() => ({
    card: generateBingoCard(variant),
    drawnNumbers: new Set<number>(),
    isPlaying: false,
    lastDrawn: null as number | null,
    winner: false,
  }))

  const rules = new StandardBingoRules(variant)

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
      drawnNumbers: new Set(),
      lastDrawn: null,
      winner: false,
    }))
  }, [])

  const drawNumber = useCallback(() => {
    if (!gameState.isPlaying) return

    // Generate random number from 1-90 not already drawn
    const availableNumbers = Array.from({ length: 90 }, (_, i) => i + 1).filter(
      (num) => !gameState.drawnNumbers.has(num),
    )

    if (availableNumbers.length === 0) return

    const randomIndex = Math.floor(Math.random() * availableNumbers.length)
    const drawnNumber = availableNumbers[randomIndex]

    const newDrawnNumbers = new Set(gameState.drawnNumbers)
    newDrawnNumbers.add(drawnNumber)

    // Check for winner
    const winner = rules.checkWin(gameState.card, {
      drawnNumbers: newDrawnNumbers,
      currentPlayer: 0,
      players: 1,
    })

    setGameState((prev) => ({
      ...prev,
      drawnNumbers: newDrawnNumbers,
      lastDrawn: drawnNumber,
      winner,
    }))
  }, [gameState.isPlaying, gameState.drawnNumbers, gameState.card, rules])

  const resetGame = useCallback(() => {
    setGameState({
      card: generateBingoCard(variant),
      drawnNumbers: new Set(),
      isPlaying: false,
      lastDrawn: null,
      winner: false,
    })
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>90-Ball Bingo</h1>
        <p>Classic UK bingo with 90 numbers</p>
      </header>

      <main className="main">
        <div className="game-controls">
          {!gameState.isPlaying ? (
            <button className="start-button" onClick={startGame}>
              Start Game
            </button>
          ) : (
            <div className="playing-controls">
              <button className="draw-button" onClick={drawNumber}>
                Draw Number
              </button>
              <button className="reset-button" onClick={resetGame}>
                New Card
              </button>
            </div>
          )}
        </div>

        {gameState.lastDrawn && (
          <div className="last-drawn">
            <h2>Last Drawn: {gameState.lastDrawn}</h2>
          </div>
        )}

        {gameState.winner && (
          <div className="winner-message">
            <h2>🎉 BINGO! 🎉</h2>
            <p>You've won!</p>
          </div>
        )}

        <div className="card-container">
          <BingoCard
            card={gameState.card}
            markedNumbers={gameState.drawnNumbers}
            onNumberClick={(number) => {
              // For manual marking if needed
              console.log('Clicked number:', number)
            }}
            disabled={!gameState.isPlaying}
          />
        </div>

        <div className="drawn-numbers">
          <h3>Drawn Numbers ({gameState.drawnNumbers.size}/90)</h3>
          <div className="numbers-grid">
            {Array.from({ length: 90 }, (_, i) => i + 1).map((num) => (
              <span
                key={num}
                className={`number ${gameState.drawnNumbers.has(num) ? 'drawn' : ''}`}
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
