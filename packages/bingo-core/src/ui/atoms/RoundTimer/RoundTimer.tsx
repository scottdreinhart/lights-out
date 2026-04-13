import { useRoundTimer } from '@bingo-core/app'
import React, { useMemo } from 'react'
import styles from './RoundTimer.module.css'

interface RoundTimerProps {
  className?: string
  showLabel?: boolean
}

export const RoundTimer: React.FC<RoundTimerProps> = ({ className, showLabel = true }) => {
  const { countdownSeconds, isRunning, isExpired } = useRoundTimer()

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(countdownSeconds / 60)
    const seconds = countdownSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, [countdownSeconds])

  // Simple responsive classes based on window width
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 900
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600

  return (
    <div
      className={`${styles.root} ${className || ''} ${isExpired ? styles.expired : ''} ${isRunning ? styles.running : ''}`}
      style={{
        padding: isMobile ? '8px 12px' : isDesktop ? '12px 20px' : '10px 16px',
      }}
    >
      {showLabel && <span className={styles.label}>Time:</span>}
      <span className={styles.time}>{formattedTime}</span>
    </div>
  )
}
