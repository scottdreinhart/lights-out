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
import type { DieValue } from '@games/common'
import { SplashScreen } from '@games/common'
import { DiceArea } from '@games/ui-dice-system'
import { useEffect, useState } from 'react'

export function App() {
  const responsive = useResponsiveState()
  const { soundEnabled, toggleSound } = useSoundContext()
  const { state, placeBid, callLiar, cpuTurn, resetGame } = useGame()
  const [view, setView] = useState<'loading' | 'menu' | 'game'>('loading')
  const [quantity, setQuantity] = useState<number>(1)
  const [face, setFace] = useState<number>(2)

  useEffect(() => {
    if (state.currentPlayer !== 'cpu' || state.gameOver) {
      return
    }
    const timeoutId = window.setTimeout(() => cpuTurn(), 700)
    return () => window.clearTimeout(timeoutId)
  }, [cpuTurn, state.currentPlayer, state.gameOver])

  if (view === 'loading') {
    return (
      <SplashScreen onComplete={() => setView('menu')} minimumDuration={1500} title="LIAR'S DICE" />
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
          <h1>Liar&apos;s Dice</h1>
          <p>Raise bids on quantity and face value, or call liar.</p>
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
        maxWidth: '760px',
        margin: '0 auto',
        display: 'grid',
        gap: '1rem',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Liar&apos;s Dice</h1>
        <Button type="button" variant="secondary" onClick={() => setView('menu')}>
          Menu
        </Button>
      </header>

      <Card>
        <StatsBar>
          <StatPill label="Round" value={state.round} />
          <StatPill label="Your Dice" value={state.diceCount.human} />
          <StatPill label="CPU Dice" value={state.diceCount.cpu} />
          <StatPill label="Turn" value={state.currentPlayer === 'human' ? 'You' : 'CPU'} />
        </StatsBar>
      </Card>

      <Card style={{ display: 'grid', gap: '0.75rem' }}>
        <p style={{ margin: 0, fontWeight: 600 }}>Your Dice</p>
        <DiceArea
          dice={state.dice.human}
          dieSize={responsive.isMobile ? 44 : 56}
          emptySlots={5}
          compact
        />
        {state.currentBid ? (
          <p style={{ margin: 0 }}>
            Current bid: {state.currentBid.quantity} × {state.currentBid.face}s
          </p>
        ) : (
          <p style={{ margin: 0 }}>No bid yet.</p>
        )}
      </Card>

      <Card>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <FormGroup label="Bid Quantity" labelHtmlFor="bid-quantity">
            <input
              id="bid-quantity"
              type="number"
              min={1}
              max={10}
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value, 10) || 1)}
            />
          </FormGroup>
          <FormGroup label="Bid Face" labelHtmlFor="bid-face">
            <input
              id="bid-face"
              type="number"
              min={1}
              max={6}
              value={face}
              onChange={(e) => setFace(Number.parseInt(e.target.value, 10) || 1)}
            />
          </FormGroup>
          <ActionBar>
            <Button
              type="button"
              onClick={() => placeBid(quantity, face as DieValue)}
              disabled={state.currentPlayer !== 'human' || state.gameOver}
            >
              Place Bid
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={callLiar}
              disabled={state.currentPlayer !== 'human' || state.gameOver || !state.currentBid}
            >
              Call Liar
            </Button>
          </ActionBar>
        </div>
      </Card>

      {state.lastReveal && (
        <Card>
          <h2 style={{ marginBottom: '0.5rem' }}>Last Reveal</h2>
          <p style={{ margin: 0 }}>
            Bid was {state.lastReveal.bid.quantity} × {state.lastReveal.bid.face}s
          </p>
          <p style={{ margin: 0 }}>Matching dice: {state.lastReveal.matchingDice}</p>
          <p style={{ margin: 0 }}>Loser: {state.lastReveal.loser === 'human' ? 'You' : 'CPU'}</p>
        </Card>
      )}

      <Card>
        <p>{state.message}</p>
        <Separator />
        {state.gameOver ? (
          <>
            <p style={{ fontWeight: 700 }}>
              {state.winner === 'human' ? 'You win the match.' : 'CPU wins the match.'}
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
