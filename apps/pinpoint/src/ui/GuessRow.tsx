import React from 'react'
import type { GuessResult } from '@/domain'
import { Peg } from './Peg'
import { FeedbackPegs } from './FeedbackPegs'
import styles from './GuessRow.module.css'

interface GuessRowProps {
  guessResult: GuessResult
  isCurrentGuess?: boolean
  className?: string
}

export const GuessRow: React.FC<GuessRowProps> = ({
  guessResult,
  isCurrentGuess = false,
  className = ''
}) => {
  const { guess, feedback } = guessResult

  return (
    <div className={`${styles.guessRow} ${isCurrentGuess ? styles.current : ''} ${className}`}>
      <div className={styles.guessPegs}>
        {guess.map((color, index) => (
          <Peg
            key={index}
            color={color}
            ariaLabel={`Position ${index + 1}: ${color}`}
          />
        ))}
      </div>
      <FeedbackPegs feedback={feedback} />
    </div>
  )
}