import { useGame } from '@/app'
import { SplashScreen } from '@/ui'
import { useResponsiveState } from '@games/app-hook-utils'
import { ActionBar, Button, Card, Separator, StatPill, StatsBar } from '@games/assets-shared'
import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'

export function App() {
  const { isMobile, isTablet } = useResponsiveState()
  const { state, roll, hold, resetGame, cpuShouldHold } = useGame()
  const [view, setView] = useState<'loading' | 'menu' | 'game'>('loading')

  useEffect(() => {
    if (view !== 'game' || state.gameOver || state.currentPlayer !== 'cpu') return
    const timer = window.setTimeout(() => {
      if (cpuShouldHold) {
        hold()
        return
      }
      roll()
    }, 850)

    return () => window.clearTimeout(timer)
  }, [cpuShouldHold, hold, roll, state.currentPlayer, state.gameOver, view])

  if (view === 'loading') {
    return <SplashScreen onComplete={() => setView('menu')} minimumDuration={2000} title="PIG" />
  }

  if (view === 'menu') {
    return (
      <div style={containerStyle(isMobile, isTablet)}>
        <Card elevated>
          <h1 style={titleStyle}>Pig Dice</h1>
          <p style={subtitleStyle}>
            Roll to build points, hold to bank them, but roll a 1 and your turn score is lost.
          </p>
          <Separator />
          <ActionBar>
            <Button onClick={() => setView('game')}>Start Game</Button>
          </ActionBar>
        </Card>
      </div>
    )
  }

  return (
    <div style={containerStyle(isMobile, isTablet)}>
      <h1 style={titleStyle}>Pig Dice</h1>
      <p style={subtitleStyle}>{state.message}</p>

      <Card>
        <StatsBar>
          <StatPill label="You" value={state.scores.human} />
          <StatPill label="CPU" value={state.scores.cpu} />
          <StatPill label="Turn Score" value={state.turnScore} />
          <StatPill label="Last Roll" value={state.lastRoll ?? '-'} />
          <StatPill label="Turn" value={state.currentPlayer === 'human' ? 'You' : 'CPU'} />
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
          <Button disabled={state.currentPlayer !== 'human'} onClick={roll}>
            Roll
          </Button>
          <Button
            variant="secondary"
            disabled={state.currentPlayer !== 'human' || state.turnScore <= 0}
            onClick={hold}
          >
            Hold
          </Button>
          <Button variant="secondary" onClick={resetGame}>
            Reset
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
  background: '#fffaf1',
  borderRadius: isMobile ? 0 : 16,
  fontFamily: 'system-ui, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
})

const titleStyle: CSSProperties = { margin: 0, color: '#7c2d12' }
const subtitleStyle: CSSProperties = { margin: 0, color: '#9a3412' }
export default App
