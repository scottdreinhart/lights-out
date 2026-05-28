import { useGame, useResponsiveState, useSoundContext } from '@/app'
import { ActionBar, Button, Card, Separator, StatPill, StatsBar } from '@games/assets-shared'
import { SplashScreen } from '@games/common'
import { useState } from 'react'

export function App() {
  const responsive = useResponsiveState()
  const { soundEnabled, toggleSound } = useSoundContext()
  const { state, playRound, resetGame } = useGame()
  const [view, setView] = useState<'loading' | 'menu' | 'game'>('loading')

  if (view === 'loading') {
    return (
      <SplashScreen
        onComplete={() => setView('menu')}
        minimumDuration={1500}
        title="CHICAGO DICE"
      />
    )
  }

  if (view === 'menu') {
    return (
      <main
        style={{
          minHeight: '100vh',
          padding: responsive.isMobile ? '1.25rem' : '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '1rem',
          maxWidth: '560px',
          margin: '0 auto',
        }}
      >
        <Card elevated>
          <h1>Chicago Dice</h1>
          <p>Play 11 rounds. Each round targets a sum from 2 to 12.</p>
          <Separator />
          <ActionBar>
            <Button type="button" onClick={() => setView('game')}>
              Start Match
            </Button>
            <Button type="button" variant="secondary" onClick={toggleSound}>
              Sound: {soundEnabled ? 'On' : 'Off'}
            </Button>
          </ActionBar>
        </Card>
      </main>
    )
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: responsive.isMobile ? '1rem' : '2rem',
        maxWidth: '720px',
        margin: '0 auto',
        display: 'grid',
        gap: '1rem',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Chicago</h1>
        <Button type="button" variant="secondary" onClick={() => setView('menu')}>
          Menu
        </Button>
      </header>

      <Card>
        <StatsBar>
          <StatPill label="Round" value={state.round} />
          <StatPill label="Target" value={state.target} />
          <StatPill label="You" value={state.scores.human} />
          <StatPill label="CPU" value={state.scores.cpu} />
        </StatsBar>
      </Card>

      {state.lastTurn && (
        <Card>
          <h2 style={{ marginBottom: '0.5rem' }}>Last Round</h2>
          <StatsBar>
            <StatPill
              label="Your Rolls"
              value={`[${state.lastTurn.human.rolls.join(', ')}]`}
              addon={`Best ${state.lastTurn.human.best}`}
            />
            <StatPill
              label="CPU Rolls"
              value={`[${state.lastTurn.cpu.rolls.join(', ')}]`}
              addon={`Best ${state.lastTurn.cpu.best}`}
            />
          </StatsBar>
        </Card>
      )}

      <Card>
        <p>{state.message}</p>
        <Separator />
        {state.gameOver ? (
          <>
            <p style={{ fontWeight: 700 }}>
              {state.winner === 'tie'
                ? 'Match tied.'
                : state.winner === 'human'
                  ? 'You win the match.'
                  : 'CPU wins the match.'}
            </p>
            <ActionBar>
              <Button type="button" onClick={resetGame}>
                Play Again
              </Button>
            </ActionBar>
          </>
        ) : (
          <ActionBar>
            <Button type="button" onClick={playRound}>
              Roll Round
            </Button>
          </ActionBar>
        )}
      </Card>
    </main>
  )
}

export default App
