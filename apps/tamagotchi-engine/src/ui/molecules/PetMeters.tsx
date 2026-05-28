import type { ReactElement } from 'react'

import type { PetState } from '@/domain'
import { StatPill } from '@games/assets-shared'

import styles from './PetMeters.module.css'

interface PetMetersProps {
  state: PetState
}

function meterValue(max: number, current: number): string {
  return `${Math.max(0, Math.min(max, current))}/${max}`
}

export function PetMeters({ state }: PetMetersProps): ReactElement {
  return (
    <section className={styles.root} aria-label="Pet meters">
      <StatPill label="Hunger" value={meterValue(4, state.meters.hunger)} />
      <StatPill label="Effort" value={meterValue(4, state.meters.effort)} />
      <StatPill label="Happiness" value={meterValue(4, state.meters.happiness)} />
      <StatPill label="Discipline" value={`${state.meters.discipline}/100`} />
      <StatPill label="Angel Power" value={`${state.meters.angelPower}/100`} />
      <StatPill label="Weight" value={`${state.meters.weight}oz`} />
    </section>
  )
}
