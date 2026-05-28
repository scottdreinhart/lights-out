import type { PetState } from '@/domain'
import { Button } from '@games/assets-shared'
import { type ReactElement } from 'react'
import { VARIANT_EMOJIS } from './TamagotchiScreen.constants'
import styles from './TamagotchiScreen.module.css'

interface DebugModalProps {
  state: PetState
  controls: any
  onClose: () => void
}

export function DebugModal({ state, controls, onClose }: DebugModalProps): ReactElement {
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2>Engine Runtime Debug</h2>
            <p>Internal state and decision matrices</p>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className={styles.debugGrid}>
          <div className={styles.debugCard}>
            <h3>Pet State</h3>
            <div className={styles.debugList}>
              <div className={styles.debugRow}>
                <span>Hunger</span>
                <strong>{state.meters.hunger}/4</strong>
              </div>
              <div className={styles.debugRow}>
                <span>Happiness</span>
                <strong>{state.meters.happiness}/4</strong>
              </div>
              <div className={styles.debugRow}>
                <span>Discipline</span>
                <strong>{state.meters.discipline}/100</strong>
              </div>
              <div className={styles.debugRow}>
                <span>Weight</span>
                <strong>{state.meters.weight}oz</strong>
              </div>
            </div>
          </div>

          <div className={styles.debugCard}>
            <h3>Runtime Variables</h3>
            <div className={styles.debugList}>
              <div className={styles.debugRow}>
                <span>Care Mistakes</span>
                <strong>{state.care.total}</strong>
              </div>
              <div className={styles.debugRow}>
                <span>Sickness Count</span>
                <strong>{state.sicknessCount}</strong>
              </div>
              <div className={styles.debugRow}>
                <span>Poo Count</span>
                <strong>{state.poopCount}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.interactivePanel}>
          <div className={styles.playHeader}>
            <h3>Variant Management</h3>
            <span>Switch Profile</span>
          </div>
          <div className={styles.variantStrip}>
            <Button variant="secondary" onClick={() => controls.reset({ variantId: 'original' })}>
              {VARIANT_EMOJIS[0].emoji} Original
            </Button>
            <Button variant="secondary" onClick={() => controls.reset({ variantId: 'angel' })}>
              {VARIANT_EMOJIS[1].emoji} Angel
            </Button>
            <Button variant="secondary" onClick={() => controls.reset({ variantId: 'ocean' })}>
              {VARIANT_EMOJIS[2].emoji} Ocean
            </Button>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <Button variant="secondary" onClick={() => controls.reset({ variantId: 'original' })}>
            Hard Reset Engine
          </Button>
        </div>
      </div>
    </div>
  )
}
