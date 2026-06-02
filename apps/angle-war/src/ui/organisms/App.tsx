import { useGame } from '@/app'
import {
  ARENA_HEIGHT,
  ARENA_WIDTH,
  GROUND_Y,
  PLAYER_X,
  PLAYER_Y,
  TARGET_PROGRESS,
  WORLD_WIDTH,
  sampleTrajectory,
} from '@/domain'
import { ActionButtons, ProgressMeters, StatsGrid } from '@/ui/molecules'
import { SplashScreen } from '@games/common'
import { useCallback, useState } from 'react'
import styles from './App.module.css'

const toScreenX = (worldX: number, cameraX: number): number =>
  (((worldX - cameraX + WORLD_WIDTH) % WORLD_WIDTH) / WORLD_WIDTH) * ARENA_WIDTH

const toScreenY = (worldY: number): number => worldY

export const App = () => {
  const [showSplash, setShowSplash] = useState(true)
  const { state, meta, dispatch, reset } = useGame()
  const progressPercent = Math.min(100, Math.max(0, (state.progress / TARGET_PROGRESS) * 100))
  const handleSplashComplete = useCallback(() => {
    setShowSplash(false)
  }, [])

  if (showSplash) {
    return (
      <SplashScreen onComplete={handleSplashComplete} minimumDuration={2000} title="ANGLE WAR" />
    )
  }

  const playerScreenX = toScreenX(PLAYER_X, state.cameraX)
  const playerScreenY = toScreenY(PLAYER_Y)
  const tipX = playerScreenX + Math.cos(state.aim.angle) * 22
  const tipY = playerScreenY + Math.sin(state.aim.angle) * 22

  const trajectory = sampleTrajectory(
    { x: PLAYER_X, y: PLAYER_Y },
    state.aim.angle,
    state.aim.force,
  )
    .slice(0, 34)
    .map((point) => `${toScreenX(point.x, state.cameraX)},${toScreenY(point.y)}`)
    .join(' ')

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

        <section className={styles.arenaSection}>
          <svg
            aria-label="Angle War battlefield"
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
            <line className={styles.ground} x1={0} x2={ARENA_WIDTH} y1={GROUND_Y} y2={GROUND_Y} />
            <polyline className={styles.trajectory} points={trajectory} />

            {state.objectives.map((objective) => (
              <circle
                className={
                  objective.status === 'safe'
                    ? styles.objectiveSafe
                    : objective.status === 'captured'
                      ? styles.objectiveCaptured
                      : styles.objectiveLost
                }
                cx={toScreenX(objective.position.x, state.cameraX)}
                cy={toScreenY(objective.position.y)}
                key={objective.id}
                r={8}
              />
            ))}

            {state.enemies.map((enemy) => (
              <circle
                className={
                  enemy.kind === 'skimmer'
                    ? styles.enemySkimmer
                    : enemy.kind === 'floater'
                      ? styles.enemyFloater
                      : styles.enemyAbductor
                }
                cx={toScreenX(enemy.position.x, state.cameraX)}
                cy={toScreenY(enemy.position.y)}
                key={enemy.id}
                r={enemy.radius}
              />
            ))}

            {state.projectiles.map((projectile) => (
              <circle
                className={styles.projectile}
                cx={toScreenX(projectile.position.x, state.cameraX)}
                cy={toScreenY(projectile.position.y)}
                key={projectile.id}
                r={projectile.radius}
              />
            ))}

            <circle className={styles.turretBase} cx={playerScreenX} cy={playerScreenY} r={18} />
            <line
              className={styles.turretBarrel}
              x1={playerScreenX}
              x2={tipX}
              y1={playerScreenY}
              y2={tipY}
            />
          </svg>

          <div className={styles.arenaMeta}>
            <span>Wave {state.wave}</span>
            <span>Threats {state.enemies.length}</span>
            <span>Angle {((state.aim.angle * 180) / Math.PI).toFixed(0)}°</span>
            <span>Force {state.aim.force.toFixed(1)}</span>
          </div>
        </section>

        <StatsGrid
          lives={state.lives}
          score={Math.floor(state.score)}
          styles={styles}
          tick={state.tick}
        />

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
