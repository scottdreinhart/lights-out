import type { PetState } from '@/domain'
import {
  ANGEL_STAGE_MINUTES,
  OCEAN_STAGE_MINUTES,
  ORIGINAL_STAGE_MINUTES,
  REAL_WORLD_MINUTES_PER_DAY,
  getPetLifeExpectancyDays,
  getTamagotchiDecisionHint,
} from '@/domain'
import { type ReactElement } from 'react'
import { LIFE_EMOJI } from './TamagotchiScreen.constants'
import styles from './TamagotchiScreen.module.css'

interface StatusPanelProps {
  state: PetState
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function getStageCountdownMinutes(state: PetState): number | null {
  const elapsedMinutes = state.lifecycle.ageMinutes - state.lifecycle.stageEnteredAtMinute
  const stageThresholds =
    state.variantId === 'angel'
      ? ANGEL_STAGE_MINUTES
      : state.variantId === 'ocean'
        ? OCEAN_STAGE_MINUTES
        : ORIGINAL_STAGE_MINUTES

  switch (state.stage) {
    case 'baby':
      return Math.max(0, stageThresholds.babyToChild - elapsedMinutes)
    case 'child':
      return Math.max(0, stageThresholds.childToTeen - elapsedMinutes)
    case 'teen':
      return Math.max(0, stageThresholds.teenToAdult - elapsedMinutes)
    default:
      return null
  }
}

function formatCountdown(minutes: number, showSeconds = false): string {
  const safeSeconds = Math.max(0, Math.floor(minutes * 60))
  const days = Math.floor(safeSeconds / (REAL_WORLD_MINUTES_PER_DAY * 60))
  const hours = Math.floor((safeSeconds % (REAL_WORLD_MINUTES_PER_DAY * 60)) / 3600)
  const mins = Math.floor((safeSeconds % 3600) / 60)
  const secs = safeSeconds % 60

  if (days > 0) {
    return showSeconds ? `${days}d ${hours}h ${mins}m ${secs}s` : `${days}d ${hours}h ${mins}m`
  }
  if (hours > 0) {
    return showSeconds
      ? `${hours}h ${mins.toString().padStart(2, '0')}m ${secs}s`
      : `${hours}h ${mins}m`
  }
  return showSeconds ? `${mins}:${secs.toString().padStart(2, '0')}` : `${mins}m`
}

export function StatusPanel({ state }: StatusPanelProps): ReactElement {
  const decisionHint = getTamagotchiDecisionHint(state)
  const stageCountdownMinutes = getStageCountdownMinutes(state)

  const dayCountdownMinutes = useMemo(() => {
    const remainder = state.lifecycle.ageMinutes % REAL_WORLD_MINUTES_PER_DAY
    return remainder === 0 ? REAL_WORLD_MINUTES_PER_DAY : REAL_WORLD_MINUTES_PER_DAY - remainder
  }, [state.lifecycle.ageMinutes])

  const lifeCountdownMinutes = useMemo(
    () =>
      Math.max(
        0,
        getPetLifeExpectancyDays(state.variantId) * REAL_WORLD_MINUTES_PER_DAY -
          state.lifecycle.ageMinutes,
      ),
    [state.lifecycle.ageMinutes, state.variantId],
  )

  return (
    <div className={styles.sidebar}>
      <div className={styles.decisionPanel}>
        <div className={styles.decisionCardHeader}>
          <h3>Next Decision</h3>
          <span>{LIFE_EMOJI} System Clock</span>
        </div>
        <div className={styles.decisionHeader}>
          <span>
            Engine <strong>{decisionHint.type}</strong>
          </span>
          <span>
            Target <strong>{decisionHint.targetMinute}m</strong>
          </span>
        </div>
        <p>{decisionHint.context}</p>
      </div>

      <div className={styles.timerPanel}>
        <div className={styles.sectionHeader}>
          <h2>Biological Timers</h2>
          <span>{LIFE_EMOJI} Lifecycle</span>
        </div>
        <div className={styles.timerList}>
          <div className={styles.timerItem}>
            <div className={styles.timerItemHeader}>
              <span>Stage Progress</span>
              <span className={styles.timerClock}>
                {stageCountdownMinutes !== null
                  ? formatCountdown(stageCountdownMinutes, true)
                  : '∞'}
              </span>
            </div>
            <div className={styles.timerTrack}>
              <span
                className={`${styles.timerFill} ${styles.timerFillBlue}`}
                style={{ width: `${stageCountdownMinutes !== null ? 75 : 100}%` }}
              />
            </div>
          </div>

          <div className={styles.timerItem}>
            <div className={styles.timerItemHeader}>
              <span>Life Expectancy</span>
              <span className={styles.timerClock}>
                {formatCountdown(lifeCountdownMinutes, true)}
              </span>
            </div>
            <div className={styles.timerTrack}>
              <span
                className={`${styles.timerFill} ${styles.timerFillAmber}`}
                style={{
                  width: `${clamp((state.lifecycle.ageMinutes / (getPetLifeExpectancyDays(state.variantId) * REAL_WORLD_MINUTES_PER_DAY)) * 100, 0, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className={styles.timerItem}>
            <div className={styles.timerItemHeader}>
              <span>Day Cycle</span>
              <span className={styles.timerClock}>
                {formatCountdown(dayCountdownMinutes, true)}
              </span>
            </div>
            <div className={styles.timerTrack}>
              <span
                className={`${styles.timerFill} ${styles.timerFillViolet}`}
                style={{
                  width: `${(1 - dayCountdownMinutes / REAL_WORLD_MINUTES_PER_DAY) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useMemo } from 'react'
