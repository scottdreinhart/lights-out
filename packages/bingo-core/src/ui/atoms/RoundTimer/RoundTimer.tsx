import { useRoundTimer } from '@games/bingo-core/app'
import React, { useMemo } from 'react'
import styles from './RoundTimer.module.css'

interface TimerDisplayViewProps {
  className?: string
  label?: string
  value: string
  status: 'idle' | 'running' | 'expired'
}

const TimerDisplayView: React.FC<TimerDisplayViewProps> = ({ className, label, value, status }) => {
  return (
    <div
      className={`${styles.root} ${className || ''} ${status === 'expired' ? styles.expired : ''} ${status === 'running' ? styles.running : ''}`}
    >
      {label ? <span className={styles.label}>{label}:</span> : null}
      <span className={styles.time}>{value}</span>
    </div>
  )
}

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

  const status = isExpired ? 'expired' : isRunning ? 'running' : 'idle'

  return (
    <TimerDisplayView
      className={className}
      label={showLabel ? 'Time' : undefined}
      value={formattedTime}
      status={status}
    />
  )
}
