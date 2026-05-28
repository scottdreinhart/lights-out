import type { GameState } from '@/domain'
import { RunnerEntity } from '@/ui/atoms'
import styles from './RunnerTrack.module.css'

interface RunnerTrackProps {
  state: GameState
  onBurst: () => void
}

const toPercent = (value: number, max: number): number => (value / max) * 100

export const RunnerTrack = ({ state, onBurst }: RunnerTrackProps) => {
  const runnerSizePercent = (state.runner.radius * 2 * 100) / state.level.worldHeight
  const runnerTopPercent =
    toPercent(
      state.runner.y - state.runner.radius,
      state.level.worldHeight - state.level.ceilingY,
    ) + state.level.ceilingY
  const runnerLeftPercent = toPercent(state.runner.x - state.runner.radius, state.level.worldWidth)

  return (
    <section className={styles.trackWrap} aria-label="Pulse Burst runner track">
      <div className={styles.track} onPointerDown={onBurst} role="presentation">
        <div className={styles.ceiling} />
        <div className={styles.floor} />

        {state.obstacles.map((obstacle) => {
          const leftPercent = toPercent(obstacle.x, state.level.worldWidth)
          const widthPercent = toPercent(obstacle.width, state.level.worldWidth)
          const gapTop = obstacle.gap.centerY - obstacle.gap.size / 2
          const gapBottom = obstacle.gap.centerY + obstacle.gap.size / 2
          const topHeightPercent = toPercent(gapTop - state.level.ceilingY, state.level.worldHeight)
          const bottomTopPercent = toPercent(gapBottom, state.level.worldHeight)
          const bottomHeightPercent = toPercent(
            state.level.floorY - gapBottom,
            state.level.worldHeight,
          )

          return (
            <div key={obstacle.id}>
              <RunnerEntity
                kind="obstacle"
                leftPercent={leftPercent}
                widthPercent={widthPercent}
                topPercent={toPercent(state.level.ceilingY, state.level.worldHeight)}
                heightPercent={topHeightPercent}
              />
              <RunnerEntity
                kind="obstacle"
                leftPercent={leftPercent}
                widthPercent={widthPercent}
                topPercent={bottomTopPercent}
                heightPercent={bottomHeightPercent}
              />
            </div>
          )
        })}

        <RunnerEntity
          kind="runner"
          leftPercent={runnerLeftPercent}
          widthPercent={runnerSizePercent}
          topPercent={runnerTopPercent}
          heightPercent={runnerSizePercent}
        />
      </div>
    </section>
  )
}
