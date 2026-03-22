import React from 'react'
import { useI18nContext } from '@/app'

import type { GameMode } from '@/domain'
import styles from './RulesToggle.module.css'

const MODES: GameMode[] = ['normal', 'misere']

interface RulesToggleProps {
  mode: GameMode
  onSelect: (mode: GameMode) => void
}

const RULE_LABEL_KEY = {
  normal: 'rules.normal',
  misere: 'rules.misere',
} as const

const RulesToggle = React.memo<RulesToggleProps>(({ mode, onSelect }) => {
  const { t } = useI18nContext()

  return (
    <div className={styles.root} role="group" aria-label={t('rules.groupAria')}>
      {MODES.map((m) => (
        <button
          key={m}
          type="button"
          className={`${styles.option} ${styles[m]}${mode === m ? ` ${styles.active}` : ''}`}
          onClick={mode !== m ? () => onSelect(m) : undefined}
          aria-pressed={mode === m}
        >
          {t(RULE_LABEL_KEY[m])}
        </button>
      ))}
    </div>
  )
})

RulesToggle.displayName = 'RulesToggle'

export default RulesToggle
