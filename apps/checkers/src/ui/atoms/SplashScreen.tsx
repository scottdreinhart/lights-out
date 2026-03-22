import { useEffect, useState } from 'react'

import styles from './SplashScreen.module.css'

export interface SplashScreenProps {
  onComplete: () => void
  minimumDuration?: number
}

export function SplashScreen({ onComplete, minimumDuration = 1200 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)

      // Wait for fade-out animation to complete before calling onComplete
      const fadeTimer = setTimeout(onComplete, 500)
      return () => clearTimeout(fadeTimer)
    }, minimumDuration)

    return () => clearTimeout(timer)
  }, [onComplete, minimumDuration])

  if (!isVisible) {
    return null
  }

  return (
    <div className={styles.splash}>
      <div className={styles.content}>
        <h1 className={styles.title}>CHECKERS</h1>
        <div className={styles.subtitle}>Strategic Board Game</div>
        <div className={styles.loader}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
      </div>
    </div>
  )
}
