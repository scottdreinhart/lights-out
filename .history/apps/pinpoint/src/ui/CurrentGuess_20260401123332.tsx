import React from 'react'
import type { Guess } from '@/domain'
import { Peg } from './Peg'
import styles from './CurrentGuess.module.css'

interface CurrentGuessProps {
  guess: Guess
  codeLength: number
  onPegRemove: (index: number) => void
  className?: string
}

export const CurrentGuess: React.FC<CurrentGuessProps> = ({
  guess,
  codeLength,
  onPegRemove,
  className = ''
}) => {
  const handlePegClick = (index: number) => {
    onPegRemove(index)
  }

  return (
    <div
      className={`${styles.currentGuess} ${className}`}
      role="group"
      aria-label="Current guess being built"
    >
      {Array.from({ length: codeLength }, (_, index) => {
        const color = guess[index] || null
        return (
          <Peg
            key={index}
            color={color}
            onClick={color ? () => handlePegClick(index) : undefined}
            ariaLabel={color ? `Remove ${color} peg at position ${index + 1}` : `Empty slot ${index + 1}`}
          />
        )
      })}
    </div>
  )
}