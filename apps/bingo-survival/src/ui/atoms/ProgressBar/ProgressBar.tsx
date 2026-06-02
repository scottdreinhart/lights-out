import { useLevelProgression } from '@/app'
import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  className?: string
  showPercentage?: boolean
  height?: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  className,
  showPercentage = true,
  height = 8,
}) => {
  const { progressPercentage } = useLevelProgression()

  // Simple responsive classes based on window width
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 900
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600

  return (
    <div
      className={`${styles.root} ${className || ''}`}
      style={{
        height: isMobile ? height * 0.8 : isDesktop ? height * 1.2 : height,
      }}
    >
      <div
        className={styles.fill}
        style={{
          width: `${Math.min(100, Math.max(0, progressPercentage))}%`,
        }}
      />
      {showPercentage && <div className={styles.percentage}>{Math.round(progressPercentage)}%</div>}
    </div>
  )
}
