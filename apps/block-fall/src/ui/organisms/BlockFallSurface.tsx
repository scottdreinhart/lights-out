import type { UseBlockFallAppReturn } from '@/app'
import { ActionButtons, ProgressMeters, StatsGrid } from '@/ui/molecules'

import styles from './App.module.css'

export function BlockFallSurface({ app }: { app: UseBlockFallAppReturn }) {
  return (
    <main className={styles.root}>
      <section className={styles.card}>
        <header className={styles.header}>
          <p className={styles.kicker}>{app.meta.family} Prototype</p>
          <h1>{app.meta.title}</h1>
          <p className={styles.summary}>{app.meta.summary}</p>
        </header>

        <ProgressMeters
          focus={app.state.focus}
          intensity={app.state.intensity}
          progress={app.progressPercent}
          styles={styles}
        />

        <StatsGrid
          lives={app.state.lives}
          score={app.state.score}
          styles={styles}
          tick={app.state.tick}
        />

        <p className={styles.status}>{app.state.status}</p>

        <ActionButtons
          onAction={app.dispatch}
          primaryLabel={app.meta.primaryLabel}
          secondaryLabel={app.meta.secondaryLabel}
          styles={styles}
          tertiaryLabel={app.meta.tertiaryLabel}
        />

        <button className={styles.reset} onClick={app.reset} type="button">
          Reset Session
        </button>
      </section>
    </main>
  )
}
