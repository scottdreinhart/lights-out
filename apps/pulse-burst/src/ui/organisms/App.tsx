import { useGame } from '@/app'
import { GameHud, GameOverlay, RunnerTrack } from '@/ui/molecules'
import styles from './App.module.css'

export const App = () => {
  const { state, meta, burst, reset } = useGame()

  return (
    <main className={styles.root}>
      <section className={styles.shell} aria-label="Pulse Burst game shell">
        <header className={styles.header}>
          <p className={styles.kicker}>{meta.family}</p>
          <h1 className={styles.title}>{meta.title}</h1>
          <p className={styles.summary}>{meta.summary}</p>
        </header>

        <GameHud state={state} />

        <RunnerTrack state={state} onBurst={burst} />

        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={burst}
            disabled={state.status !== 'playing'}
          >
            Burst
          </button>
          <button className={styles.secondaryButton} type="button" onClick={reset}>
            Restart
          </button>
        </div>

        <p className={styles.controls}>Burst: Space / W / ArrowUp / Tap Track · Restart: R</p>

        <GameOverlay state={state} onRestart={reset} />
      </section>
    </main>
  )
}
