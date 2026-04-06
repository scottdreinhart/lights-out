import React, { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useDropdownBehavior } from '@games/app-hook-utils'
import styles from './HamburgerMenu.module.css'

export interface MenuItem {
  /** Display label for the menu item */
  label: string
  /** Optional icon/emoji to display before label */
  icon?: React.ReactNode
  /** Action to execute when item is clicked */
  action: () => void
  /** Optional: disable this menu item */
  disabled?: boolean
}

interface HamburgerMenuProps {
  /** Pattern 1: Custom menu content (children-based) — for flexible layouts */
  children?: React.ReactNode

  /** Pattern 2: Menu items with actions (items-based) — for callback-driven menus */
  items?: MenuItem[]

  /** Optional custom aria-label for menu panel */
  ariaLabel?: string
  /** Optional custom aria-controls ID */
  panelId?: string
}

/**
 * Flexible HamburgerMenu — Portal-based dropdown with semantic accessibility
 *
 * Supports TWO usage patterns:
 *
 * **Pattern 1: Children-based (flexible, custom content)**
 * ```
 * <HamburgerMenu>
 *   <button onClick={...}>Option 1</button>
 *   <button onClick={...}>Option 2</button>
 * </HamburgerMenu>
 * ```
 *
 * **Pattern 2: Items-based (callback-driven)**
 * ```
 * <HamburgerMenu
 *   items={[
 *     { label: 'Settings', icon: '⚙️', action: () => {...} },
 *     { label: 'New Game', action: () => {...} },
 *   ]}
 * />
 * ```
 *
 * Provides:
 * - Portal rendering above all content (z-index: 9999+)
 * - Dropdown behavior: ESC to close, outside-click to close, focus trap
 * - Animated hamburger icon: 3-line → X transformation
 * - Responsive touch-safe design
 * - Supports both flexible (children) and callback-driven (items) patterns
 *
 * CSS Variables:
 * - --menu-bg: Background color (default: #1a1a2e)
 * - --menu-border: Border color (default: rgba(255, 255, 255, 0.1))
 * - --text: Text color (default: #e0e0e0)
 */
export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  children,
  items,
  ariaLabel = 'Game settings',
  panelId = 'hamburger-menu-panel',
}) => {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((prev) => !prev), [])

  // Handle menu item clicks (items-based pattern)
  const handleItemClick = useCallback(
    (action: () => void) => {
      action()
      close()
    },
    [close],
  )

  // Manage dropdown behavior: ESC key, outside click, focus trap
  useDropdownBehavior({
    open,
    onClose: close,
    triggerRef: btnRef,
    panelRef,
  })

  // Determine what to render in the menu
  const menuContent = items ? (
    // Pattern 2: Items-based (callback-driven)
    <div className={styles.menuItems}>
      {items.map((item, idx) => (
        <button
          key={idx}
          type="button"
          className={styles.menuItem}
          onClick={() => handleItemClick(item.action)}
          disabled={item.disabled}
          role="menuitem"
        >
          {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
          <span className={styles.itemLabel}>{item.label}</span>
        </button>
      ))}
    </div>
  ) : (
    // Pattern 1: Children-based (flexible, custom content)
    children
  )

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
              <div className={styles.panelContent}>{menuContent}</div>
            </div>
          </>,
          document.body,
        )}
    </div>
  )
}

export default HamburgerMenu
