import { useStamping } from '@bingo-core/app'
import React, { useCallback } from 'react'
import styles from './StampingModeToggle.module.css'

interface StampingModeToggleProps {
  className?: string
}

export const StampingModeToggle: React.FC<StampingModeToggleProps> = ({ className }) => {
  const { stampingMode, setStampingMode } = useStamping()

  const handleToggle = useCallback(() => {
    setStampingMode(stampingMode === 'auto' ? 'manual' : 'auto')
  }, [stampingMode, setStampingMode])

  // Simple responsive classes based on window width
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 900
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600

  return (
    <button
      className={`${styles.root} ${className || ''}`}
      onClick={handleToggle}
      aria-label={`Toggle stamping mode. Currently ${stampingMode}.`}
      aria-pressed={stampingMode === 'auto'}
      style={{
        padding: isMobile ? '8px 12px' : isDesktop ? '12px 20px' : '10px 16px',
        fontSize: isMobile ? '12px' : isDesktop ? '16px' : '14px',
      }}
    >
      <span className={styles.label}>{stampingMode === 'auto' ? 'Auto' : 'Manual'}</span>
      <span className={styles.indicator} />
    </button>
  )
}
