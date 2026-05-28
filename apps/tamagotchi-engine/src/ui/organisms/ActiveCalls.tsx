import type { PetCall, PetState } from '@/domain'
import { ATTENTION_WINDOW_MINUTES } from '@/domain'
import { type ReactElement } from 'react'
import { CALLS_EMOJI } from './TamagotchiScreen.constants'
import styles from './TamagotchiScreen.module.css'

interface ActiveCallsProps {
  state: PetState
}

function getCallLabel(callType: PetCall['type']): string {
  switch (callType) {
    case 'hunger':
      return 'Hunger'
    case 'effort':
      return 'Effort'
    case 'discipline':
      return 'Discipline'
    case 'praise':
      return 'Praise'
    case 'lights':
      return 'Lights'
    case 'sickness':
      return 'Sickness'
    default:
      return 'Need'
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function formatCountdown(minutes: number): string {
  const safeMins = Math.max(0, minutes)
  return `${safeMins}m`
}

export function ActiveCalls({ state }: ActiveCallsProps): ReactElement | null {
  const activeCalls = state.calls.filter((call) => !call.resolved)

  if (activeCalls.length === 0) {
    return null
  }

  return (
    <div className={styles.callPanel}>
      <div className={styles.callPanelHeader}>
        <h3>{CALLS_EMOJI} Active Calls</h3>
        <span>{activeCalls.length} needed</span>
      </div>
      <div className={styles.callList}>
        {activeCalls.map((call) => {
          // Calculate responsiveness: 100% is full time remaining, 0% is expired.
          // call.minute is issuedAtMinute
          const timeElapsed = state.lifecycle.ageMinutes - call.issuedAtMinute
          const progressPct = clamp(100 - (timeElapsed / ATTENTION_WINDOW_MINUTES) * 100, 0, 100)

          return (
            <div key={`${call.type}-${call.issuedAtMinute}`} className={styles.callItem}>
              <div className={styles.callItemHeader}>
                <strong>{getCallLabel(call.type)}</strong>
                <span>{formatCountdown(call.expiresAtMinute - state.lifecycle.ageMinutes)}</span>
              </div>
              <div className={styles.callRag}>
                <div className={[styles.callRagSegment, styles.callRagRed].join(' ')} />
                <div className={[styles.callRagSegment, styles.callRagAmber].join(' ')} />
                <div className={[styles.callRagSegment, styles.callRagGreen].join(' ')} />

                <div className={styles.callRagFill} style={{ width: `${progressPct}%` }} />

                <div className={styles.callRagMarker} style={{ left: `${progressPct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
