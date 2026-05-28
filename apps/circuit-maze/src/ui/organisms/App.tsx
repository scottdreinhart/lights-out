import { useGame } from '@/app'
import { getNodeProgress } from '@/domain'
import { GameHud, GameOverlay, MazeBoard } from '@/ui/molecules'
import { SplashScreen } from '@games/common'
import { useCallback, useState } from 'react'
import styles from './App.module.css'

export const App = () => {
  const [showSplash, setShowSplash] = useState(true)
  const { state, meta, aiRuntime, dispatch, reset, setSentinelAiTier } = useGame()
  const nodeProgress = getNodeProgress(state)
  const handleSplashComplete = useCallback(() => {
    setShowSplash(false)
  }, [])

  if (showSplash) {
    return (
      <SplashScreen onComplete={handleSplashComplete} minimumDuration={2000} title="CIRCUIT MAZE" />
    )
  }

  return (
    <main className={styles.root}>
      <section className={styles.shell} aria-label="Circuit Maze game shell">
        <header className={styles.header}>
          <p className={styles.kicker}>{meta.family}</p>
          <h1 className={styles.title}>{meta.title}</h1>
          <p className={styles.summary}>{meta.summary}</p>
        </header>

        <GameHud
          state={state}
          nodeProgress={nodeProgress}
          aiRuntime={aiRuntime}
          onSentinelAiTierChange={setSentinelAiTier}
        />

        <MazeBoard state={state} />

        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={() => dispatch({ type: 'dash' })}
            disabled={state.status !== 'playing' || state.dashCooldownTicks > 0}
          >
            Dash ({state.dashCooldownTicks})
          </button>
          <button className={styles.secondaryButton} type="button" onClick={reset}>
            Restart
          </button>
        </div>

        <p className={styles.controls}>
          Move: Arrow Keys / WASD · Dash: Space / Shift · Restart: R · AI Tier: 1-4
        </p>

        <GameOverlay state={state} onRestart={reset} />
      </section>
    </main>
  )
}
