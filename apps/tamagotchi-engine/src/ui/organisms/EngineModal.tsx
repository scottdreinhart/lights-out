import type { PetState } from '@/domain'
import { Button } from '@games/assets-shared'
import { type ReactElement } from 'react'
import { EngineInsights } from './EngineInsights'
import styles from './TamagotchiScreen.module.css'

interface EngineModalProps {
  state: PetState
  onClose: () => void
}

export function EngineModal({ state, onClose }: EngineModalProps): ReactElement {
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2>Engine Analytics</h2>
            <p>Hidden simulation clock-cycles and threshold biases</p>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>

        <EngineInsights state={state} />

        <div className={styles.modalFooter}>
          <p className={styles.insightNote}>
            These analytics expose the deterministic internal state of the simulation engine.
          </p>
        </div>
      </div>
    </div>
  )
}
