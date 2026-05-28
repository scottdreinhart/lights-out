import type { PetBank, PetState, TamagotchiSignalProfile } from '@/domain'
import { PetMeters } from '@/ui/molecules/PetMeters'
import { type ReactElement } from 'react'
import styles from './TamagotchiScreen.module.css'

interface SignalPanelProps {
  state: PetState
  bank: PetBank
  profile: TamagotchiSignalProfile
}

export function SignalPanel({ state, bank, profile }: SignalPanelProps): ReactElement {
  return (
    <div className={styles.signalPanel}>
      <div className={styles.signalHeader}>
        <h2>Gaming Metrics</h2>
        <span>Dynamic Signals</span>
      </div>

      <div className={styles.gamingMetricsGrid}>
        <div className={styles.meterRow}>
          <div className={styles.timerItemHeader}>
            <span>Pressure</span>
            <span className={styles.timerClock}>{profile.pressure}%</span>
          </div>
          <div className={styles.timerTrack}>
            <div
              className={`${styles.timerFill} ${styles.meterFillDanger}`}
              style={{ width: `${profile.pressure}%` }}
            />
          </div>
        </div>

        <div className={styles.meterRow}>
          <div className={styles.timerItemHeader}>
            <span>Intensity</span>
            <span className={styles.timerClock}>{profile.intensity}%</span>
          </div>
          <div className={styles.timerTrack}>
            <div
              className={`${styles.timerFill} ${styles.meterFillFocus}`}
              style={{ width: `${profile.intensity}%` }}
            />
          </div>
        </div>

        <div className={styles.meterRow}>
          <div className={styles.timerItemHeader}>
            <span>Focus</span>
            <span className={styles.timerClock}>{profile.focus}%</span>
          </div>
          <div className={styles.timerTrack}>
            <div
              className={`${styles.timerFill} ${styles.meterFillProgress}`}
              style={{ width: `${profile.focus}%` }}
            />
          </div>
        </div>

        <div className={styles.meterRow}>
          <div className={styles.timerItemHeader}>
            <span>Progress</span>
            <span className={styles.timerClock}>{profile.progress}%</span>
          </div>
          <div className={styles.timerTrack}>
            <div
              className={`${styles.timerFill} ${styles.meterFillLifetime}`}
              style={{ width: `${profile.progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.economyRow}>
        <span>Bank Balance</span>
        <strong>{bank.balance} pts</strong>
      </div>

      <PetMeters state={state} />
    </div>
  )
}
