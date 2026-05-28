/**
 * Farkle Game Application
 * Demonstrates @games/ui-dice-system with hold/bank mechanics
 */

import { useGame } from '@/app'
import { GameBoard } from '@/ui/molecules'
import { useEffect, useState } from 'react'
import styles from './App.module.css'

export default function App() {
  const {
    gameState,
    startGame,
    rollAll,
    rollRemaining,
    toggleDieSelection,
    bankSelection,
    endTurn,
    farkle,
  } = useGame()

  const [showMenu, setShowMenu] = useState(true)

  useEffect(() => {
    if (!showMenu && gameState.dice.allDice.length === 0 && gameState.phase === 'rolling') {
      // Auto-roll on game start
      const timer = setTimeout(rollAll, 500)
      return () => clearTimeout(timer)
    }
  }, [showMenu, gameState.phase, gameState.dice.allDice.length, rollAll])

  if (showMenu) {
    return (
      <div className={styles.menu}>
        <div className={styles.menuContent}>
          <h1>🎲 Farkle</h1>
          <p>A game of risk and reward with dice</p>

          <div className={styles.rules}>
            <h2>How to Play</h2>
            <ul>
              <li>Roll dice to score: 1s (100pts), 5s (50pts), three-of-a-kind, etc.</li>
              <li>Select scoreable dice to keep them.</li>
              <li>After scoring dice, choose to Bank your points or roll again.</li>
              <li>If you roll with no scoreable dice, you Farkle and lose the round!</li>
              <li>First to 10,000 points wins!</li>
            </ul>
          </div>

          <button onClick={() => setShowMenu(false)} className={styles.startButton}>
            Start Game
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <GameBoard
        allDice={gameState.dice.allDice}
        selectedIndices={gameState.dice.selectedIndices}
        heldDice={gameState.dice.heldDice}
        bankedScore={gameState.banking.bankedScore}
        atRiskScore={gameState.banking.atRiskScore}
        isRolling={gameState.dice.isRolling}
        phase={gameState.phase}
        humanScore={gameState.humanTotal}
        cpuScore={gameState.cpuTotal}
        currentPlayer={gameState.currentPlayer}
        onDieClick={toggleDieSelection}
        onRoll={gameState.dice.heldDice.length > 0 ? rollRemaining : rollAll}
        onBank={bankSelection}
        onEndTurn={endTurn}
      />

      <button
        onClick={() => setShowMenu(true)}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          padding: '0.5rem 1rem',
          background: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        Menu
      </button>
    </div>
  )
}
