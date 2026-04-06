/**
 * Swedish Bingo (Bingo-80) - Main App component
 */

import { useGame } from '@/app'
import { BingoCard, DrawPanel } from '@/ui/organisms'
import { useState } from 'react'
import './App.module.css'

export function App() {
  const [cardCount, setCardCount] = useState(1)
  const [showHints, setShowHints] = useState(false)
  const {
    gameState,
    drawSingleNumber,
    handleReset,
    handleNewGame,
    getWinnerChecks,
    getHintPositions,
  } = useGame(cardCount)

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

  return (
    <div className="bingo-container">
      <div className="bingo-game">
        <div className="draw-panel-container">
          <DrawPanel
            currentNumber={gameState.currentDrawn}
            numbersDrawn={gameState.drawnNumbers.size}
            totalNumbers={80}
            onDraw={handleDraw}
            onReset={handleReset}
            disabled={!gameState.gameActive}
            winners={gameState.winners}
          />

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
            aria-label="Reset the current game"
          >
            Reset
          </button>
        </div>

        <div className="cards-container">
          {gameState.cards.map((card, idx) => (
            <div key={card.id} className="card-wrapper">
              <div className="card-label">Card {idx + 1}</div>
              <BingoCard
                card={card}
                isWinner={gameState.winners.includes(card.id)}
                showHints={showHints}
                hintPositions={getHintPositions()}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
