import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import companyLogo from '../assets/company-logo.png'
import { GameLogo } from '../ui/atoms/GameLogo'
import styles from './SplashScreen.module.css'

const DEFAULT_SPLASH_DURATION = 90000
const LOGO_PHASE_RATIO = 1 / 3
const TITLE_PHASE_RATIO = 1 / 2

export interface SplashScreenProps {
  readonly onComplete: () => void
  readonly onFadeStart?: () => void
  readonly minimumDuration?: number
  readonly title?: string
  readonly children?: ReactNode
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
 * Supports custom logo content via children prop and stages the title reveal
 * so all games share a logo → title → fade transition.
 * Common across multiple games (Battleship, Checkers, TicTacToe, etc.).
 */
export function SplashScreen({
  onComplete,
  onFadeStart,
  minimumDuration = DEFAULT_SPLASH_DURATION,
  title,
  children,
  onHowToPlay,
  onLetsPlay,
  className,
}: SplashScreenProps) {
  const hasButtons = Boolean(onHowToPlay || onLetsPlay)
  const resolvedTitle = title ?? getFallbackTitle()
  const logoMark = children ?? <img src={companyLogo} alt="Company logo" className={styles.logoImage} />
  const { canDismiss, isVisible, phase } = useSplashScreenSequence({
    hasButtons,
    onFadeStart,
    minimumDuration,
    onComplete,
  })
  return (
    <SplashScreenView
      className={className}
      canDismiss={canDismiss}
      fadeDuration={getFadeDuration(minimumDuration)}
      hasButtons={hasButtons}
      isVisible={isVisible}
      logoMark={logoMark}
      onHowToPlay={onHowToPlay}
      onLetsPlay={onLetsPlay}
      phase={phase}
      resolvedTitle={resolvedTitle}
    />
  )
}

interface SplashScreenViewProps {
  readonly canDismiss: boolean
  readonly className?: string
  readonly fadeDuration: number
  readonly hasButtons: boolean
  readonly isVisible: boolean
  readonly logoMark: ReactNode
  readonly onHowToPlay?: () => void
  readonly onLetsPlay?: () => void
  readonly phase: 'logo' | 'title'
  readonly resolvedTitle: string
}

function SplashScreenView({
  canDismiss,
  className,
  fadeDuration,
  hasButtons,
  isVisible,
  logoMark,
  onHowToPlay,
  onLetsPlay,
  phase,
  resolvedTitle,
}: SplashScreenViewProps) {
  const splashStyle: CSSProperties = { animationDuration: `${fadeDuration}ms` }

  if (!isVisible) {
    return null
  }

  return (
    <div style={splashStyle} className={`${styles.splash} ${canDismiss ? styles.exiting : ''} ${hasButtons ? styles.interactive : ''} ${className || ''}`}>
      <div className={styles.content}>
        <SplashLogoStage phase={phase} logoMark={logoMark} resolvedTitle={resolvedTitle} />
        <SplashTitleStage phase={phase} resolvedTitle={resolvedTitle} />
        <SplashActionButtons hasButtons={hasButtons} onHowToPlay={onHowToPlay} onLetsPlay={onLetsPlay} />
      </div>
    </div>
  )
}

interface SplashStageProps {
  readonly phase: 'logo' | 'title'
  readonly resolvedTitle: string
}

function SplashLogoStage({ phase, logoMark, resolvedTitle }: SplashStageProps & { readonly logoMark: ReactNode }) {
  return (
    <div className={getStageClassName(phase, 'logo')} aria-hidden={phase !== 'logo'}>
      <GameLogo title={resolvedTitle} icon={logoMark} className={styles.logo} showTitle={false} pulse />
    </div>
  )
}

function SplashTitleStage({ phase, resolvedTitle }: SplashStageProps) {
  return (
    <div className={getStageClassName(phase, 'title')} aria-hidden={phase !== 'title'}>
      <h1 className={styles.title}>{resolvedTitle}</h1>
    </div>
  )
}

function SplashActionButtons({
  hasButtons,
  onHowToPlay,
  onLetsPlay,
}: {
  readonly hasButtons: boolean
  readonly onHowToPlay?: () => void
  readonly onLetsPlay?: () => void
}) {
  if (!hasButtons) {
    return null
  }

  const actions: Array<{
    readonly ariaLabel: string
    readonly className: string
    readonly key: 'lets-play' | 'rules'
    readonly label: string
    readonly onClick: () => void
  }> = []

  if (onHowToPlay) {
    actions.push({
      key: 'rules',
      ariaLabel: 'Open how to play rules',
      className: styles.buttonSecondary,
      label: 'How to Play',
      onClick: onHowToPlay,
    })
  }

  if (onLetsPlay) {
    actions.push({
      key: 'lets-play',
      ariaLabel: 'Start playing the game',
      className: styles.buttonPrimary,
      label: "Let's Play",
      onClick: onLetsPlay,
    })
  }

  return (
    <div className={styles.buttonGroup} role="group" aria-label="Game actions">
      {actions.map((action) => (
        <button key={action.key} className={action.className} onClick={action.onClick} type="button" aria-label={action.ariaLabel}>
          {action.label}
        </button>
      ))}
    </div>
  )
}

function getStageClassName(phase: 'logo' | 'title', stage: 'logo' | 'title'): string {
  return `${styles.stage} ${phase === stage ? styles.stageVisible : styles.stageHidden}`
}

function getFadeDuration(totalDuration: number): number {
  const logoDuration = Math.max(0, Math.round(totalDuration * LOGO_PHASE_RATIO))
  const titleDuration = Math.max(0, Math.round(totalDuration * TITLE_PHASE_RATIO))
  return Math.max(0, totalDuration - logoDuration - titleDuration)
}

function useSplashScreenSequence({
  hasButtons,
  onFadeStart,
  minimumDuration,
  onComplete,
}: {
  hasButtons: boolean
  onFadeStart?: () => void
  minimumDuration: number
  onComplete: () => void
}): {
  readonly canDismiss: boolean
  readonly isVisible: boolean
  readonly phase: 'logo' | 'title'
} {
  const [isVisible, setIsVisible] = useState(true)
  const [canDismiss, setCanDismiss] = useState(false)
  const [phase, setPhase] = useState<'logo' | 'title'>('logo')
  const logoDuration = Math.max(0, Math.round(minimumDuration * LOGO_PHASE_RATIO))
  const titleDuration = Math.max(0, Math.round(minimumDuration * TITLE_PHASE_RATIO))
  const fadeDuration = Math.max(0, minimumDuration - logoDuration - titleDuration)

  useEffect(() => {
    if (hasButtons) {
      return;
    }

    const titleTimer = setTimeout(() => {
      setPhase('title')
    }, logoDuration)

    return () => clearTimeout(titleTimer)
  }, [hasButtons, logoDuration])

  useEffect(() => {
    if (hasButtons) {
      return;
    }

    const dismissTimer = setTimeout(() => {
      onFadeStart?.()
      setCanDismiss(true)
    }, logoDuration + titleDuration)

    return () => clearTimeout(dismissTimer)
  }, [hasButtons, logoDuration, onFadeStart, titleDuration])

  useEffect(() => {
    if (!canDismiss) {
      return;
    }

    const fadeTimer = setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, fadeDuration)

    return () => clearTimeout(fadeTimer)
  }, [canDismiss, fadeDuration, onComplete])

  return { canDismiss, isVisible, phase }
}

function getFallbackTitle(): string {
  if (typeof document === 'undefined') {
    return 'Loading'
  }

  const titleText = document.title.trim()
  return titleText.length > 0 ? titleText : 'Loading'
}
