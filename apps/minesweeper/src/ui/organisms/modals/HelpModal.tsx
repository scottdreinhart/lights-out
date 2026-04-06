import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './HelpModal.module.css'

export interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * HelpModal — Minesweeper Help
 *
 * Displays frequently asked questions and tips for Minesweeper gameplay.
 */
export function HelpModal({ isOpen, onClose }: HelpModalProps) {
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
    const closeBtn = modalRef.current.querySelector('button[aria-label="Close help"]') as HTMLButtonElement
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

  const helpItems = [
    {
      question: 'How do I start playing?',
      answer: (
        <p>
          Click on any square to start. The game reveals numbers showing how many mines are adjacent
          to that square. Use logic to deduce where mines are located.
        </p>
      ),
    },
    {
      question: 'What are the keyboard controls?',
      answer: (
        <p>
          <strong>Arrow Keys / WASD:</strong> Move cursor
          <br />
          <strong>Enter / Click:</strong> Reveal square
          <br />
          <strong>Spacebar / Right-Click:</strong> Flag/unflag mine
          <br />
          <strong>C:</strong> Chord (reveal adjacent squares if flags match mine count)
          <br />
          <strong>X:</strong> Done check (verify board is solved)
          <br />
          <strong>H:</strong> Get hint for safest move
        </p>
      ),
    },
    {
      question: 'What are the difficulty levels?',
      answer: (
        <p>
          <strong>Beginner:</strong> 8×8 board with 10 mines—perfect for learning.
          <br />
          <strong>Intermediate:</strong> 16×16 board with 40 mines—balanced challenge.
          <br />
          <strong>Expert:</strong> 16×30 board with 99 mines—extreme difficulty.
        </p>
      ),
    },
    {
      question: 'What do the numbers mean?',
      answer: (
        <p>
          A number on a square tells you exactly how many mines are in the 8 adjacent squares. Use
          this to deduce safe moves. If a numbered square has all adjacent mines flagged, you can
          safely click its remaining neighbors.
        </p>
      ),
    },
    {
      question: 'What should I do if I get stuck?',
      answer: (
        <p>
          Use the Hint button (or press H) to reveal the safest move. If no safe moves exist, the
          hint will tell you. When completely stuck, the "Done Check" button reveals if your current
          progress is on track to victory.
        </p>
      ),
    },
    {
      question: 'How does scoring work?',
      answer: (
        <p>
          Win games to build your streak and accumulate wins. Losses break your streak. Your best
          streak is tracked permanently. Clear different difficulty levels to prove your mastery.
        </p>
      ),
    },
    {
      question: 'Do you have any pro tips?',
      answer: (
        <ul>
          <li>Flag squares you're certain contain mines—it helps you visualize the board</li>
          <li>Numbers create patterns; use adjacent numbers to narrow down possibilities</li>
          <li>Corner and edge squares have fewer adjacent squares to search</li>
          <li>Use the Hint function to learn optimal strategies</li>
          <li>Don't guess randomly—always use logic when possible</li>
        </ul>
      ),
    },
  ]

  return createPortal(
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
      className={styles.modal}
    >
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 id="help-title">Minesweeper Help</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close help"
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {helpItems.map((item, index) => (
            <section key={index}>
              <h3>{item.question}</h3>
              {item.answer}
            </section>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
