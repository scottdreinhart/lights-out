import type { PetState } from '@/domain'
import { useMemo, type ReactElement } from 'react'
import styles from './TamagotchiScreen.module.css'

interface EventHistoryProps {
  history: PetState['history']
}

export function EventHistory({ history }: EventHistoryProps): ReactElement {
  const events = useMemo(() => history.slice(-8).reverse(), [history])

  const getEventClass = (type: string) => {
    switch (type) {
      case 'evolution':
        return styles.eventEvolution
      case 'sickness':
      case 'death':
      case 'departure':
        return styles.eventCritical
      case 'feedMeal':
      case 'feedSnack':
      case 'medicine':
      case 'cleanPoo':
        return styles.eventCare
      case 'discipline':
      case 'praise':
        return styles.eventTraining
      case 'call':
        return styles.eventCall
      default:
        return styles.eventNormal
    }
  }

  return (
    <div className={styles.history}>
      <div className={styles.historyHeader}>
        <h2>Activity Log</h2>
      </div>
      <ul className={styles.historyList}>
        {events.map((event, i) => (
          <li
            key={`${event.minute}-${i}`}
            className={`${styles.historyItem} ${getEventClass(event.type)}`}
          >
            <div className={styles.historyItemHeader}>
              <strong>{event.type.replace(/([A-Z])/g, ' $1')}</strong>
              <span>{event.minute}m</span>
            </div>
            <p>{event.detail}</p>
          </li>
        ))}
        {events.length === 0 && <p className={styles.historyEmpty}>No activity yet.</p>}
      </ul>
    </div>
  )
}
