import { usePowerUpManager } from '@/app'
import React from 'react'
import styles from './ProgressToNextPowerUp.module.css'

interface ProgressToNextPowerUpProps {
  className?: string
}

const ProgressToNextPowerUp: React.FC<ProgressToNextPowerUpProps> = ({ className }) => {
  const { progressToNextPowerUp, nextPowerUpType } = usePowerUpManager()

  const progressPercentage = Math.min(100, (progressToNextPowerUp / 100) * 100)

  const getPowerUpName = () => {
    switch (nextPowerUpType) {
      case 'AUTO_MARK':
        return 'Auto Mark'
      case 'INSTANT_PATTERN':
        return 'Instant Pattern'
      case 'DOUBLE_POINTS':
        return 'Double Points'
      case 'SHIELD':
        return 'Shield'
      case 'TIME_EXTEND':
        return 'Time Extend'
      default:
        return 'Next Power-Up'
    }
  }

  const getPowerUpIcon = () => {
    switch (nextPowerUpType) {
      case 'AUTO_MARK':
        return '🎯'
      case 'INSTANT_PATTERN':
        return '✨'
      case 'DOUBLE_POINTS':
        return '💰'
      case 'SHIELD':
        return '🛡️'
      case 'TIME_EXTEND':
        return '⏰'
      default:
        return '⚡'
    }
  }

  return (
    <div className={`${styles.root} ${className || ''}`}>
      <div className={styles.header}>
        <span className={styles.icon}>{getPowerUpIcon()}</span>
        <span className={styles.title}>Next Power-Up</span>
      </div>

      <div className={styles.powerUpName}>{getPowerUpName()}</div>

      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }} />
        </div>
        <div className={styles.progressText}>{progressToNextPowerUp}/100</div>
      </div>
    </div>
  )
}

export default ProgressToNextPowerUp
