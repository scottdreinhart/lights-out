import React from 'react'
import { useI18nContext } from '@/app'

import type { Difficulty } from '@/domain'
import styles from './DifficultyToggle.module.css'

const LEVELS: Difficulty[] = ['easy', 'medium', 'hard']

const DIFFICULTY_LABEL_KEY = {
  easy: 'difficulty.easy',
  medium: 'difficulty.medium',
  hard: 'difficulty.hard',
} as const

interface DifficultyToggleProps {
  difficulty: Difficulty
  onSelect: (level: Difficulty) => void
}

const DifficultyToggle = React.memo<DifficultyToggleProps>(({ difficulty, onSelect }) => {
  const { t } = useI18nContext()

  return (
    <div className={styles.root} role="group" aria-label={t('difficulty.groupAria')}>
      {LEVELS.map((level) => (
        <button
          key={level}
          type="button"
          className={`${styles.option} ${styles[level]}${difficulty === level ? ` ${styles.active}` : ''}`}
          onClick={difficulty !== level ? () => onSelect(level) : undefined}
          aria-pressed={difficulty === level}
        >
          {t(DIFFICULTY_LABEL_KEY[level])}
        </button>
      ))}
    </div>
  )
})

DifficultyToggle.displayName = 'DifficultyToggle'

export default DifficultyToggle
