import type { PetState } from '@/domain'
import { useMemo, type ReactElement } from 'react'
import styles from './TamagotchiScreen.module.css'

interface EngineInsightsProps {
  state: PetState
}

export function EngineInsights({ state }: EngineInsightsProps): ReactElement {
  // Metabolic Intervals (Anticipated)
  const hungerInterval = 30
  const happinessInterval = 45

  const hungerProgress = useMemo(
    () => ((state.lifecycle.ageMinutes % hungerInterval) / hungerInterval) * 100,
    [state.lifecycle.ageMinutes],
  )

  const happinessProgress = useMemo(
    () => ((state.lifecycle.ageMinutes % happinessInterval) / happinessInterval) * 100,
    [state.lifecycle.ageMinutes],
  )

  // Evolution Bias Logic
  const evolutionMetric = useMemo(() => {
    if (state.variantId === 'ocean') {
      return {
        label: 'Evolution Discipline',
        value: state.meters.discipline,
        target: 75,
        fillClass: styles.meterFillFocus,
      }
    }
    if (state.variantId === 'angel') {
      return {
        label: 'Angel Power Growth',
        value: state.meters.angelPower,
        target: 75,
        fillClass: styles.meterFillProgress,
      }
    }
    return null
  }, [state.variantId, state.meters.discipline, state.meters.angelPower])

  // Health Risk Calculation (Visual Only)
  const healthRisk = useMemo(() => {
    const risk = state.poopCount * 20 + state.care.total * 5
    return Math.min(100, risk)
  }, [state.poopCount, state.care.total])

  return (
    <div className={styles.signalPanel}>
      <div className={styles.signalHeader}>
        <h2>Engine Analytics</h2>
        <span>Simulation Cycles</span>
      </div>

      <div className={styles.meters}>
        <div className={styles.meterRow}>
          <div className={styles.timerItemHeader}>
            <span>Hunger Heart Decay</span>
            <span className={styles.timerClock}>{Math.round(hungerProgress)}%</span>
          </div>
          <div className={styles.timerTrack}>
            <div
              className={`${styles.timerFill} ${styles.timerFillAmber}`}
              style={{ width: `${hungerProgress}%` }}
            />
          </div>
        </div>

        <div className={styles.meterRow}>
          <div className={styles.timerItemHeader}>
            <span>Happiness Heart Decay</span>
            <span className={styles.timerClock}>{Math.round(happinessProgress)}%</span>
          </div>
          <div className={styles.timerTrack}>
            <div
              className={`${styles.timerFill} ${styles.timerFillViolet}`}
              style={{ width: `${happinessProgress}%` }}
            />
          </div>
        </div>

        {evolutionMetric && (
          <div className={styles.meterRow}>
            <div className={styles.timerItemHeader}>
              <span>{evolutionMetric.label}</span>
              <span className={styles.timerClock}>
                {evolutionMetric.value}/{evolutionMetric.target}
              </span>
            </div>
            <div className={styles.timerTrack}>
              <div
                className={`${styles.timerFill} ${evolutionMetric.fillClass}`}
                style={{
                  width: `${Math.min(100, (evolutionMetric.value / evolutionMetric.target) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className={styles.meterRow}>
          <div className={styles.timerItemHeader}>
            <span>Sickness Incubation Risk</span>
            <span className={styles.timerClock}>{healthRisk}%</span>
          </div>
          <div className={styles.timerTrack}>
            <div
              className={`${styles.timerFill} ${styles.timerFillRed}`}
              style={{ width: `${healthRisk}%` }}
            />
          </div>
        </div>
      </div>

      <p className={styles.insightNote}>
        Bars represent hidden clock-cycles and threshold biases within the simulation engine.
      </p>
    </div>
  )
}
