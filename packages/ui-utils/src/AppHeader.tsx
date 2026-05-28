import { useMemo } from 'react'
import styles from './FeatureShell.module.css'
import { HamburgerMenu, type MenuAction } from './HamburgerMenu'

/**
 * Props for AppHeader component
 */
export interface AppHeaderProps {
  /** Title displayed in the header */
  title: string
  /** Callback when "How to Play" is selected */
  onOpenRules: () => void
  /** Callback when "Settings" is selected */
  onOpenSettings: () => void
  /** Callback when "About" is selected */
  onOpenAbout: () => void
}

/**
 * AppHeader — Standard app header with title and hamburger menu
 *
 * Provides consistent header layout and menu actions across all game apps.
 * Reuses FeatureShell styling and HamburgerMenu for consistent UX.
 *
 * @example
 * ```tsx
 * <AppHeader
 *   title="Bingo"
 *   onOpenRules={() => setShowRules(true)}
 *   onOpenSettings={() => setShowSettings(true)}
 *   onOpenAbout={() => setShowAbout(true)}
 * />
 * ```
 */
export function AppHeader({ title, onOpenRules, onOpenSettings, onOpenAbout }: AppHeaderProps) {
  const actions = useMemo<MenuAction[]>(
    () => [
      { label: 'How to Play', onSelect: onOpenRules },
      { label: 'Settings', onSelect: onOpenSettings },
      { label: 'About', onSelect: onOpenAbout },
    ],
    [onOpenAbout, onOpenRules, onOpenSettings],
  )

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <HamburgerMenu actions={actions} />
    </header>
  )
}

export default AppHeader
