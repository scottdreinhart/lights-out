import { useGame, useRunnerInput, useDashLanesAudio } from '@/app'
import { LANE_POSITION_MAP, RUNNER_FLOW_PROFILE, STACK_ADDITIONS } from '@/domain'
import { ActionButtons, ProgressMeters, StatsGrid } from '@/ui/molecules'
import type { CSSProperties } from 'react'
import styles from './App.module.css'

export const App = () => {
  const { state, meta, dispatch, reset } = useGame()
  useDashLanesAudio(state)
  useRunnerInput({ phase: state.phase, dispatch, reset })

  const progressPercent = state.progress
  const elapsedSeconds = (state.runTimeMs / 1000).toFixed(1)

  const laneGlowStyle: CSSProperties = {
    transform: `translateX(${LANE_POSITION_MAP[state.runner.lane]}%)`,
  }

  return (
    <main className={styles.root}>
      <section className={styles.card} role="application">
        <header className={styles.header}>
          <p className={styles.kicker}>{meta.family} Prototype</p>
          <h1>{meta.title}</h1>
          <p className={styles.summary}>{meta.summary}</p>
          <p className={styles.runnerProfile}>
            Flow {RUNNER_FLOW_PROFILE.scrollDirection} · Camera {RUNNER_FLOW_PROFILE.cameraMode} ·
            Input {RUNNER_FLOW_PROFILE.primaryInput}
          </p>
        </header>

        <section className={styles.corridor} aria-label="Dash-Lanes corridor">
          <div className={styles.depthGrid} />
          <div className={styles.laneGuides}>
            <span />
            <span />
          </div>
          <div className={styles.runnerPulse} style={laneGlowStyle} />
          {state.obstacles.map((obstacle) => {
            const normalizedDepth = Math.max(0, Math.min(1, obstacle.distance / 120))
            const scale = 0.7 + (1 - normalizedDepth) * 0.7
            const opacity = 0.4 + (1 - normalizedDepth) * 0.6
            const top = `${normalizedDepth * 72}%`
            const left = `${50 + LANE_POSITION_MAP[obstacle.lane]}%`
            return (
              <div
                aria-label={`Obstacle lane ${obstacle.lane + 1}`}
                className={styles.obstacle}
                key={obstacle.id}
                style={{ top, left, opacity, transform: `translate(-50%, 0) scale(${scale})` }}
              />
            )
          })}
          {state.phase === 'gameOver' ? (
            <div className={styles.overlay}>
              <h2>System collapse</h2>
              <p>{state.status}</p>
              <button className={styles.reset} onClick={reset} type="button">
                Retry run
              </button>
            </div>
          ) : null}
        </section>

        <ProgressMeters
          focus={state.focus}
          intensity={state.intensity}
          progress={progressPercent}
          styles={styles}
        />

        <StatsGrid lives={state.lives} score={state.score} styles={styles} tick={state.tick} />

        <p className={styles.status}>
          {state.status} · Lane {state.runner.lane + 1} · Speed {state.speed.toFixed(1)} · Tick{' '}
          {elapsedSeconds}s
        </p>

        <p className={styles.stackHint}>
          Stack path: {STACK_ADDITIONS.simulation}
          {' -> '}
          {STACK_ADDITIONS.rendering}
          {' -> '}
          {STACK_ADDITIONS.audio}
        </p>

        <ActionButtons
          onAction={dispatch}
          primaryLabel={meta.primaryLabel}
          secondaryLabel={meta.secondaryLabel}
          styles={styles}
          tertiaryLabel={meta.tertiaryLabel}
        />

        <div className={styles.directionalRow}>
          <button className={styles.directional} onClick={() => dispatch('laneLeft')} type="button">
            Shift Left
          </button>
          <button
            className={styles.directional}
            onClick={() => dispatch('laneRight')}
            type="button"
          >
            Shift Right
          </button>
          <button className={styles.reset} onClick={reset} type="button">
            Reset Session
          </button>
        </div>
      </section>
    </main>
  )
}
