import { useGame, useResponsiveState, useSoundContext } from '@/app'
import { GameOutcomeOverlay } from '@/ui/atoms'
import { HamburgerMenu } from '@/ui/molecules'
import { ActionBar, Button, Card, Separator, StatPill, StatsBar } from '@games/assets-shared'
import { SplashScreen } from '@games/common'
import { DiceArea } from '@games/ui-dice-system'
import { useEffect, useState } from 'react'
import styles from './App.module.css'

export function App() {
  const responsive = useResponsiveState()
  const { soundEnabled, toggleSound } = useSoundContext()
  const { state, canPlay, playRound, resetGame } = useGame()
  const [view, setView] = useState<'loading' | 'menu' | 'game'>('loading')
  const [overlayOutcome, setOverlayOutcome] = useState<'win' | 'loss' | 'draw' | null>(null)
  const [overlayLabel, setOverlayLabel] = useState<string | null>(null)
  const [overlayKey, setOverlayKey] = useState(0)

  useEffect(() => {
    const messageOutcome =
      state.message === 'YOU WIN!'
        ? 'win'
        : state.message === 'YOU LOSE!'
          ? 'loss'
          : state.message.startsWith('Round tied')
            ? 'draw'
            : null

    const gameOutcome =
      state.gameOver && state.winner ? (state.winner === 'human' ? 'win' : 'loss') : null

    const nextOutcome = gameOutcome ?? messageOutcome
    if (!nextOutcome) {
      return
    }

    const nextLabel =
      gameOutcome === 'win'
        ? "That's a match.\nYOU WIN!"
        : gameOutcome === 'loss'
          ? "That's a match.\nYOU LOSE!"
          : null

    setOverlayOutcome(nextOutcome)
    setOverlayLabel(nextLabel)
    setOverlayKey((key) => key + 1)
  }, [state.gameOver, state.message, state.round, state.winner])

  if (view === 'loading') {
    return <SplashScreen onComplete={() => setView('menu')} minimumDuration={1500} title="CEE-LO" />
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
          <h1>Cee-lo</h1>
          <p>Roll 3 dice. First to 3 round wins takes the match.</p>
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
    <div className={styles.appContainer}>
      <header className={styles.appHeader}>
        <h1 className={styles.headerTitle}>Cee-lo</h1>
        <div className={styles.headerRight}>
          <HamburgerMenu
            onExit={() => setView('menu')}
            onToggleSound={toggleSound}
            soundEnabled={soundEnabled}
          />
        </div>
      </header>

      <div className={styles.appContent}>
        <Card className={styles.gameTable} elevated>
          <StatsBar>
            <StatPill label="Round" value={state.round} />
            <StatPill label="🧑 You" value={state.wins.human} />
            <StatPill label="🤖 CPU" value={state.wins.cpu} />
          </StatsBar>

          <Separator />

          <section className={styles.diceSection} aria-label="Game table dice rows">
            <h2 style={{ margin: 0 }}>Game Table</h2>
            <div className={styles.diceRow}>
              <p className={styles.rowLabel}>
                🧑 You — {state.lastRoll?.human.label ?? 'Waiting for first roll'}
              </p>
              <DiceArea
                dice={state.lastRoll?.human.dice ?? []}
                dieSize={responsive.isMobile ? 52 : 64}
                emptySlots={3}
                compact
              />
            </div>
            <div className={styles.diceRow}>
              <p className={styles.rowLabel}>
                🤖 CPU — {state.lastRoll?.cpu.label ?? 'Waiting for first roll'}
              </p>
              <DiceArea
                dice={state.lastRoll?.cpu.dice ?? []}
                dieSize={responsive.isMobile ? 52 : 64}
                emptySlots={3}
                compact
              />
            </div>
          </section>

          <Separator />

          {state.gameOver ? (
            <>
              <ActionBar>
                <Button type="button" onClick={resetGame}>
                  Play Again
                </Button>
              </ActionBar>
            </>
          ) : (
            <ActionBar>
              <Button type="button" onClick={playRound} disabled={!canPlay}>
                Roll Round
              </Button>
            </ActionBar>
          )}
        </Card>
      </div>

      <div className={styles.notificationPortal} aria-hidden="true">
        <div className={styles.notificationStage}>
          {overlayOutcome ? (
            <GameOutcomeOverlay
              key={`${overlayKey}-${state.round}-${overlayOutcome}`}
              outcome={overlayOutcome}
              label={overlayLabel ?? undefined}
              onComplete={() => {
                setOverlayOutcome(null)
                setOverlayLabel(null)
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default App
