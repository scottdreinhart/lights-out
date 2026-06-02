import type { GameState, SentinelAiTier } from '@/domain'
import { SENTINEL_AI_TIERS, TICK_MS } from '@/domain'
import { HudPill, PressureMeter } from '@/ui/atoms'
import styles from './GameHud.module.css'

interface NodeProgress {
  collected: number
  total: number
}

interface GameHudProps {
  state: GameState
  nodeProgress: NodeProgress
  aiRuntime: 'wasm' | 'js'
  onSentinelAiTierChange: (tier: SentinelAiTier) => void
}

export const GameHud = ({
  state,
  nodeProgress,
  aiRuntime,
  onSentinelAiTierChange,
}: GameHudProps) => {
  const elapsedSeconds = Math.floor((state.tick * TICK_MS) / 1000)
  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = `${elapsedSeconds % 60}`.padStart(2, '0')

  return (
    <section className={styles.hud} aria-label="Circuit Maze HUD">
      <PressureMeter
        pressure={state.pressure}
        lockdownTicksRemaining={state.lockdownTicksRemaining}
      />
      <div className={styles.grid}>
        <HudPill label="Nodes" value={`${nodeProgress.collected}/${nodeProgress.total}`} />
        <HudPill label="Exit" value={state.exitUnlocked ? 'OPEN' : 'LOCKED'} />
        <HudPill label="Time" value={`${minutes}:${seconds}`} />
      </div>
      <label className={styles.tierSelectorLabel}>
        <span className={styles.tierLabelRow}>
          Sentinel AI
          <span
            className={aiRuntime === 'wasm' ? styles.wasmBadge : styles.jsBadge}
            aria-live="polite"
          >
            {aiRuntime === 'wasm' ? 'WASM ACTIVE' : 'JS FALLBACK'}
          </span>
        </span>
        <select
          className={styles.tierSelector}
          value={state.sentinelAiTier}
          onChange={(event) => onSentinelAiTierChange(event.target.value as SentinelAiTier)}
          aria-label="Sentinel AI difficulty tier"
        >
          {SENTINEL_AI_TIERS.map((tier) => (
            <option key={tier} value={tier}>
              {tier.toUpperCase()}
            </option>
          ))}
        </select>
      </label>
      <p className={styles.status}>{state.statusMessage}</p>
    </section>
  )
}
