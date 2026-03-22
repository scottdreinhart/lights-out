import { useGame } from '@/app'
import { useResponsiveState } from '@games/app-hook-utils'
import { PileToggle } from '@/ui/molecules'
import { useEffect, useState } from 'react'

export default function App() {
  const { isMobile, isTablet } = useResponsiveState()
  const {
    state,
    selectedPileId,
    selectedCount,
    handleObjectClick,
    confirmMove,
    resetGame,
    setMode,
    updateSetup,
  } = useGame([3, 4, 5])

  const [view, setView] = useState<'loading' | 'menu' | 'game' | 'settings'>('loading')

  const [localSetup, setLocalSetup] = useState<number[]>([3, 4, 5])

  useEffect(() => {
    const timer = setTimeout(() => {
      setView('menu')
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const handleSetupChange = (index: number, val: string) => {
    const num = parseInt(val, 10) || 0
    const nextValue = Math.min(Math.max(num, 1), 15)
    const nextSetup = [...localSetup]
    nextSetup[index] = nextValue
    setLocalSetup(nextSetup)
  }

  if (view === 'loading') {
    return (
      <div className="game-splash" aria-label="Game splash screen">
        <div className="game-splash__orb" aria-hidden="true" />
        <div className="game-splash__grid" aria-hidden="true" />
        <div className="game-splash__content">
          <div className="game-splash__badge pulsing-logo">
            <div className="game-splash__coins" aria-hidden="true">
              <span className="game-splash__coin" />
              <span className="game-splash__coin" />
              <span className="game-splash__coin" />
            </div>
          </div>
          <p className="game-splash__eyebrow">Classic Strategy</p>
          <h1 className="game-splash__title">Game of Nim</h1>
          <p className="game-splash__subtitle">Preparing the board and opening move.</p>
          <div className="game-splash__loading" aria-hidden="true">
            <span className="game-splash__dot" />
            <span className="game-splash__dot" />
            <span className="game-splash__dot" />
          </div>
        </div>
      </div>
    )
  }

  if (view === 'menu') {
    return (
      <div
        className="app game-landing"
        style={{
          width: isMobile ? '100vw' : 'auto',
          maxWidth: isMobile ? '100vw' : isTablet ? '600px' : '900px',
          height: isMobile ? '100vh' : 'auto',
          minHeight: isMobile ? '100vh' : '600px',
          margin: isMobile ? '0' : '40px auto',
          textAlign: 'center',
          padding: isMobile ? '2rem' : '4rem',
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#fafafa',
          borderRadius: isMobile ? '0' : '24px',
          boxShadow: isMobile ? 'none' : '0 20px 50px rgba(0,0,0,0.1)',
        }}
      >
        <h1 className="game-landing__title" style={{ fontSize: '3rem', color: '#1a237e', marginBottom: '0.5rem' }}>
          Game of Nim
        </h1>
        <p className="game-landing__subtitle" style={{ color: '#666', marginBottom: '3rem' }}>
          A classic strategy game
        </p>

        <div className="game-landing__actions" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <button
            onClick={() => setView('game')}
            style={{
              padding: '1.2rem',
              borderRadius: '50px',
              border: 'none',
              backgroundColor: '#3f51b5',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)',
            }}
          >
            Play vs AI
          </button>
          <button
            onClick={() => setView('settings')}
            style={{
              padding: '1.2rem',
              borderRadius: '50px',
              border: '1px solid #e0e0e0',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Settings
          </button>
        </div>

        <p className="game-landing__footer" style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#999', lineHeight: '1.5' }}>
          Remove objects from heaps.
          <br />
          Choose Normal or Misère rules in Settings.
        </p>
      </div>
    )
  }

  if (view === 'settings') {
    return (
      <div
        className="app"
        style={{
          maxWidth: '430px',
          height: '100vh',
          margin: '0 auto',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif',
          background: '#fafafa',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <button
            onClick={() => setView('menu')}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ←
          </button>
          <h2 style={{ marginLeft: '1rem' }}>Settings</h2>
        </div>

        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Rules Variant</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '8px',
                background: state.mode === 'normal' ? '#f0f2ff' : 'transparent',
              }}
              onClick={() => setMode('normal')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setMode('normal')}
            >
              <input
                type="radio"
                name="mode"
                checked={state.mode === 'normal'}
                readOnly
                aria-label="Normal Play"
                style={{ accentColor: '#3f51b5', width: '20px', height: '20px' }}
              />
              <div>
                <div style={{ fontWeight: '600' }}>Normal Play</div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                  The player who takes the last object wins.
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '8px',
                background: state.mode === 'misere' ? '#fff0f5' : 'transparent',
              }}
              onClick={() => setMode('misere')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setMode('misere')}
            >
              <input
                type="radio"
                name="mode"
                checked={state.mode === 'misere'}
                readOnly
                aria-label="Misère Play"
                style={{ accentColor: '#e91e63', width: '20px', height: '20px' }}
              />
              <div>
                <div style={{ fontWeight: '600' }}>Misère Play</div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                  The player who takes the last object loses.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            marginTop: '1.5rem',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Game Board</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Initial Piles:</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {localSetup.map((count, i) => (
                  <input
                    key={i}
                    type="number"
                    value={count}
                    onChange={(e) => handleSetupChange(i, e.target.value)}
                    style={{
                      width: '45px',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      textAlign: 'center',
                    }}
                  />
                ))}
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
              Set initial counts for the 3 piles (max 15).
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            updateSetup(localSetup)
            setView('menu')
          }}
          style={{
            marginTop: '2rem',
            width: '100%',
            padding: '1rem',
            borderRadius: '50px',
            border: 'none',
            backgroundColor: '#333',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Save & Back
        </button>
      </div>
    )
  }

  return (
    <div
      className="app"
      style={{
        width: isMobile ? '100%' : 'auto',
        maxWidth: isMobile ? '100vw' : isTablet ? '600px' : '900px',
        minHeight: isMobile ? '100vh' : 'auto',
        margin: isMobile ? '0' : '40px auto',
        textAlign: 'center',
        padding: isMobile ? '1.5rem' : '2.5rem',
        fontFamily: 'system-ui, sans-serif',
        background: '#37474f',
        color: '#eceff1',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: isMobile ? '0' : '24px',
        boxShadow: isMobile ? 'none' : '0 20px 50px rgba(0,0,0,0.3)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
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
          }}
        >
          ✕
        </button>
        <h2
          style={{
            margin: 0,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontSize: '1.8rem',
          }}
        >
          Nim
        </h2>
        <div style={{ width: '32px' }}></div>
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '10px 20px',
          borderRadius: '50px',
          alignSelf: 'center',
          marginBottom: '3rem',
        }}
      >
        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Mode: </span>
        <span style={{ fontWeight: '700', color: state.mode === 'normal' ? '#90caf9' : '#f48fb1' }}>
          {state.mode === 'normal' ? 'Normal' : 'Misère'}
        </span>
      </div>

      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '24px',
          paddingBottom: '2rem',
        }}
      >
        {state.piles.map((pile) => (
          <div
            key={pile.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '15px',
              flex: 1,
            }}
          >
            <div style={{ width: '100%' }}>
              <PileToggle
                id={pile.id}
                count={pile.count}
                selectedCount={selectedPileId === pile.id ? selectedCount : 0}
                onObjectClick={handleObjectClick}
                disabled={state.currentPlayer !== 'human' || state.isGameOver}
              />
            </div>
            {state.currentPlayer === 'human' && !state.isGameOver && pile.count > 0 && (
              <button
                onClick={() => {
                  handleObjectClick(pile.id, pile.count - 1)
                  confirmMove()
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'linear-gradient(135deg, #ff5252 0%, #d32f2f 100%)',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: '900',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(255, 82, 82, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.1s active',
                }}
              >
                -
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', minHeight: '140px' }}>
        {state.isGameOver ? (
          <div
            style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px' }}
          >
            <h2
              style={{
                color: state.winner === 'human' ? '#81c784' : '#e57373',
                fontSize: '2rem',
                margin: '0 0 1rem 0',
              }}
            >
              {state.winner === 'human' ? 'YOU WON!' : 'YOU LOST'}
            </h2>
            <button
              onClick={resetGame}
              style={{
                backgroundColor: '#fff',
                color: '#37474f',
                border: 'none',
                padding: '0.8rem 2.5rem',
                borderRadius: '30px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              PLAY AGAIN
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                marginBottom: '1.5rem',
                fontSize: '1.2rem',
                fontWeight: '600',
                color: state.currentPlayer === 'human' ? '#fff' : '#90a4ae',
              }}
            >
              {state.currentPlayer === 'human' ? 'YOUR TURN' : 'PC TURN'}
            </div>

            {state.currentPlayer === 'human' && (
              <button
                onClick={confirmMove}
                disabled={selectedPileId === null || selectedCount === 0}
                style={{
                  width: '100%',
                  padding: '1.2rem',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  cursor:
                    selectedPileId === null || selectedCount === 0 ? 'not-allowed' : 'pointer',
                  backgroundColor:
                    selectedPileId === null || selectedCount === 0
                      ? 'rgba(255,255,255,0.1)'
                      : '#4db6ac',
                  color:
                    selectedPileId === null || selectedCount === 0
                      ? 'rgba(255,255,255,0.3)'
                      : 'white',
                  border: 'none',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase',
                }}
              >
                End Turn
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
