import { usePowerUpManager } from '@/app'
import React from 'react'
import styles from './PowerUpSlot.module.css'

interface PowerUpSlotProps {
  powerUpType: 'AUTO_MARK' | 'INSTANT_PATTERN' | 'DOUBLE_POINTS' | 'SHIELD' | 'TIME_EXTEND'
  onActivate?: () => void
  className?: string
}

const PowerUpSlot: React.FC<PowerUpSlotProps> = ({ powerUpType, onActivate, className }) => {
  const { inventory, activatePowerUp, canActivate } = usePowerUpManager()

  const count = inventory[powerUpType] || 0
  const canUse = canActivate(powerUpType)

  const handleClick = () => {
    if (canUse && onActivate) {
      activatePowerUp(powerUpType)
      onActivate()
    }
  }

  const getIcon = () => {
    switch (powerUpType) {
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
        return '❓'
    }
  }

  const getName = () => {
    switch (powerUpType) {
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
        return 'Unknown'
    }
  }

  return (
    <button
      className={`${styles.root} ${canUse ? styles.available : styles.unavailable} ${className || ''}`}
      onClick={handleClick}
      disabled={!canUse}
      aria-label={`${getName()}: ${count} available`}
      title={`${getName()} (${count} available)`}
    >
      <div className={styles.icon}>{getIcon()}</div>

      <div className={styles.count}>{count}</div>

      <div className={styles.name}>{getName()}</div>
    </button>
  )
}

export default PowerUpSlot
