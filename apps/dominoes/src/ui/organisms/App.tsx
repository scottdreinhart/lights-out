import { useGame } from '@/app'
import { canPlace } from '@/domain'
import { useCallback, useEffect, useMemo, useState } from 'react'

type AppPhase = 'splash' | 'playing' | 'help'

export function App() {
  const [phase, setPhase] = useState<AppPhase>('splash')
  const { gameState, isPlayerTurn, validPlayerMoves, placeTile, drawFromBoneyard, cpuTurn, reset } =
    useGame()

  const tableEnds = useMemo(() => {
    const left = gameState.table[0]?.left ?? null
    const right = gameState.table[gameState.table.length - 1]?.right ?? null
    return { left, right }
  }, [gameState.table])

  useEffect(() => {
    if (phase !== 'playing' || isPlayerTurn || gameState.gameOver) return
    const timer = setTimeout(() => {
      cpuTurn()
    }, 700)
    return () => clearTimeout(timer)
  }, [cpuTurn, gameState.gameOver, isPlayerTurn, phase])

  const handleSplashComplete = useCallback(() => {
    setPhase('playing')
  }, [])

  const handleHowToPlay = useCallback(() => {
    setPhase('help')
  }, [])

  const handleLetsPlay = useCallback(() => {
    setPhase('playing')
  }, [])

  if (phase === 'splash') {
    return (
      <div className="app">
        <div className="panel">
          <h1>Dominoes</h1>
          <p>Classic head-to-head dominoes with draw and pass turn flow.</p>
          <div className="footerActions">
            <button onClick={handleLetsPlay}>Play</button>
            <button onClick={handleHowToPlay}>How to Play</button>
            <button onClick={handleSplashComplete}>Continue</button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'help') {
    return (
      <div className="app">
        <div className="panel">
          <h1>Dominoes Rules</h1>
          <p>
            Place matching domino values on either table end. If you cannot play, draw from
            boneyard.
          </p>
          <p>The first player to empty their hand wins the round.</p>
          <button onClick={() => setPhase('playing')}>Start Match</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="panel">
        <header className="header">
          <h1>Dominoes</h1>
          <button onClick={reset}>New Game</button>
        </header>

        <div className="status" role="status" aria-live="polite">
          {gameState.gameOver
            ? gameState.playerHand.length === 0
              ? 'You win!'
              : 'CPU wins!'
            : isPlayerTurn
              ? 'Your turn: place a valid tile.'
              : 'CPU turn...'}
        </div>

        <div className="scoreboard">
          <div>Your hand: {gameState.playerHand.length}</div>
          <div>CPU hand: {gameState.computerHand.length}</div>
          <div>Boneyard: {gameState.boneyard.length}</div>
          <div>Table tiles: {gameState.table.length}</div>
        </div>

        <section className="tableSection">
          <h2>Table</h2>
          <div className="tableRow">
            {gameState.table.length === 0 ? <span>Table is empty.</span> : null}
            {gameState.table.map((domino, index) => (
              <span key={`${domino.left}-${domino.right}-${index}`} className="domino">
                {domino.left}|{domino.right}
              </span>
            ))}
          </div>
        </section>

        <section className="handSection">
          <h2>Your Playable Tiles</h2>
          {validPlayerMoves.length === 0 ? (
            <p>No valid moves. Draw or pass.</p>
          ) : (
            <div className="tileGrid">
              {validPlayerMoves.map((domino, index) => {
                const canLeft = tableEnds.left === null || canPlace(domino, tableEnds.left)
                const canRight = tableEnds.right === null || canPlace(domino, tableEnds.right)

                return (
                  <div key={`${domino.left}-${domino.right}-${index}`} className="tileCard">
                    <div className="domino">
                      {domino.left}|{domino.right}
                    </div>
                    <div className="actions">
                      <button
                        disabled={!isPlayerTurn || !canLeft}
                        onClick={() => placeTile(domino, 'left')}
                      >
                        Left
                      </button>
                      <button
                        disabled={!isPlayerTurn || !canRight}
                        onClick={() => placeTile(domino, 'right')}
                      >
                        Right
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <footer className="footerActions">
          <button
            disabled={!isPlayerTurn || gameState.gameOver || gameState.boneyard.length === 0}
            onClick={drawFromBoneyard}
          >
            Draw from Boneyard
          </button>
          <button
            disabled={!isPlayerTurn || gameState.gameOver || validPlayerMoves.length > 0}
            onClick={cpuTurn}
          >
            Pass Turn
          </button>
          <button onClick={() => setPhase('help')}>How to Play</button>
        </footer>
      </div>
    </div>
  )
}
