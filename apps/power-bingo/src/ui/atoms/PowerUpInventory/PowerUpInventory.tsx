import React from 'react'
import { PowerUpSlot } from '../PowerUpSlot'
import styles from './PowerUpInventory.module.css'

interface PowerUpInventoryProps {
  onPowerUpActivated?: (powerUpType: string) => void
  className?: string
}

const PowerUpInventory: React.FC<PowerUpInventoryProps> = ({ onPowerUpActivated, className }) => {
  const powerUpTypes: Array<
    'AUTO_MARK' | 'INSTANT_PATTERN' | 'DOUBLE_POINTS' | 'SHIELD' | 'TIME_EXTEND'
  > = ['AUTO_MARK', 'INSTANT_PATTERN', 'DOUBLE_POINTS', 'SHIELD', 'TIME_EXTEND']

  const handlePowerUpActivate = (powerUpType: string) => {
    if (onPowerUpActivated) {
      onPowerUpActivated(powerUpType)
    }
  }

  return (
    <div className={`${styles.root} ${className || ''}`}>
      <div className={styles.header}>
        <span className={styles.title}>Power Ups</span>
      </div>

      <div className={styles.grid}>
        {powerUpTypes.map((powerUpType) => (
          <PowerUpSlot
            key={powerUpType}
            powerUpType={powerUpType}
            onActivate={() => handlePowerUpActivate(powerUpType)}
          />
        ))}
      </div>
    </div>
  )
}

export default PowerUpInventory
