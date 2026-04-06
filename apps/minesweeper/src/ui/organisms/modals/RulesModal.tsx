import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './RulesModal.module.css'

export interface RulesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Keyboard handlers: ESC to close
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Focus management: trap focus in modal, restore on close
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    const previouslyFocused = document.activeElement as HTMLElement

    // Focus the close button
    const closeBtn = modalRef.current.querySelector('button[aria-label="Close rules"]') as HTMLButtonElement
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 50)
    }

    return () => {
      // Restore focus to previous element (trigger button)
      if (previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-title"
      className={styles.modal}
    >
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 id="rules-title">Minesweeper Rules</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close rules"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <section>
            <h3>Objective</h3>
            <p>
              Clear all safe squares on the board without hitting any mines. Uncover the entire
              board correctly to win.
            </p>
          </section>

          <section>
            <h3>The Board</h3>
            <p>
              The game board consists of a grid of squares. Some squares contain mines, others are
              safe. You must deduce which squares are safe and which contain mines.
            </p>
          </section>

          <section>
            <h3>Revealing Squares</h3>
            <p>
              Click or press Enter on a square to reveal it. If it's safe, it shows the number of
              mines in adjacent squares (0-8). If it's a mine, you lose. Squares with 0 adjacent
              mines are automatically revealed with their neighbors.
            </p>
          </section>

          <section>
            <h3>Flagging Mines</h3>
            <p>
              Press F or right-click to flag a square you believe contains a mine. Flagging helps
              you remember dangerous squares. The mine counter shows how many unflagged mines
              remain.
            </p>
          </section>

          <section>
            <h3>Winning</h3>
            <p>
              Clear all safe squares without hitting a mine. You can also use the "Done Check"
              button (press X) to verify your board is solved correctly. Reveal all non-mine squares
              or flag all mines to win.
            </p>
          </section>
        </div>

        <div className={styles.footer}>
          <button type="button" onClick={onClose} className={styles.okBtn}>
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
