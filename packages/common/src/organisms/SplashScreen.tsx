import { useEffect, useState } from 'react'
import styles from './SplashScreen.module.css'

export interface SplashScreenProps {
  readonly onComplete: () => void
  readonly minimumDuration?: number
  readonly title?: string
  readonly children?: React.ReactNode
  readonly onHowToPlay?: () => void
  readonly onLetsPlay?: () => void
  readonly className?: string
}

/**
 * Generic splash screen component with optional action buttons.
 *
 * STANDARD MODE (original behavior):
 * - Displays game title and optional content for minimumDuration
 * - Auto-fades and calls onComplete
 * - Use when onHowToPlay and onLetsPlay are undefined
 *
 * INTERACTIVE MODE (new):
 * - Shows "How to Play" and "Let's Play" buttons
 * - Disables auto-dismiss (user must click)
 * - onHowToPlay → navigate to rules/help
 * - onLetsPlay → start playing (go to game board)
 * - Use when providing onHowToPlay and/or onLetsPlay handlers
 *
 * Supports custom content (logo, animation, etc.) via children prop.
 * Common across multiple games (Battleship, Checkers, TicTacToe, etc.).
 */
export function SplashScreen({
  onComplete,
  minimumDuration = 1500,
  title,
  children,
  onHowToPlay,
  onLetsPlay,
  className,
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [canDismiss, setCanDismiss] = useState(false)
  const hasButtons = Boolean(onHowToPlay || onLetsPlay)

  // Standard auto-dismiss behavior when no buttons provided
  useEffect(() => {
    if (hasButtons) return // Skip auto-dismiss when buttons are present

    const timer = setTimeout(() => {
      setCanDismiss(true)
    }, minimumDuration)

    return () => clearTimeout(timer)
  }, [minimumDuration, hasButtons])

  useEffect(() => {
    if (!canDismiss) return

    setIsVisible(false)

    // Wait for fade-out animation to complete before calling onComplete
    const fadeTimer = setTimeout(onComplete, 500)
    return () => clearTimeout(fadeTimer)
  }, [canDismiss, onComplete])

  if (!isVisible) {
    return null
  }

  return (
    <div className={`${styles.splash} ${hasButtons ? styles.interactive : ''} ${className || ''}`}>
      <div className={styles.content}>
        {children}
        {title && <h1 className={styles.title}>{title}</h1>}

        {/* Action buttons (shown when interactive mode is enabled) */}
        {hasButtons && (
          <div className={styles.buttonGroup} role="group" aria-label="Game actions">
            {onHowToPlay && (
              <button
                className={styles.buttonSecondary}
                onClick={onHowToPlay}
                type="button"
                aria-label="Open how to play rules"
              >
                How to Play
              </button>
            )}
            {onLetsPlay && (
              <button
                className={styles.buttonPrimary}
                onClick={onLetsPlay}
                type="button"
                aria-label="Start playing the game"
              >
                Let's Play
              </button>
            )}
          </div>
        )}

        {/* Accessibility hint for standard mode */}
        {!hasButtons && <p className={styles.hint}>Loading your game...</p>}
      </div>
    </div>
  )
}
