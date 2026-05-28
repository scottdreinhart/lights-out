import type { GameState } from '@/domain'
import { TICK_MS } from '@/domain'
import { HudPill, PressureMeter } from '@/ui/atoms'
import styles from './GameHud.module.css'

interface GameHudProps {
  state: GameState
}

export const GameHud = ({ state }: GameHudProps) => {
  const elapsedSeconds = Math.floor((state.tick * TICK_MS) / 1000)
  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = `${elapsedSeconds % 60}`.padStart(2, '0')

  return (
    <section className={styles.hud} aria-label="Pulse Burst HUD">
      <PressureMeter intensity={state.intensity} speed={state.speed} />
      <div className={styles.grid}>
        <HudPill label="Score" value={`${state.score}`} />
        <HudPill label="Distance" value={`${state.distance.toFixed(1)}u`} />
        <HudPill label="Gap" value={`${state.gapSize.toFixed(1)}%`} />
        <HudPill label="Time" value={`${minutes}:${seconds}`} />
      </div>
      <p className={styles.status}>{state.statusMessage}</p>
    </section>
  )
}
