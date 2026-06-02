/**
 * Swedish Bingo (Bingo-80) - Main App component
 */

import { useGame } from '@/app'
import {
  AboutModal,
  BingoCard,
  DrawPanel,
  HamburgerMenu,
  RulesModal,
  SettingsModal,
} from '@/ui/organisms'
import { useState } from 'react'
import './App.module.css'

export function App() {
  const [cardCount, setCardCount] = useState(1)
  const [showHints, setShowHints] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const { gameState, drawSingleNumber, handleReset, handleNewGame, getHintPositions } =
    useGame(cardCount)

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
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid #ccc',
        }}
      >
        <h1>Bingo 80</h1>
        <HamburgerMenu
          onRules={() => setShowRules(true)}
          onSettings={() => setShowSettings(true)}
          onAbout={() => setShowAbout(true)}
        />
      </header>
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

      <RulesModal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
        title="How to Play Bingo 80"
        sections={[
          {
            heading: 'Objective',
            content: (
              <p>
                Classic Swedish 80-ball bingo. Mark numbers from 1-80 as they are called to complete
                patterns and win.
              </p>
            ),
          },
          {
            heading: 'How to Play',
            content: (
              <ol>
                <li>Cards are automatically generated with random numbers 1-80</li>
                <li>Click "Draw" to select the next number</li>
                <li>Mark numbers on your cards as they are drawn</li>
                <li>Complete a winning pattern to win</li>
              </ol>
            ),
          },
        ]}
      />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  )
}
