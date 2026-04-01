import React from 'react'
import { Button } from '@/ui/atoms'
import { Difficulty } from '@/domain'
import styles from './DifficultySelector.module.css'

interface DifficultySelectorProps {
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulty,
  onDifficultyChange
}) => {
  return (
    <div className={styles.difficultyButtons}>
      <Button
        size="sm"
        variant={difficulty === 'easy' ? 'primary' : 'secondary'}
        onClick={() => onDifficultyChange('easy')}
      >
        Easy
      </Button>
      <Button
        size="sm"
        variant={difficulty === 'medium' ? 'primary' : 'secondary'}
        onClick={() => onDifficultyChange('medium')}
      >
        Medium
      </Button>
      <Button
        size="sm"
        variant={difficulty === 'hard' ? 'primary' : 'secondary'}
        onClick={() => onDifficultyChange('hard')}
      >
        Hard
      </Button>
    </div>
  )
}