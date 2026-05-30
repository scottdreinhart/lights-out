import { useGame } from '@/app'
import { SplashScreen } from '@/ui'
import { useResponsiveState } from '@games/app-hook-utils'
import { ActionBar, Button, Card, Separator, StatPill, StatsBar } from '@games/assets-shared'
import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'

export function App() {
  const { isMobile, isTablet } = useResponsiveState()
  const { state, rollCurrentPlayer, resetGame, canRoll } = useGame()
  const [view, setView] = useState<'loading' | 'menu' | 'game'>('loading')

  useEffect(() => {
    if (view !== 'game' || state.gameOver || state.activePlayer !== 'cpu') {return}
    const timer = window.setTimeout(() => rollCurrentPlayer(), 900)
    return () => window.clearTimeout(timer)
  }, [rollCurrentPlayer, state.activePlayer, state.gameOver, view])

  if (view === 'loading') {
    return <SplashScreen onComplete={() => setView('menu')} minimumDuration={2000} title="MEXICO" />
  }

  if (view === 'menu') {
    return (
      <div style={containerStyle(isMobile, isTablet)}>
        <Card elevated>
          <h1 style={titleStyle}>Mexico</h1>
          <p style={subtitleStyle}>
            Roll two dice and try to beat the current target. Fail to beat it and you lose a life.
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
      <h1 style={titleStyle}>Mexico</h1>
      <p style={subtitleStyle}>{state.message}</p>

      <Card>
        <StatsBar>
          <StatPill label="Your Lives" value={state.lives.human} />
          <StatPill label="CPU Lives" value={state.lives.cpu} />
          <StatPill label="Target" value={state.targetRoll ?? '-'} />
          <StatPill label="Last Roll" value={state.lastRoll ?? '-'} />
          <StatPill label="Turn" value={state.activePlayer === 'human' ? 'You' : 'CPU'} />
          <StatPill label="Round" value={state.round} />
        </StatsBar>
      </Card>

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
          <Button disabled={state.activePlayer !== 'human' || !canRoll} onClick={rollCurrentPlayer}>
            Roll Dice
          </Button>
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

const titleStyle: CSSProperties = { margin: 0, color: '#0f172a' }
const subtitleStyle: CSSProperties = { margin: 0, color: '#334155' }
export default App
