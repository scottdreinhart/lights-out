import type { PetState } from '@/domain'
import { getActionPrice } from '@/domain'
import { Button } from '@games/assets-shared'
import { type ReactElement } from 'react'

import { ACTION_EMOJIS } from './TamagotchiScreen.constants'
import styles from './TamagotchiScreen.module.css'

interface ActionPanelProps {
  state: PetState
  controls: any
  isMobile: boolean
}

export function ActionPanel({ state, controls }: ActionPanelProps): ReactElement {
  const renderActionLabel = (type: string, label: string) => {
    const price = getActionPrice(state, type as any)
    const emoji = ACTION_EMOJIS[type] || '❓'
    return (
      <div className={styles.actionButtonRow}>
        <span className={styles.buttonEmoji} aria-hidden="true">
          {emoji}
        </span>
        <span className={styles.buttonText}>{label}</span>
        {price > 0 && <span className={styles.buttonPriceTag}>-{price}p</span>}
      </div>
    )
  }

  return (
    <div className={styles.actionDashboard}>
      <div className={styles.actionSection}>
        <div className={styles.sectionHeader}>
          <h3>Care & Nutrition</h3>
        </div>
        <div className={styles.actionList}>
          <Button variant="primary" onClick={() => controls.dispatch('treat')}>
            {renderActionLabel('treat', 'Treat')}
          </Button>
          <Button variant="primary" onClick={() => controls.dispatch('feedMeal')}>
            {renderActionLabel('feedMeal', 'Meal')}
          </Button>
          <Button variant="primary" onClick={() => controls.dispatch('feedSnack')}>
            {renderActionLabel('feedSnack', 'Snack')}
          </Button>
          <Button variant="primary" onClick={() => controls.dispatch('cleanPoo')}>
            {renderActionLabel('cleanPoo', 'Clean')}
          </Button>
          <Button
            variant="primary"
            onClick={() => controls.dispatch('medicine')}
            disabled={state.sicknessCount === 0}
          >
            {renderActionLabel('medicine', 'Medicine')}
          </Button>
        </div>
      </div>

      <div className={styles.actionSection}>
        <div className={styles.sectionHeader}>
          <h3>Training & Play</h3>
        </div>
        <div className={styles.actionList}>
          <Button variant="secondary" onClick={() => controls.dispatch('playGame')}>
            {renderActionLabel('playGame', 'Play')}
          </Button>
          <Button variant="secondary" onClick={() => controls.dispatch('gamePlay')}>
            {renderActionLabel('gamePlay', 'Games')}
          </Button>
          <Button variant="secondary" onClick={() => controls.dispatch('arcadePlay')}>
            {renderActionLabel('arcadePlay', 'Arcade')}
          </Button>
          <Button variant="secondary" onClick={() => controls.dispatch('discipline')}>
            {renderActionLabel('discipline', 'Discipline')}
          </Button>
          <Button variant="secondary" onClick={() => controls.dispatch('praise')}>
            {renderActionLabel('praise', 'Praise')}
          </Button>
        </div>
      </div>
    </div>
  )
}
