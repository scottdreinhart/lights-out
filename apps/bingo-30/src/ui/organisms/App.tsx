/**
 * Mini Bingo (3x3) Application Component
 */

import { useGame } from '@/app'
import { BingoCard, DrawPanel } from '@/ui/organisms'
import { useState } from 'react'
import styles from './App.module.css'

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
    <div className={styles.bingoContainer}>
      <div className={styles.bingoGame}>
        <div className={styles.drawPanelContainer}>
          <DrawPanel
            currentNumber={gameState.currentDrawn}
            numbersDrawn={gameState.drawnNumbers.size}
            totalNumbers={25}
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
          <button
            onClick={handleToggleHints}
            className={styles.controlButton}
            aria-label={showHints ? 'Hide hints' : 'Show hints'}
          >
            {showHints ? 'Hide Hints' : 'Show Hints'}
          </button>
          <button
            onClick={handleNewGameClick}
            className={styles.controlButton}
            aria-label="Start a new game"
          >
            New Game
          </button>
          <button
            onClick={handleReset}
            className={styles.controlButton}
            aria-label="Reset current game"
          >
            Reset
          </button>
        </div>

        <div className={styles.cardsContainer}>
          {gameState.cards.map((card, index) => (
            <BingoCard
              key={card.id}
              cardNumber={index}
              numbers={card.numbers}
              drawnNumbers={gameState.drawnNumbers}
              isWinner={gameState.winners.includes(card.id)}
              hintNumbers={showHints ? getHintPositions(card.id, 2) : []}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
