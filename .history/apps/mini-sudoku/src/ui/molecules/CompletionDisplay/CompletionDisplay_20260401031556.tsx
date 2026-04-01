import React from 'react'
import styles from './CompletionDisplay.module.css'

interface CompletionDisplayProps {
  isComplete: boolean
  elapsedTime: number
}

export const CompletionDisplay: React.FC<CompletionDisplayProps> = ({
  isComplete,
  elapsedTime
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  if (!isComplete) {
    return null
  }

  return (
    <div className={styles.completion}>
      <div className={styles.completionMessage}>🎉 Puzzle Complete!</div>
      <span className={styles.completionTime}>{formatTime(elapsedTime)}</span>
    </div>
  )
}