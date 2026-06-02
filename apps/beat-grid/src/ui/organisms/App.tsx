import { useGame } from '@/app'
import { ActionButtons, ProgressMeters, StatsGrid } from '@/ui/molecules'
import styles from './App.module.css'

export const App = () => {
  const { state, meta, dispatch, reset } = useGame()
  const progressPercent = Math.min(100, Math.max(0, (state.progress / 130) * 100))

  return (
    <main className={styles.root}>
      <section className={styles.card}>
        <header className={styles.header}>
          <p className={styles.kicker}>{meta.family} Prototype</p>
          <h1>{meta.title}</h1>
          <p className={styles.summary}>{meta.summary}</p>
        </header>

        <ProgressMeters
          focus={state.focus}
          intensity={state.intensity}
          progress={progressPercent}
          styles={styles}
        />

        <StatsGrid lives={state.lives} score={state.score} styles={styles} tick={state.tick} />

        <p className={styles.status}>{state.status}</p>

        <ActionButtons
          onAction={dispatch}
          primaryLabel={meta.primaryLabel}
          secondaryLabel={meta.secondaryLabel}
          styles={styles}
          tertiaryLabel={meta.tertiaryLabel}
        />

        <button className={styles.reset} onClick={reset} type="button">
          Reset Session
        </button>
      </section>
    </main>
  )
}
