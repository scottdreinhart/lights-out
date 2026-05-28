import { useGame } from '@/app'
import { SplashScreen } from '@/ui'
import { useResponsiveState } from '@games/app-hook-utils'
import { ActionBar, Button, Card, Separator, StatPill, StatsBar } from '@games/assets-shared'
import type { CSSProperties } from 'react'
import { useState } from 'react'

export function App() {
  const { isMobile, isTablet } = useResponsiveState()
  const { state, playRound, resetGame } = useGame()
  const [view, setView] = useState<'loading' | 'menu' | 'game'>('loading')

  if (view === 'loading') {
    return (
      <SplashScreen
        onComplete={() => setView('menu')}
        minimumDuration={2000}
        title="SHIP CAPTAIN CREW"
      />
    )
  }

  if (view === 'menu') {
    return (
      <div style={containerStyle(isMobile, isTablet)}>
        <Card elevated>
          <h1 style={titleStyle}>Ship, Captain, Crew</h1>
          <p style={subtitleStyle}>
            Each round, both players get three rolls to secure 6, 5, and 4. Cargo points from the
            remaining dice decide the winner.
          </p>
          <Separator />
          <ActionBar>
            <Button onClick={() => setView('game')}>Start Match</Button>
          </ActionBar>
        </Card>
      </div>
    )
  }

  return (
    <div style={containerStyle(isMobile, isTablet)}>
      <h1 style={titleStyle}>Ship, Captain, Crew</h1>
      <p style={subtitleStyle}>First to {5} round wins.</p>

      <Card>
        <StatsBar>
          <StatPill label="Round" value={state.round} />
          <StatPill label="You" value={state.wins.human} />
          <StatPill label="CPU" value={state.wins.cpu} />
        </StatsBar>
      </Card>

      {state.lastRound && (
        <Card>
          <h3 style={{ marginTop: 0 }}>Last Round</h3>
          <p>
            You cargo: <strong>{state.lastRound.human.cargo}</strong> (
            {state.lastRound.human.gotShip &&
            state.lastRound.human.gotCaptain &&
            state.lastRound.human.gotCrew
              ? '6-5-4 complete'
              : 'incomplete 6-5-4'}
            )
          </p>
          <p>
            CPU cargo: <strong>{state.lastRound.cpu.cargo}</strong> (
            {state.lastRound.cpu.gotShip &&
            state.lastRound.cpu.gotCaptain &&
            state.lastRound.cpu.gotCrew
              ? '6-5-4 complete'
              : 'incomplete 6-5-4'}
            )
          </p>
          <p>
            Winner:{' '}
            <strong>
              {state.lastRound.winner === 'tie'
                ? 'Tie'
                : state.lastRound.winner === 'human'
                  ? 'You'
                  : 'CPU'}
            </strong>
          </p>
        </Card>
      )}

      {state.gameOver ? (
        <Card>
          <h2>{state.winner === 'human' ? 'You Win!' : 'CPU Wins'}</h2>
          <ActionBar>
            <Button onClick={resetGame}>Play Again</Button>
            <Button variant="secondary" onClick={() => setView('menu')}>
              Back to Menu
            </Button>
          </ActionBar>
        </Card>
      ) : (
        <ActionBar>
          <Button onClick={playRound}>Play Round</Button>
          <Button variant="secondary" onClick={resetGame}>
            Reset Match
          </Button>
        </ActionBar>
      )}
    </div>
  )
}

const containerStyle = (isMobile: boolean, isTablet: boolean): CSSProperties => ({
  width: isMobile ? '100vw' : 'auto',
  maxWidth: isMobile ? '100vw' : isTablet ? '640px' : '820px',
  minHeight: isMobile ? '100vh' : '70vh',
  margin: isMobile ? 0 : '36px auto',
  padding: isMobile ? '1.25rem' : '2rem',
  background: '#f8fafc',
  borderRadius: isMobile ? 0 : 16,
  fontFamily: 'system-ui, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
})

const titleStyle: CSSProperties = { margin: 0, color: '#1e293b' }
const subtitleStyle: CSSProperties = { margin: 0, color: '#334155' }
export default App
