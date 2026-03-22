import React, { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useDropdownBehavior } from '@games/assets-shared'
import styles from './HamburgerMenu.module.css'

interface HamburgerMenuProps {
  children: React.ReactNode
}

export function HamburgerMenu({ children }: HamburgerMenuProps) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((prev) => !prev), [])

  // Use reusable dropdown behavior hook for ESC, outside-click, focus management
  useDropdownBehavior({
    open,
    onClose: close,
    triggerRef: btnRef,
    panelRef,
  })

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={styles.menuButton}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="lights-out-menu-panel"
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

            {/* Menu panel with focus trap */}
            <div
              ref={panelRef}
              id="lights-out-menu-panel"
              className={styles.menu}
              role="menu"
              aria-label="Game settings"
            >
              <div className={styles.panelContent}>
                {/* Close button (optional; backdrop + ESC close the menu) */}
                <div className={styles.closeRow}>
                  <button
                    type="button"
                    className={styles.closeButton}
                    aria-label="Close menu"
                    title="Close menu"
                    onClick={close}
                  >
                    ✕
                  </button>
                </div>

                {children}
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  )
}
