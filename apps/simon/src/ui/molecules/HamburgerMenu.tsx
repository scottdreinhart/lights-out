import { useDropdownBehavior } from '@games/assets-shared'
import type { ReactNode } from 'react'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './HamburgerMenu.module.css'

interface PanelPosition {
  top: number
  left: number
}

interface HamburgerMenuProps {
  children: ReactNode
  ariaLabel?: string
  panelId?: string
}

export function HamburgerMenu({
  children,
  ariaLabel = 'Simon settings',
  panelId = 'simon-menu-panel',
}: HamburgerMenuProps) {
  const [open, setOpen] = useState(false)
  const [panelPos, setPanelPos] = useState<PanelPosition | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!open || !btnRef.current) {
      return
    }

    const triggerRect = btnRef.current.getBoundingClientRect()
    const board = document.getElementById('game-board')
    const boardRect = board
      ? board.getBoundingClientRect()
      : { left: 8, right: window.innerWidth - 8 }

    const panelWidth = window.innerWidth < 600 ? 220 : 240
    const viewportPadding = 8
    let left = boardRect.right - panelWidth

    if (left < boardRect.left + viewportPadding) {
      left = boardRect.left + viewportPadding
    }

    if (left + panelWidth > window.innerWidth - viewportPadding) {
      left = window.innerWidth - panelWidth - viewportPadding
    }

    setPanelPos({ top: triggerRect.bottom + 8, left })
  }, [open])

  const toggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  useDropdownBehavior({
    open,
    onClose: () => setOpen(false),
    triggerRef: btnRef,
    panelRef,
  })

  return (
    <div className={styles.root}>
      <button
        ref={btnRef}
        type="button"
        className={styles.button}
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close menu' : 'Open menu'}
        title="Menu"
      >
        <span className={styles.icon} aria-hidden="true">
          <span className={`${styles.line}${open ? ` ${styles.lineOpen}` : ''}`} />
          <span className={`${styles.line}${open ? ` ${styles.lineOpen}` : ''}`} />
          <span className={`${styles.line}${open ? ` ${styles.lineOpen}` : ''}`} />
        </span>
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            id={panelId}
            className={styles.panel}
            role="menu"
            aria-label={ariaLabel}
            style={
              panelPos
                ? { top: panelPos.top, left: panelPos.left }
                : { visibility: 'hidden' as const }
            }
          >
            {children}
          </div>,
          document.body,
        )}
    </div>
  )
}
