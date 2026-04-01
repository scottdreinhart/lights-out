/**
 * Queens Game Component
 * Main N-Queens puzzle interface
 */

import React, { useState } from 'react'
import { QueensBoard } from './QueensBoard'
import { useQueensGame } from '../app'
import type { Difficulty } from '../domain'

export const QueensGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.HARD)
  const {
    gameState,
    makeMove,
    removeQueenAt,
    resetGame,
    generateNewPuzzle,
    solvePuzzle,
    getHint,
    conflicts
  } = useQueensGame(difficulty)

  const handleCellClick = (row: number, col: number) => {
    const currentQueen = gameState.board[row]

    if (currentQueen === col) {
      // Remove queen
      removeQueenAt(row)
    } else if (currentQueen === -1) {
      // Place queen
      makeMove(row, col)
    }
    // If there's already a queen in this row but different column, do nothing
  }

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)
    resetGame()
  }

  const handleHint = () => {
    const hint = getHint()
    if (hint) {
      // Could highlight the suggested cell
      console.log('Hint:', hint)
    }
  }

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>N-Queens Puzzle</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>Place {gameState.size} queens on the board so no queen attacks another</h2>
        <p>Status: {gameState.isSolved ? '✅ Solved!' : gameState.isComplete ? '❌ Invalid' : 'In Progress'}</p>
        <p>Moves: {gameState.moveCount} | Mistakes: {gameState.mistakes} | Hints: {gameState.hintCount}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Difficulty:
          <select
            value={difficulty}
            onChange={(e) => handleDifficultyChange(e.target.value as Difficulty)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value={Difficulty.EASY}>Easy (4×4)</option>
            <option value={Difficulty.MEDIUM}>Medium (6×6)</option>
            <option value={Difficulty.HARD}>Hard (8×8)</option>
            <option value={Difficulty.EXPERT}>Expert (10×10)</option>
          </select>
        </label>
      </div>

      <QueensBoard
        board={gameState.board}
        onCellClick={handleCellClick}
        size={gameState.size}
        conflicts={conflicts}
      />

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={resetGame} style={{ padding: '10px 20px' }}>
          Reset
        </button>
        <button onClick={() => generateNewPuzzle('medium')} style={{ padding: '10px 20px' }}>
          New Puzzle
        </button>
        <button onClick={solvePuzzle} style={{ padding: '10px 20px' }}>
          Solve
        </button>
        <button onClick={handleHint} style={{ padding: '10px 20px' }}>
          Hint
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h3>How to Play:</h3>
        <ul>
          <li>Click on a square to place a queen in that row</li>
          <li>Queens cannot attack each other (same row, column, or diagonal)</li>
          <li>Place one queen per row</li>
          <li>Click on a queen to remove it</li>
          <li>Use hints if you get stuck</li>
        </ul>
      </div>
    </div>
  )
}