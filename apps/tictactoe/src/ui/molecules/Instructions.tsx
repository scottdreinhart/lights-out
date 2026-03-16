import React, { useCallback, useRef, useState } from 'react'

import useDropdownBehavior from '../../app/useDropdownBehavior.ts'
import { cx } from '../utils/cssModules.ts'
import styles from './Instructions.module.css'

type Placement = 'above' | 'below' | 'left' | 'right'

/**
 * Measure available space around the button and pick the best direction.
 */
const bestPlacement = (btnRect: DOMRect): Placement => {
  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight

  const above = btnRect.top
  const below = vh - btnRect.bottom
  const { left } = btnRect
  const right = vw - btnRect.right

  const max = Math.max(above, below, left, right)

  if (max === below) {
    return 'below'
  }
  if (max === above) {
    return 'above'
  }
  if (max === right) {
    return 'right'
  }
  return 'left'
}

const Instructions: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<Placement>('below')
  const btnRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const toggle = useCallback(() => {
    if (!open && btnRef.current) {
      setPlacement(bestPlacement(btnRef.current.getBoundingClientRect()))
    }
    setOpen((prev) => !prev)
  }, [open])

  // Close on outside click / touch / Escape + focus restoration
  useDropdownBehavior({
    open,
    onClose: () => setOpen(false),
    triggerRef: btnRef,
    panelRef: tooltipRef,
  })

  return (
    <div className={styles.wrapper}>
      <button
        ref={btnRef}
        className={styles.btn}
        onClick={toggle}
        aria-label="How to play"
        aria-expanded={open}
        type="button"
      >
        &#9432; {/* ⓘ info circle */}
      </button>

      {open && (
        <div ref={tooltipRef} className={cx(styles.tooltip, styles[placement])} role="tooltip">
          <h3 className={styles.title}>How to Play</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              You are <strong>X</strong>, the CPU is <strong>O</strong>
            </li>
            <li className={styles.listItem}>You move first</li>
            <li className={styles.listItem}>
              <strong>Click</strong> a cell, or use <strong>Arrow Keys / WASD</strong> to navigate
              and <strong>Space/Enter</strong> to select
            </li>
            <li className={styles.listItem}>First to get 3 in a row wins!</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Instructions
