import { useGame, useResponsiveState, useSoundContext } from '@/app'
import {
  ActionBar,
  Button,
  Card,
  FormGroup,
  Separator,
  StatPill,
  StatsBar,
} from '@games/assets-shared'
import { SplashScreen } from '@games/common'
import { DiceArea } from '@games/ui-dice-system'
import { useState } from 'react'

export function App() {
  const responsive = useResponsiveState()
  const { soundEnabled, toggleSound } = useSoundContext()
  const { state, setBetSize, placeBet, resetGame } = useGame()
  const [view, setView] = useState<'loading' | 'menu' | 'game'>('loading')

  if (view === 'loading') {
    return (
      <SplashScreen onComplete={() => setView('menu')} minimumDuration={1500} title="CHO-HAN" />
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
          <h1>Cho-han</h1>
          <p>Bet on Cho (even) or Han (odd). Grow your bankroll from 100 to 200.</p>
          <Separator />
          <ActionBar>
            <Button type="button" onClick={() => setView('game')}>
              Start Game
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
        <h1 style={{ margin: 0 }}>Cho-han</h1>
        <Button type="button" variant="secondary" onClick={() => setView('menu')}>
          Menu
        </Button>
      </header>

      <Card>
        <StatsBar>
          <StatPill label="Round" value={state.round} />
          <StatPill label="Bankroll" value={state.bankroll} />
          <StatPill label="Wins" value={state.wins} />
          <StatPill label="Losses" value={state.losses} />
        </StatsBar>
      </Card>

      <Card>
        <FormGroup label="Bet Size" labelHtmlFor="bet-size">
          <input
            id="bet-size"
            type="number"
            min={5}
            max={50}
            step={5}
            value={state.betSize}
            onChange={(e) => setBetSize(Number.parseInt(e.target.value, 10) || 5)}
          />
        </FormGroup>
        <ActionBar>
          <Button type="button" onClick={() => placeBet('cho')} disabled={state.gameOver}>
            Bet Cho (Even)
          </Button>
          <Button type="button" onClick={() => placeBet('han')} disabled={state.gameOver}>
            Bet Han (Odd)
          </Button>
        </ActionBar>
      </Card>

      {state.lastRoll && (
        <Card>
          <p style={{ margin: 0, fontWeight: 600 }}>Dice</p>
          <DiceArea
            dice={state.lastRoll}
            dieSize={responsive.isMobile ? 52 : 64}
            emptySlots={2}
            compact
          />
          <p style={{ margin: 0 }}>Result: {state.result === 'cho' ? 'Cho (Even)' : 'Han (Odd)'}</p>
        </Card>
      )}

      <Card>
        <p>{state.message}</p>
        <Separator />
        {state.gameOver ? (
          <>
            <p style={{ fontWeight: 700 }}>
              {state.winner === 'human' ? 'You reached 200 and won.' : 'House won the session.'}
            </p>
            <ActionBar>
              <Button type="button" onClick={resetGame}>
                Play Again
              </Button>
            </ActionBar>
          </>
        ) : null}
      </Card>
    </main>
  )
}

export default App
