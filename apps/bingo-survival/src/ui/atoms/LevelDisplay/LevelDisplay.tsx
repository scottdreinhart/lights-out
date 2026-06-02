import { useLevelProgression } from '@/app'

import styles from './LevelDisplay.module.css'

interface LevelDisplayProps {
  className?: string
  showPhase?: boolean
}

export const LevelDisplay: React.FC<LevelDisplayProps> = ({ className, showPhase = true }) => {
  const { currentLevel, totalLevels, phaseLabel } = useLevelProgression()

  // Simple responsive classes based on window width
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 900
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600

  return (
    <div
      className={`${styles.root} ${className || ''}`}
      style={{
        padding: isMobile ? '8px 12px' : isDesktop ? '12px 20px' : '10px 16px',
      }}
    >
      <div className={styles.level}>
        <span className={styles.levelNumber}>{currentLevel}</span>
        <span className={styles.levelTotal}>/{totalLevels}</span>
      </div>
      {showPhase && <div className={styles.phase}>{phaseLabel}</div>}
    </div>
  )
}
