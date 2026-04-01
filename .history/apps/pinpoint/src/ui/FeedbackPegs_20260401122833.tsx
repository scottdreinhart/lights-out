import React from 'react'
import type { Feedback } from '@/domain'
import { FEEDBACK_PEG_SIZE } from '@/domain'
import styles from './FeedbackPegs.module.css'

interface FeedbackPegsProps {
  feedback: Feedback
  className?: string
}

export const FeedbackPegs: React.FC<FeedbackPegsProps> = ({
  feedback,
  className = ''
}) => {
  const { correctPosition, correctColor } = feedback
  const totalFeedback = correctPosition + correctColor

  // Create array of feedback pegs
  const pegs = []

  // Add black pegs (correct position)
  for (let i = 0; i < correctPosition; i++) {
    pegs.push({ type: 'correct-position', key: `black-${i}` })
  }

  // Add white pegs (correct color)
  for (let i = 0; i < correctColor; i++) {
    pegs.push({ type: 'correct-color', key: `white-${i}` })
  }

  // Fill remaining slots with empty pegs
  const maxFeedbackSlots = 4 // Standard Mastermind has 4 feedback pegs
  while (pegs.length < maxFeedbackSlots) {
    pegs.push({ type: 'empty', key: `empty-${pegs.length}` })
  }

  return (
    <div
      className={`${styles.feedbackPegs} ${className}`}
      role="group"
      aria-label={`Feedback: ${correctPosition} correct position, ${correctColor} correct color`}
    >
      {pegs.map(({ type, key }) => (
        <div
          key={key}
          className={`${styles.feedbackPeg} ${styles[type]}`}
          style={{
            width: FEEDBACK_PEG_SIZE,
            height: FEEDBACK_PEG_SIZE,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}