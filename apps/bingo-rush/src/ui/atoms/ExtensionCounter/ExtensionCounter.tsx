import { useGlobalTimer } from '@/app'

import styles from './ExtensionCounter.module.css'

interface ExtensionCounterProps {
  className?: string
}

const ExtensionCounter: React.FC<ExtensionCounterProps> = ({ className }) => {
  const { extensionsGranted, extensionsRemaining, maxExtensions } = useGlobalTimer()

  return (
    <div className={`${styles.root} ${className || ''}`} role="status" aria-label="Time extensions">
      <div className={styles.icon}>⏰</div>
      <div className={styles.content}>
        <div className={styles.label}>Extensions</div>
        <div className={styles.count}>
          <span className={styles.used}>{extensionsGranted}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.total}>{maxExtensions}</span>
        </div>
        <div className={styles.remaining}>{extensionsRemaining} remaining</div>
      </div>
    </div>
  )
}

export default ExtensionCounter
