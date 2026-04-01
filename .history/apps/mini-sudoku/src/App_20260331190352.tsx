/**
 * Mini Sudoku App Root Component
 */

import React, { useState } from 'react'
import { useMiniSudoku } from './app'
import { SudokuBoard } from './ui'
import type { Difficulty } from './domain'
import './App.css'

export function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('EASY')
  const game = useMiniSudoku({ difficulty })

  const handleGameComplete = (isSolved: boolean) => {
    if (isSolved) {
      console.log('🎉 Puzzle solved!')
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🧩 Mini Sudoku</h1>
        <p>Solve the 4×4 puzzle</p>
      </header>

      <div className="difficulty-selector">
        <label>Difficulty:</label>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)}>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        <button onClick={() => game.newPuzzle(difficulty)}>New Game</button>
      </div>

      <main className="app-main">
        <SudokuBoard game={game} onGameComplete={handleGameComplete} />
      </main>

      <footer className="app-footer">
        <p>Enjoy the puzzle! 🎮</p>
      </footer>
    </div>
  )
}
