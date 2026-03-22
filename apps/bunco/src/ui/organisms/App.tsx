import { useSoundContext } from '@/app'
import { useResponsiveState } from '@games/app-hook-utils'
import { useGame, useGameEvents } from '@/app'
import { DiceArea } from '@/ui/molecules'
import { useEffect, useState } from 'react'

export default function App() {
  const responsive = useResponsiveState()
  const { callbacks, stats } = useGameEvents()
  const { soundEnabled, toggleSound } = useSoundContext()
  const { state, roll, nextRound, newGame } = useGame(callbacks)
  const [view, setView] = useState<'loading' | 'menu' | 'game' | 'rules'>('loading')

  useEffect(() => {
    const timer = setTimeout(() => setView('menu'), 2500)
    return () => clearTimeout(timer)
  }, [])

  // --- Responsive layout values (derived once, consumed by JSX) ---
  const compact = responsive.compactViewport
  const short = responsive.shortViewport
  const touch = responsive.touchOptimized
  const dieSize = responsive.isXs ? 56 : responsive.isMobile ? 64 : 72
  const containerPad = compact ? '1rem' : short ? '1.5rem' : '2.5rem'
  const sectionGap = compact ? '1rem' : '1.5rem'
  const btnPad = touch ? '1.4rem' : '1.2rem'
  const cardRadius = compact ? '0' : '24px'
  const cardShadow = compact ? 'none' : '0 20px 50px rgba(0,0,0,0.3)'
  const cardMargin = compact ? '0' : '40px auto'
  const touchMin = touch ? '52px' : 'auto'

  // ===== LOADING =====
  if (view === 'loading') {
    return (
      <div className="bunco-splash" aria-label="Bunco splash screen">
        <div className="bunco-splash__orb" aria-hidden="true" />
        <div className="bunco-splash__grid" aria-hidden="true" />
        <div className="bunco-splash__content">
          <div className="bunco-splash__badge pulsing-logo">
            <span className="bunco-splash__emoji">🎲</span>
          </div>
          <p className="bunco-splash__eyebrow">Dice. Rounds. Buncos.</p>
          <h1 className="bunco-splash__title">Bunco</h1>
          <p className="bunco-splash__subtitle">Setting the table for six fast rounds.</p>
          <div className="bunco-splash__loading" aria-hidden="true">
            <span className="bunco-splash__dot" />
            <span className="bunco-splash__dot" />
            <span className="bunco-splash__dot" />
          </div>
        </div>
      </div>
    )
  }

  // ===== MENU =====
  if (view === 'menu') {
    return (
      <div
        className="app bunco-landing"
        style={{
          width: compact ? '100vw' : 'auto',
          maxWidth: compact ? '100vw' : responsive.wideViewport ? '900px' : '600px',
          height: compact ? '100vh' : 'auto',
          minHeight: compact ? '100vh' : '600px',
          margin: cardMargin,
          textAlign: 'center',
          padding: compact ? '2rem' : '4rem',
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#fafafa',
          borderRadius: cardRadius,
          boxShadow: compact ? 'none' : '0 20px 50px rgba(0,0,0,0.1)',
          position: 'relative' as const,
        }}
      >
        <div
          className="bunco-landing__hero"
          style={{ fontSize: short ? '48px' : '72px', marginBottom: short ? '0.5rem' : '1rem' }}
        >
          🎲
        </div>
        <h1
          className="bunco-landing__title"
          style={{
            fontSize: short ? '2rem' : '3rem',
            color: '#b71c1c',
            marginBottom: '0.5rem',
          }}
        >
          Bunco
        </h1>
        <p className="bunco-landing__subtitle" style={{ color: '#666', marginBottom: short ? '1.5rem' : '3rem' }}>
          The classic dice game
        </p>

        <div
          className="bunco-landing__actions"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            maxWidth: '320px',
          }}
        >
          <button
            onClick={() => {
              newGame()
              setView('game')
            }}
            style={{
              padding: btnPad,
              borderRadius: '50px',
              border: 'none',
              backgroundColor: '#d32f2f',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
              minHeight: touchMin,
            }}
          >
            Play Bunco
          </button>
          <button
            onClick={() => setView('rules')}
            style={{
              padding: btnPad,
              borderRadius: '50px',
              border: '1px solid #e0e0e0',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: 'pointer',
              minHeight: touchMin,
            }}
          >
            How to Play
          </button>
        </div>

        {/* Stats */}
        {(stats.wins > 0 || stats.losses > 0) && (
          <div
            style={{
              marginTop: short ? '1.5rem' : '2.5rem',
              display: 'flex',
              gap: '1.5rem',
              color: '#888',
              fontSize: '0.85rem',
            }}
          >
            <span>
              W: <strong style={{ color: '#2e7d32' }}>{stats.wins}</strong>
            </span>
            <span>
              L: <strong style={{ color: '#c62828' }}>{stats.losses}</strong>
            </span>
            {stats.bestStreak > 0 && (
              <span>
                Best Streak: <strong style={{ color: '#333' }}>{stats.bestStreak}</strong>
              </span>
            )}
          </div>
        )}

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          style={{
            position: 'absolute',
            top: compact ? '12px' : '20px',
            right: compact ? '12px' : '20px',
            background: 'none',
            border: 'none',
            fontSize: '1.4rem',
            cursor: 'pointer',
            opacity: 0.5,
            padding: '8px',
            minWidth: touch ? '44px' : 'auto',
            minHeight: touch ? '44px' : 'auto',
          }}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>
    )
  }

  // ===== RULES =====
  if (view === 'rules') {
    return (
      <div
        className="app"
        style={{
          maxWidth: compact ? '100%' : '500px',
          margin: '0 auto',
          padding: containerPad,
          fontFamily: 'system-ui, sans-serif',
          background: '#fafafa',
          minHeight: compact ? '100vh' : 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: short ? '1rem' : '2rem',
          }}
        >
          <button
            onClick={() => setView('menu')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: touch ? '8px' : '4px',
              minWidth: touch ? '44px' : 'auto',
              minHeight: touch ? '44px' : 'auto',
            }}
            aria-label="Back to menu"
          >
            ←
          </button>
          <h2 style={{ marginLeft: '1rem' }}>How to Play</h2>
        </div>

        <div
          style={{
            background: 'white',
            padding: compact ? '1rem' : '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#d32f2f' }}>🎲 Bunco</h3>
          <p style={{ lineHeight: 1.6, color: '#555' }}>
            Bunco is a fast-paced dice game played over <strong>6 rounds</strong>. Each round has a{' '}
            <strong>target number</strong> (Round 1 = 1, Round 2 = 2, etc.).
          </p>

          <h4 style={{ marginTop: '1.5rem' }}>Scoring</h4>
          <ul style={{ lineHeight: 2, color: '#555', paddingLeft: '1.5rem' }}>
            <li>
              <strong>1 point</strong> for each die matching the target
            </li>
            <li>
              <strong>5 points</strong> for three-of-a-kind (non-target) — Mini Bunco
            </li>
            <li>
              <strong>21 points</strong> for three-of-a-kind of the target — BUNCO!
            </li>
          </ul>

          <h4 style={{ marginTop: '1.5rem' }}>Turns</h4>
          <p style={{ lineHeight: 1.6, color: '#555' }}>
            Roll all 3 dice. If you score any points, <strong>keep rolling!</strong> If no dice
            match, your turn is over and the opponent rolls.
          </p>

          <h4 style={{ marginTop: '1.5rem' }}>Winning</h4>
          <p style={{ lineHeight: 1.6, color: '#555' }}>
            First player to <strong>21 points</strong> wins the round. After 6 rounds, the player
            with the most <strong>round wins</strong> wins the game!
          </p>
        </div>

        <button
          onClick={() => setView('menu')}
          style={{
            marginTop: short ? '1rem' : '2rem',
            width: '100%',
            padding: '1rem',
            borderRadius: '50px',
            border: 'none',
            backgroundColor: '#333',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            minHeight: touchMin,
          }}
        >
          Back to Menu
        </button>
      </div>
    )
  }

  // ===== GAME =====
  const isHumanTurn = state.currentPlayer === 'human'
  const canRoll = isHumanTurn && !state.roundOver && !state.isGameOver && !state.isRolling

  const turnMessage = (() => {
    if (!isHumanTurn) {
      return 'CPU is rolling...'
    }
    if (state.lastRoll && state.lastRoll.points > 0) {
      return 'You scored! Roll again!'
    }
    return 'Your turn — roll the dice!'
  })()

  return (
    <div
      className="app"
      style={{
        width: compact ? '100%' : 'auto',
        maxWidth: compact ? '100vw' : '500px',
        minHeight: compact ? '100vh' : 'auto',
        margin: cardMargin,
        padding: containerPad,
        fontFamily: 'system-ui, sans-serif',
        background: '#37474f',
        color: '#eceff1',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: cardRadius,
        boxShadow: cardShadow,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: short ? '0.5rem' : '1rem',
        }}
      >
        <button
          onClick={() => setView('menu')}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: touch ? '8px' : '4px',
            minWidth: touch ? '44px' : 'auto',
            minHeight: touch ? '44px' : 'auto',
          }}
          aria-label="Exit to menu"
        >
          ✕
        </button>
        <h2
          style={{
            margin: 0,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontSize: compact ? '1.1rem' : '1.4rem',
          }}
        >
          Round {state.round} of 6
        </h2>
        <button
          onClick={toggleSound}
          aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.2rem',
            cursor: 'pointer',
            opacity: 0.6,
            padding: touch ? '8px' : '4px',
            minWidth: touch ? '44px' : 'auto',
            minHeight: touch ? '44px' : 'auto',
          }}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Target number */}
      <div
        style={{
          background: 'rgba(255,255,255,0.1)',
          padding: compact ? '6px 14px' : '10px 20px',
          borderRadius: '50px',
          alignSelf: 'center',
          marginBottom: sectionGap,
        }}
      >
        <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Target: </span>
        <span
          style={{
            fontSize: compact ? '1.2rem' : '1.5rem',
            fontWeight: '900',
            color: '#ffd600',
          }}
        >
          {state.target}
        </span>
      </div>

      {/* Scores */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: sectionGap,
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '16px',
          padding: compact ? '0.75rem' : '1rem',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '4px' }}>YOU</div>
          <div
            style={{
              fontSize: compact ? '1.5rem' : '2rem',
              fontWeight: '900',
              color: isHumanTurn ? '#81c784' : '#eceff1',
            }}
          >
            {state.humanScore}
          </div>
          <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>Rounds: {state.humanRoundWins}</div>
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '4px' }}>CPU</div>
          <div
            style={{
              fontSize: compact ? '1.5rem' : '2rem',
              fontWeight: '900',
              color: !isHumanTurn ? '#ef9a9a' : '#eceff1',
            }}
          >
            {state.cpuScore}
          </div>
          <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>Rounds: {state.cpuRoundWins}</div>
        </div>
      </div>

      {/* Dice Area */}
      <DiceArea
        dice={state.dice}
        target={state.target}
        isRolling={state.isRolling}
        lastRoll={state.lastRoll}
        dieSize={dieSize}
        compact={compact}
      />

      {/* Game Over */}
      {state.isGameOver ? (
        <div
          style={{
            background: 'rgba(0,0,0,0.3)',
            padding: compact ? '1.5rem' : '2rem',
            borderRadius: '16px',
            marginTop: sectionGap,
            textAlign: 'center',
          }}
        >
          <h2
            aria-live="assertive"
            style={{
              color: state.gameWinner === 'human' ? '#81c784' : '#e57373',
              fontSize: compact ? '1.5rem' : '2rem',
              margin: '0 0 0.5rem 0',
            }}
          >
            {state.gameWinner === 'human' ? 'YOU WON!' : 'YOU LOST'}
          </h2>
          <p style={{ opacity: 0.7, margin: '0 0 0.5rem 0' }}>
            Rounds: {state.humanRoundWins} - {state.cpuRoundWins}
          </p>
          <p style={{ opacity: 0.7, margin: '0 0 1rem 0' }}>
            Total: {state.humanTotalScore + state.humanScore} -{' '}
            {state.cpuTotalScore + state.cpuScore}
          </p>
          {(state.humanBuncos > 0 || state.cpuBuncos > 0) && (
            <p style={{ opacity: 0.7, margin: '0 0 1rem 0' }}>
              Buncos: You {state.humanBuncos} / CPU {state.cpuBuncos}
            </p>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            {state.completedRounds.map((r) => (
              <div
                key={r.round}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 16px',
                  background:
                    r.winner === 'human' ? 'rgba(129,199,132,0.15)' : 'rgba(229,115,115,0.15)',
                  borderRadius: '8px',
                  marginBottom: '4px',
                  fontSize: '0.85rem',
                }}
              >
                <span>R{r.round}</span>
                <span>
                  {r.humanScore} - {r.cpuScore}
                </span>
                <span>{r.winner === 'human' ? 'W' : 'L'}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              newGame()
              setView('menu')
            }}
            style={{
              backgroundColor: '#fff',
              color: '#37474f',
              border: 'none',
              padding: '0.8rem 2.5rem',
              borderRadius: '30px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              minHeight: touchMin,
            }}
          >
            PLAY AGAIN
          </button>
        </div>
      ) : state.roundOver ? (
        /* Round Summary */
        <div
          style={{
            background: 'rgba(0,0,0,0.3)',
            padding: compact ? '1rem' : '1.5rem',
            borderRadius: '16px',
            marginTop: sectionGap,
            textAlign: 'center',
          }}
        >
          <h3
            aria-live="polite"
            style={{
              color: state.roundWinner === 'human' ? '#81c784' : '#ef9a9a',
              margin: '0 0 0.5rem 0',
            }}
          >
            Round {state.round}: {state.roundWinner === 'human' ? 'You Win!' : 'CPU Wins!'}
          </h3>
          <p style={{ opacity: 0.7, margin: '0 0 1rem 0' }}>
            Score: {state.humanScore} - {state.cpuScore}
          </p>
          <button
            onClick={nextRound}
            style={{
              backgroundColor: '#fff',
              color: '#37474f',
              border: 'none',
              padding: '0.8rem 2.5rem',
              borderRadius: '30px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              minHeight: touchMin,
            }}
          >
            {state.round < 6 ? 'Next Round' : 'See Results'}
          </button>
        </div>
      ) : (
        /* Active Game Controls */
        <div style={{ marginTop: sectionGap, textAlign: 'center' }}>
          <div
            aria-live="polite"
            style={{
              marginBottom: '1rem',
              fontSize: compact ? '1rem' : '1.1rem',
              fontWeight: '600',
              color: isHumanTurn ? '#fff' : '#90a4ae',
            }}
          >
            {turnMessage}
          </div>

          {isHumanTurn && (
            <button
              onClick={roll}
              disabled={!canRoll}
              style={{
                width: '100%',
                padding: btnPad,
                fontSize: '1.2rem',
                fontWeight: '700',
                letterSpacing: '1px',
                cursor: canRoll ? 'pointer' : 'not-allowed',
                backgroundColor: canRoll ? '#d32f2f' : 'rgba(255,255,255,0.1)',
                color: canRoll ? 'white' : 'rgba(255,255,255,0.3)',
                border: 'none',
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                minHeight: touchMin,
              }}
            >
              {state.isRolling ? 'Rolling...' : '🎲 Roll Dice'}
            </button>
          )}
        </div>
      )}

      {/* Completed Rounds (during game) */}
      {!state.isGameOver && state.completedRounds.length > 0 && (
        <div style={{ marginTop: sectionGap }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '6px' }}>
            Previous Rounds
          </div>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {state.completedRounds.map((r) => (
              <div
                key={r.round}
                style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  background:
                    r.winner === 'human' ? 'rgba(129,199,132,0.2)' : 'rgba(229,115,115,0.2)',
                  color: r.winner === 'human' ? '#81c784' : '#ef9a9a',
                }}
              >
                R{r.round}: {r.winner === 'human' ? 'W' : 'L'}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
