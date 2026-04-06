import { useGame } from '@/app'
import type { GameTier, Move } from '@/domain'
import { DEFAULT_TIER } from '@/domain'
import { MoveButton, RoundResultDisplay, Score, TierSelector } from '@/ui/atoms'
import { initWasm } from '@/wasm/ai-wasm'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import { HamburgerMenu } from './HamburgerMenu'

const CPU_DELAY_MS = 2500
const CPU_MOVES: Move[] = ['rock', 'paper', 'scissors']
const CPU_CYCLE_MS = 200 // Speed of cycling through moves

export default function App() {
  const [selectedTier, setSelectedTier] = useState<GameTier>(DEFAULT_TIER)
  const [gameStarted, setGameStarted] = useState(false)
  const { gameState, makeMove: makeGameMove, newGame } = useGame()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMove, setSelectedMove] = useState<Move | null>(null)
  const [wasmAvailable, setWasmAvailable] = useState(false)
  const [cpuDisplayMove, setCpuDisplayMove] = useState<Move>('rock')
  const cpuLockedMoveRef = useRef<Move>('rock')
  const [showRules, setShowRules] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  // Initialize WASM on mount
  useEffect(() => {
    initWasm()
      .then((available) => {
        setWasmAvailable(available)
        console.log(`WASM AI ${available ? 'enabled' : 'unavailable, using JS fallback'}`)
      })
      .catch(() => console.log('WASM initialization skipped'))
  }, [])

  // Start CPU animation when game state changes
  useEffect(() => {
    if (!gameStarted || isLoading) {
      return
    }

    let cycleIndex = 0
    const interval = setInterval(() => {
      const move = CPU_MOVES[cycleIndex % CPU_MOVES.length]
      setCpuDisplayMove(move)
      cpuLockedMoveRef.current = move
      cycleIndex++
    }, CPU_CYCLE_MS)

    return () => clearInterval(interval)
  }, [gameStarted, isLoading])

  // Reset game when tier changes
  useEffect(() => {
    if (gameStarted) {
      newGame(selectedTier)
    }
  }, [selectedTier, gameStarted, newGame])

  const handleStartGame = (tier: GameTier) => {
    setSelectedTier(tier)
    setGameStarted(true)
    newGame(tier)
  }

  const handleMoveClick = (move: Move) => {
    if (gameState.isGameOver || isLoading) {
      return
    }

    setSelectedMove(move)
    setIsLoading(true)

    // Use the locked CPU move instead of randomly determining it
    const lockedCpuMove = cpuLockedMoveRef.current

    // Simulate CPU thinking time for better UX
    setTimeout(() => {
      makeGameMove(move, lockedCpuMove)
      setIsLoading(false)
      setSelectedMove(null)
    }, CPU_DELAY_MS)
  }

  const handleNewGame = () => {
    newGame(selectedTier)
    setSelectedMove(null)
    setIsLoading(false)
  }

  const handleChangeTier = () => {
    setGameStarted(false)
    setSelectedMove(null)
    setIsLoading(false)
  }

  const currentRound = gameState.rounds[gameState.rounds.length - 1]
  const playerLastMove = currentRound?.playerMove
  const cpuLastMove = currentRound?.cpuMove
  const lastResult = currentRound?.result

  if (!gameStarted) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>♾️ ✊ ✋ ✌️</h1>
          <HamburgerMenu
            onRules={() => setShowRules(true)}
            onSettings={() => setShowSettings(true)}
            onAbout={() => setShowAbout(true)}
          />
          <p className="subtitle">Choose Your Challenge</p>
          {wasmAvailable && <span className="wasm-badge">⚡ WebAssembly Optimized</span>}
        </header>

        <main className="app-main">
          <TierSelector selectedTier={selectedTier} onSelectTier={handleStartGame} />
        </main>

        <footer className="app-footer">
          <p>Test your strategy against an adaptive AI opponent</p>
        </footer>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>♾️ ✊ ✋ ✌️</h1>
        <HamburgerMenu
          onRules={() => setShowRules(true)}
          onSettings={() => setShowSettings(true)}
          onAbout={() => setShowAbout(true)}
        />
        <p className="subtitle">Best of {gameState.bestOf} Rounds</p>
        {wasmAvailable && <span className="wasm-badge">⚡ WebAssembly Optimized</span>}
      </header>

      <main className="app-main">
        <Score
          playerScore={gameState.playerScore}
          cpuScore={gameState.cpuScore}
          bestOf={gameState.bestOf}
        />

        <RoundResultDisplay
          playerMove={playerLastMove || '—'}
          cpuMove={cpuLastMove || '—'}
          cpuDisplayMove={cpuDisplayMove}
          result={lastResult || null}
          isLoading={isLoading}
        />

        <div className="moves-container">
          <p className="moves-label">
            {gameState.isGameOver ? 'Game Over! Play Again?' : 'Make your move:'}
          </p>
          <div className="moves-grid">
            <MoveButton
              move="rock"
              onClick={() => handleMoveClick('rock')}
              disabled={gameState.isGameOver || isLoading}
              isSelected={selectedMove === 'rock'}
            />
            <MoveButton
              move="paper"
              onClick={() => handleMoveClick('paper')}
              disabled={gameState.isGameOver || isLoading}
              isSelected={selectedMove === 'paper'}
            />
            <MoveButton
              move="scissors"
              onClick={() => handleMoveClick('scissors')}
              disabled={gameState.isGameOver || isLoading}
              isSelected={selectedMove === 'scissors'}
            />
          </div>
        </div>

        {gameState.isGameOver && (
          <div className={`game-over ${gameState.gameWinner === 'player' ? 'win' : 'loss'}`}>
            <h2>{gameState.gameWinner === 'player' ? '🏆 You Won!' : '🤖 CPU Won'}</h2>
            <p className="final-score">
              Final Score: {gameState.playerScore} - {gameState.cpuScore}
            </p>
            <div className="game-over-buttons">
              <button className="control-button" onClick={handleNewGame}>
                Play Again
              </button>
              <button className="control-button" onClick={handleChangeTier}>
                Change Difficulty
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Total rounds played: {gameState.rounds.length}</p>
      </footer>

      {/* Placeholder modals - Phase 1: Extract to dedicated components */}
      {showRules && (
        <div
          className="modal-overlay"
          onClick={() => setShowRules(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowRules(false)}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
        >
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowRules(false)}>
              ✕
            </button>
            <h2>How to Play</h2>
            <p>Rock beats Scissors, Scissors beats Paper, Paper beats Rock.</p>
            <p>Choose your move before the CPU makes theirs. Best of series wins!</p>
          </div>
        </div>
      )}

      {showSettings && (
        <div
          className="modal-overlay"
          onClick={() => setShowSettings(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowSettings(false)}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
        >
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowSettings(false)}>
              ✕
            </button>
            <h2>Settings</h2>
            <p>Sound and theme settings coming soon in Phase 1.</p>
          </div>
        </div>
      )}

      {showAbout && (
        <div
          className="modal-overlay"
          onClick={() => setShowAbout(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowAbout(false)}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
        >
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowAbout(false)}>
              ✕
            </button>
            <h2>About Rock Paper Scissors</h2>
            <p>A classic game of strategy and chance, powered by adaptive AI.</p>
          </div>
        </div>
      )}
    </div>
  )
}
