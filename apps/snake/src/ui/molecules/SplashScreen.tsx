/**
 * SplashScreen — animated snake logo intro
 * Shows animated snake SVG + title, then fades out to menu.
 */

import { SplashScreen as SharedSplashScreen } from '@games/common'
import styles from './Overlay.module.css'

interface SplashScreenProps {
  onComplete: () => void
}

const SNAKE_BODY = [
  { x: 50, y: 50 },
  { x: 46, y: 50 },
  { x: 42, y: 50 },
  { x: 38, y: 50 },
  { x: 34, y: 50 },
  { x: 30, y: 52 },
  { x: 26, y: 55 },
  { x: 22, y: 52 },
  { x: 18, y: 50 },
  { x: 14, y: 50 },
]

export function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <SharedSplashScreen
      onComplete={onComplete}
      minimumDuration={2800}
      title="SNAKE"
      className={styles.snakeSplash}
    >
      <div className={styles.splashLogo}>
        <svg
          viewBox="0 0 64 64"
          width="120"
          height="120"
          className={styles.splashSnake}
          aria-hidden="true"
        >
          {SNAKE_BODY.map((seg, i) => (
            <circle
              key={i}
              cx={seg.x}
              cy={seg.y}
              r={i === 0 ? 4 : 3.2}
              fill={i === 0 ? 'var(--player-head, #00ff88)' : 'var(--player-body, #00cc66)'}
              opacity={1 - i * 0.07}
              className={styles.splashSegment}
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
          {/* Eyes on head */}
          <circle cx={52} cy={48.5} r={1} fill="#000" />
          <circle cx={52} cy={51.5} r={1} fill="#000" />
        </svg>
      </div>
      <p className={styles.splashTagline}>Snake + Tron Light Cycle Arcade</p>
    </SharedSplashScreen>
  )
}
