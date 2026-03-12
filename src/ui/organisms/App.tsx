import { useGame } from '@/app'
import { initBoardWasm } from '@/domain'
import { GameBoard } from '@/ui/molecules'
import { useEffect } from 'react'
import './App.css'

export default function App() {
  const { board, moves, isSolved, handleCellClick, resetGame } = useGame()

  // Initialize WASM module for board optimization
  useEffect(() => {
    initBoardWasm().catch((err) => console.warn('WASM init failed:', err))
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Lights Out</h1>
        <p className="app-subtitle">Turn off all lights to win!</p>
      </header>

      <main className="app-main">
        <GameBoard board={board} onCellClick={handleCellClick} />

        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          {isSolved && (
            <div className="win-message">
              <span className="trophy">🎉</span>
              <span>Solved in {moves} moves!</span>
              <span className="trophy">🎉</span>
            </div>
          )}
        </div>

        <button onClick={resetGame} className="btn-reset">
          New Game
        </button>
      </main>

      <footer className="app-footer">
        <p>Rules: Click a light to toggle it and its 4 neighbors (up, down, left, right).</p>
      </footer>
    </div>
  )
}
