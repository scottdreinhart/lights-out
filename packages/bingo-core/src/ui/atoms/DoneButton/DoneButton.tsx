import { useRoundTimer } from '@games/bingo-core/app'
import React, { useCallback } from 'react'
import styles from './DoneButton.module.css'

interface DoneButtonProps {
  className?: string
  onComplete?: () => void
}

export const DoneButton: React.FC<DoneButtonProps> = ({ className, onComplete }) => {
  const { signalCompletion, isRunning, bonusMultiplier, timeRemaining } = useRoundTimer()

  const handleComplete = useCallback(() => {
    signalCompletion()
    onComplete?.()
  }, [signalCompletion, onComplete])

  const canComplete = isRunning && timeRemaining > 0
  const bonusText = bonusMultiplier > 1 ? ` (${bonusMultiplier}x bonus)` : ''

  // Simple responsive classes based on window width
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 900
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600

  return (
    <button
      className={`${styles.root} ${className || ''}`}
      onClick={handleComplete}
      disabled={!canComplete}
      aria-label={`Complete round${bonusText}`}
      style={{
        padding: isMobile ? '12px 20px' : isDesktop ? '16px 32px' : '14px 24px',
        fontSize: isMobile ? '14px' : isDesktop ? '18px' : '16px',
      }}
    >
      <span className={styles.text}>Done{bonusText}</span>
      {bonusMultiplier > 1 && <span className={styles.bonusIcon}>⭐</span>}
    </button>
  )
}
