import { SplashScreen as SharedSplashScreen } from '@games/common'
import styles from './SplashScreen.module.css'

interface SplashProps {
  readonly onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashProps) {
  return (
    <SharedSplashScreen onComplete={onComplete} title="MANCALA">
      <div className={styles.logo}>
        {/* Animated Mancala board logo */}
        <div className={styles.board}>
          {/* Top row (opponent) */}
          <div className={`${styles.pit} ${styles.pit1}`} />
          <div className={`${styles.pit} ${styles.pit2}`} />
          <div className={`${styles.pit} ${styles.pit3}`} />
          <div className={`${styles.pit} ${styles.pit4}`} />
          <div className={`${styles.pit} ${styles.pit5}`} />
          <div className={`${styles.pit} ${styles.pit6}`} />
        </div>
        <div className={styles.board}>
          {/* Bottom row (player) */}
          <div className={`${styles.pit} ${styles.pit7}`} />
          <div className={`${styles.pit} ${styles.pit8}`} />
          <div className={`${styles.pit} ${styles.pit9}`} />
          <div className={`${styles.pit} ${styles.pit10}`} />
          <div className={`${styles.pit} ${styles.pit11}`} />
          <div className={`${styles.pit} ${styles.pit12}`} />
        </div>
      </div>
    </SharedSplashScreen>
  )
}
