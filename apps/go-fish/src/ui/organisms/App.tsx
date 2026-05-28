import { useGame } from '@/app'
import { CARD_RANKS } from '@/domain'
import { SplashScreen } from '@/ui'
import { useCallback, useEffect, useMemo, useState } from 'react'

type AppPhase = 'splash' | 'playing' | 'help'

export function App() {
  const [phase, setPhase] = useState<AppPhase>('splash')
  const { gameState, isPlayerTurn, isGameOver, winner, playerAsk, cpuTurn, reset } = useGame()

  const availableRanks = useMemo(
    () =>
      CARD_RANKS.filter((rank) => gameState.playerHand.some((card) => card.rank === rank)).map(
        (rank) => ({
          rank,
          count: gameState.playerHand.filter((card) => card.rank === rank).length,
        }),
      ),
    [gameState.playerHand],
  )

  useEffect(() => {
    if (phase !== 'playing' || isPlayerTurn || isGameOver) return
    const timer = setTimeout(() => {
      cpuTurn()
    }, 600)
    return () => clearTimeout(timer)
  }, [cpuTurn, isGameOver, isPlayerTurn, phase])

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
      <SplashScreen
        onComplete={handleSplashComplete}
        onHowToPlay={handleHowToPlay}
        onLetsPlay={handleLetsPlay}
      />
    )
  }

  if (phase === 'help') {
    return (
      <div className="app">
        <div className="panel">
          <h1>Go Fish Rules</h1>
          <p>
            Ask for ranks in your hand. If your opponent has cards of that rank, they must give all
            of them.
          </p>
          <p>
            If not, you "Go Fish" and draw from the deck. Complete books of four cards to score
            points.
          </p>
          <button onClick={() => setPhase('playing')}>Start Game</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="panel">
        <header className="header">
          <h1>Go Fish</h1>
          <button onClick={reset}>New Game</button>
        </header>

        <div className="scoreboard">
          <div>Player Books: {gameState.playerSets}</div>
          <div>CPU Books: {gameState.computerSets}</div>
          <div>Deck: {gameState.deck.length}</div>
        </div>

        <div className="status" role="status" aria-live="polite">
          {isGameOver
            ? winner === 'draw'
              ? 'Game over: draw!'
              : `Game over: ${winner} wins!`
            : isPlayerTurn
              ? 'Your turn: ask for a rank.'
              : 'CPU turn...'}
        </div>

        <section className="cardSection">
          <h2>Your Hand ({gameState.playerHand.length})</h2>
          <div className="rankGrid">
            {availableRanks.map(({ rank, count }) => (
              <button
                key={rank}
                disabled={!isPlayerTurn || isGameOver}
                onClick={() => playerAsk(rank)}
                className="rankButton"
              >
                Ask for {rank} ({count})
              </button>
            ))}
          </div>
        </section>

        <section className="cardSection">
          <h2>CPU Hand</h2>
          <p>{gameState.computerHand.length} cards hidden</p>
        </section>

        <footer className="footerActions">
          <button onClick={() => setPhase('help')}>How to Play</button>
          <button onClick={() => setPhase('splash')}>Back to Splash</button>
        </footer>
      </div>
    </div>
  )
}
