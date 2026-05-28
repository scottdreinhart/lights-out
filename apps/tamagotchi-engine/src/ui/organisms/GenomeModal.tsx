import type { PetState } from '@/domain'
import { isPetAlive, isPetInMemorial } from '@/domain'
import { Button } from '@games/assets-shared'
import { type ReactElement } from 'react'
import styles from './TamagotchiScreen.module.css'

interface GenomeModalProps {
  state: PetState
  controls: any
  onClose: () => void
}

export function GenomeModal({ state, controls, onClose }: GenomeModalProps): ReactElement {
  const genetics = state.genetics
  const afterlife = state.afterlife

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2>{state.name} Genome & Identity</h2>
            <p>Derived genetic markers and lineage data</p>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className={styles.modalSummaryGrid}>
          <div className={styles.modalSummaryCard}>
            <span>Variant ID</span>
            <strong>{state.variantId}</strong>
          </div>
          <div className={styles.modalSummaryCard}>
            <span>Stage</span>
            <strong>{state.stage}</strong>
          </div>
          <div className={styles.modalSummaryCard}>
            <span>Generation</span>
            <strong>{state.lifecycle.generation}</strong>
          </div>
          <div className={styles.modalSummaryCard}>
            <span>Gender</span>
            <strong>{genetics?.traitLabel || 'Unknown'}</strong>
          </div>
        </div>

        {genetics && (
          <div className={styles.signalPanel}>
            <div className={styles.signalHeader}>
              <h3>Genetic Markers</h3>
              <span>Inherited Traits</span>
            </div>
            <div className={styles.metaGrid}>
              <div className={styles.metaRow}>
                <span>Temperament</span>
                <strong>{genetics.traitLabel}</strong>
              </div>
              <div className={styles.metaRow}>
                <span>Augment</span>
                <strong>{genetics.augmentLabel}</strong>
              </div>
              <div className={styles.metaRow}>
                <span>Specialization</span>
                <strong>{genetics.augmentDetail}</strong>
              </div>
            </div>
          </div>
        )}

        {afterlife && (
          <div className={styles.interactivePanel}>
            <h3>Afterlife Status</h3>
            <div className={styles.metaGrid}>
              <div className={styles.metaRow}>
                <span>Phase</span>
                <strong>{afterlife.phase}</strong>
              </div>
              <div className={styles.metaRow}>
                <span>Departure Time</span>
                <strong>{afterlife.deathMinute ? `${afterlife.deathMinute}m` : 'N/A'}</strong>
              </div>
            </div>
          </div>
        )}

        {!isPetAlive(state) && isPetInMemorial(state) && (
          <div className={styles.resurrectionBar}>
            <Button variant="primary" onClick={controls.resurrect}>
              Hatch Next Generation
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
