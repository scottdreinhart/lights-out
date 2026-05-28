import { useMemo, useState } from 'react'
import styles from './HamburgerMenu.module.css'

/**
 * Menu action configuration
 */
export interface MenuAction {
  label: string
  onSelect: () => void
}

/**
 * Props for HamburgerMenu component
 */
export interface HamburgerMenuProps {
  /** Array of menu actions */
  actions: MenuAction[]
  /** ARIA label for the menu button */
  ariaLabel?: string
}

/**
 * HamburgerMenu — Reusable hamburger menu component
 *
 * Provides a dropdown menu with customizable actions.
 * Uses ARIA attributes for accessibility.
 *
 * @example
 * ```tsx
 * <HamburgerMenu
 *   actions={[
 *     { label: 'Settings', onSelect: () => setShowSettings(true) },
 *     { label: 'About', onSelect: () => setShowAbout(true) },
 *   ]}
 *   ariaLabel="Game menu"
 * />
 * ```
 */
export function HamburgerMenu({ actions, ariaLabel = 'Open menu' }: HamburgerMenuProps) {
  const [open, setOpen] = useState(false)
  const validActions = useMemo(() => actions.filter((a) => a.label.trim().length > 0), [actions])

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.button}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={open ? 'Close menu' : ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={styles.line} />
        <span className={styles.line} />
        <span className={styles.line} />
      </button>

      {open ? (
        <div className={styles.panel} role="menu" aria-label="Game menu">
          {validActions.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              className={styles.item}
              onClick={() => {
                action.onSelect()
                setOpen(false)
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default HamburgerMenu
