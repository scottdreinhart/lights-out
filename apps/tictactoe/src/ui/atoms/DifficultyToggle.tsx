import React from 'react'

import type { Difficulty } from '../../domain/types.ts'
import styles from './DifficultyToggle.module.css'

const LEVELS: Difficulty[] = ['easy', 'medium', 'hard', 'unbeatable']

interface DifficultyToggleProps {
  difficulty: Difficulty
  onSelect: (level: Difficulty) => void
}

const DifficultyToggle = React.memo<DifficultyToggleProps>(({ difficulty, onSelect }) => (
  <div className={styles.root} role="group" aria-label="CPU difficulty">
    {LEVELS.map((level) => (
      <button
        key={level}
        type="button"
        className={`${styles.option}${difficulty === level ? ` ${styles.active}` : ''}`}
        onClick={difficulty !== level ? () => onSelect(level) : undefined}
        aria-pressed={difficulty === level}
      >
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </button>
    ))}
  </div>
))

DifficultyToggle.displayName = 'DifficultyToggle'

export default DifficultyToggle
