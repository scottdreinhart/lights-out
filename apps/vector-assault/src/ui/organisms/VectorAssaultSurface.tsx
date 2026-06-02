import { useVectorAssaultAudio, type UseVectorAssaultAppReturn } from '@/app'
import { ARENA_HEIGHT, ARENA_WIDTH } from '@/domain'
import { ActionButtons, ProgressMeters, StatsGrid } from '@/ui/molecules'
import { SplashScreen } from '@games/common'

import styles from './App.module.css'

export function VectorAssaultSurface({ app }: { app: UseVectorAssaultAppReturn }) {
  useVectorAssaultAudio(app.state)

  if (app.showSplash) {
    return (
      <SplashScreen
        onComplete={app.handleSplashComplete}
        minimumDuration={2000}
        title="VECTOR ASSAULT"
      />
    )
  }

  const shipFacing = {
    x: Math.cos(app.state.ship.heading),
    y: Math.sin(app.state.ship.heading),
  }
  const leftWing = {
    x: Math.cos(app.state.ship.heading + (Math.PI * 3) / 4),
    y: Math.sin(app.state.ship.heading + (Math.PI * 3) / 4),
  }
  const rightWing = {
    x: Math.cos(app.state.ship.heading - (Math.PI * 3) / 4),
    y: Math.sin(app.state.ship.heading - (Math.PI * 3) / 4),
  }
  const shipPath = `${app.state.ship.position.x + shipFacing.x * 18},${app.state.ship.position.y + shipFacing.y * 18} ${
    app.state.ship.position.x + leftWing.x * 13
  },${app.state.ship.position.y + leftWing.y * 13} ${
    app.state.ship.position.x + rightWing.x * 13
  },${app.state.ship.position.y + rightWing.y * 13}`

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

        <section className={styles.arenaSection}>
          <svg
            aria-label="Vector Assault Arena"
            className={styles.arena}
            role="img"
            viewBox={`0 0 ${ARENA_WIDTH} ${ARENA_HEIGHT}`}
          >
            <rect
              className={styles.arenaFrame}
              height={ARENA_HEIGHT}
              width={ARENA_WIDTH}
              x={0}
              y={0}
            />
            {app.state.hazards.map((hazard) => (
              <circle
                className={styles.hazard}
                cx={hazard.position.x}
                cy={hazard.position.y}
                key={hazard.id}
                r={hazard.radius}
              />
            ))}
            {app.state.projectiles.map((projectile) => (
              <circle
                className={styles.projectile}
                cx={projectile.position.x}
                cy={projectile.position.y}
                key={projectile.id}
                r={projectile.radius}
              />
            ))}
            <polyline className={styles.ship} points={shipPath} />
          </svg>
          <div className={styles.arenaMeta}>
            <span>Wave {app.state.wave}</span>
            <span>Hazards {app.state.hazards.length}</span>
            <span>Shots {app.state.projectiles.length}</span>
            <span>{app.state.burstTicksRemaining > 0 ? 'Burst Active' : 'Burst Cooling'}</span>
          </div>
        </section>

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
