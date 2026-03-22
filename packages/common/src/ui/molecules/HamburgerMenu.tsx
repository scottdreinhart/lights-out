import React, { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useDropdownBehavior } from '@games/app-hook-utils'
import styles from './HamburgerMenu.module.css'

interface HamburgerMenuProps {
  /** Menu content (buttons, links, etc.) */
  children: React.ReactNode
  /** Optional custom aria-label for menu panel */
  ariaLabel?: string
  /** Optional custom aria-controls ID */
  panelId?: string
}

/**
 * Generic HamburgerMenu — Portal-based dropdown with semantic accessibility
 *
 * Provides:
 * - Portal rendering above all content (z-index: 9999+)
 * - Dropdown behavior: ESC to close, outside-click to close, focus trap
 * - Animated hamburger icon: 3-line → X transformation
 * - Responsive touch-safe design
 *
 * Usage:
 * ```
 * <HamburgerMenu>
 *   <button onClick={...}>Option 1</button>
 *   <button onClick={...}>Option 2</button>
 * </HamburgerMenu>
 * ```
 *
 * CSS Variables:
 * - --menu-bg: Background color (default: #1a1a2e)
 * - --menu-border: Border color (default: rgba(255, 255, 255, 0.1))
 * - --text: Text color (default: #e0e0e0)
 */
export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  children,
  ariaLabel = 'Game settings',
  panelId = 'hamburger-menu-panel',
}) => {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((prev) => !prev), [])

  // Manage dropdown behavior: ESC key, outside click, focus trap
  useDropdownBehavior({
    open,
    onClose: close,
    triggerRef: btnRef,
    panelRef,
  })

  return (
    <div className={styles.root}>
      <button
        ref={btnRef}
        type="button"
        className={styles.menuButton}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        title="Settings menu"
        onClick={toggle}
      >
        {/* 3-line hamburger icon that animates to X */}
        <span className={`${styles.line} ${open ? styles.lineOpen : ''}`} />
        <span className={`${styles.line} ${open ? styles.lineOpen : ''}`} />
        <span className={`${styles.line} ${open ? styles.lineOpen : ''}`} />
      </button>

      {open &&
        createPortal(
          <>
            {/* Backdrop for click-outside detection */}
            <div className={styles.backdrop} aria-hidden="true" onClick={close} />

            {/* Menu panel with dropdown content */}
            <div
              ref={panelRef}
              id={panelId}
              className={styles.menu}
              role="menu"
              aria-label={ariaLabel}
            >
              <div className={styles.panelContent}>{children}</div>
            </div>
          </>,
          document.body
        )}
    </div>
  )
}

export default HamburgerMenu
