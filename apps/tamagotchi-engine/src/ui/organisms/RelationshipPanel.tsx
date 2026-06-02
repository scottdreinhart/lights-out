import type { PetBank, PetState } from '@/domain'
import { useMemo, type ReactElement } from 'react'
import styles from './TamagotchiScreen.module.css'

interface RelationshipItem {
  action: string
  valence: string
  behavior: string
  metric: string
  current: string
}

interface RelationshipPanelProps {
  state: PetState
  bank: PetBank
}

export function RelationshipPanel({ state, bank }: RelationshipPanelProps): ReactElement {
  const relationshipCards = useMemo<RelationshipItem[]>(
    () => [
      {
        action: 'Treat',
        valence: 'Positive',
        behavior: 'Immediate comfort and morale recovery',
        metric: 'Happiness',
        current: `Happiness ${state.meters.happiness}/4`,
      },
      {
        action: 'Snack',
        valence: 'Positive',
        behavior: 'Quick feed with a small morale lift',
        metric: 'Weight',
        current: `Weight ${state.meters.weight}`,
      },
      {
        action: 'Meal',
        valence: 'Positive',
        behavior: 'Full feed with stronger relief',
        metric: 'Hunger',
        current: `Hunger ${state.meters.hunger}/4`,
      },
      {
        action: 'Play',
        valence: 'Positive',
        behavior: 'Free play for low-cost morale recovery',
        metric: 'Happiness',
        current: `Happiness ${state.meters.happiness}/4`,
      },
      {
        action: 'Games',
        valence: 'Positive',
        behavior: 'Priced play for better reward efficiency',
        metric: 'Bank',
        current: `Bank ${bank.balance}`,
      },
      {
        action: 'Training',
        valence: 'Neutral',
        behavior: 'Discipline and praise based on behavior',
        metric: 'Training',
        current: `Discipline ${state.meters.discipline}/4`,
      },
      {
        action: 'Medicine',
        valence: 'Corrective',
        behavior: 'Cures sickness but impacts morale',
        metric: 'Health',
        current: `Sickness ${state.sicknessCount}`,
      },
      {
        action: 'Cleaning',
        valence: 'Sanitary',
        behavior: 'Removes waste to prevent sickness',
        metric: 'Hygiene',
        current: `Waste ${state.poopCount}`,
      },
    ],
    [state.meters, state.sicknessCount, state.poopCount, bank.balance],
  )

  return (
    <div className={styles.relationshipPanel}>
      <div className={styles.sectionHeader}>
        <h3>Action Insights</h3>
        <span>Caregiver Guide</span>
      </div>
      <div className={styles.relationshipGrid}>
        {relationshipCards.map((card) => (
          <div key={card.action} className={styles.relationshipCard}>
            <strong>{card.action}</strong>
            <span>{card.valence}</span>
            <p>{card.behavior}</p>
            <strong>{card.current}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
