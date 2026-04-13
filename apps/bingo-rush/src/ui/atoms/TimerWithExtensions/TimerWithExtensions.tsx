import { useGlobalTimer } from '@/app'

import styles from './TimerWithExtensions.module.css'

interface TimerWithExtensionsProps {
  className?: string
}

const TimerWithExtensions: React.FC<TimerWithExtensionsProps> = ({ className }) => {
  const { timeRemaining, isRunning, canExtend, extensionsRemaining } = useGlobalTimer()

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getUrgencyClass = (): string => {
    if (timeRemaining <= 10) return styles.critical
    if (timeRemaining <= 30) return styles.warning
    return styles.normal
  }

  return (
    <div
      className={`${styles.root} ${className || ''}`}
      role="timer"
      aria-label="Game timer with extensions"
    >
      <div className={styles.timerSection}>
        <div className={styles.icon}>⏱️</div>
        <div className={`${styles.time} ${getUrgencyClass()}`}>{formatTime(timeRemaining)}</div>
        <div className={styles.status}>{isRunning ? 'Running' : 'Paused'}</div>
      </div>

      <div className={styles.extensionSection}>
        <div className={styles.extensionIndicator}>
          {Array.from({ length: extensionsRemaining }, (_, i) => (
            <div
              key={i}
              className={styles.extensionDot}
              aria-label={`Extension ${i + 1} available`}
            />
          ))}
        </div>
        {canExtend && extensionsRemaining > 0 && (
          <div className={styles.extendHint}>Press SPACE to extend</div>
        )}
      </div>
    </div>
  )
}

export default TimerWithExtensions
