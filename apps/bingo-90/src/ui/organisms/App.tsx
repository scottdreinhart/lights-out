/**
 * Bingo 90 Application Component
 */

import { useGame } from '@/app'
import { DrawPanel } from '@/ui/organisms'
import { useState } from 'react'
import styles from './App.module.css'

export function App() {
  const [cardCount, setCardCount] = useState(1)
  const [showHints, setShowHints] = useState(false)
  const { gameState, drawSingleNumber, handleReset, handleNewGame } = useGame(cardCount)

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
    <div className={styles.bingoContainer}>
      <h1>Bingo 90</h1>
      <div className={styles.bingoGame}>
        <div className={styles.drawPanelContainer}>
          <DrawPanel
            currentNumber={gameState.currentDrawn}
            numbersDrawn={gameState.drawnNumbers.size}
            totalNumbers={90}
            onDraw={handleDraw}
            onReset={handleReset}
            disabled={!gameState.gameActive}
            winners={gameState.winners}
          />
          <div className={styles.cardCountControl}>
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
        <div className={styles.controlsToolbar}>
          <button onClick={handleNewGameClick}>New Game</button>
          <button onClick={handleReset}>Reset</button>
          <button onClick={handleToggleHints}>Toggle Hints</button>
        </div>
      </div>
      {gameState.winners.length > 0 && (
        <div className={styles.winnersDisplay}>
          <h2>Winners: {gameState.winners.join(', ')}</h2>
        </div>
      )}
    </div>
  )
}
