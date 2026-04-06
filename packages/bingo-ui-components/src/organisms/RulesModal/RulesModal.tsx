import React, { useCallback, useEffect, useRef } from 'react'
import styles from './RulesModal.module.css'

export interface RulesModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly title?: string
  readonly sections?: Array<{
    heading: string
    content: React.ReactNode
  }>
  readonly containerClassName?: string
  readonly triggerRef?: React.RefObject<HTMLElement>
}

/**
 * Generic Rules Modal for Bingo variants.
 * Displays game instructions, winning conditions, and game controls.
 */
export const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose,
  title = 'How to Play',
  sections,
  containerClassName,
  triggerRef,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Save currently focused element and show modal
      previouslyFocusedRef.current = document.activeElement as HTMLElement
      dialogRef.current?.showModal()
    } else {
      // Close modal and restore focus
      dialogRef.current?.close()
      // Restore focus to previously focused element or trigger ref
      const elementToFocus = previouslyFocusedRef.current || triggerRef?.current
      if (elementToFocus && 'focus' in elementToFocus) {
        elementToFocus.focus()
      }
    }
  }, [isOpen, triggerRef])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        handleClose()
      }
    },
    [handleClose],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDialogElement>) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    },
    [handleClose],
  )

  const defaultSections: Array<{ heading: string; content: React.ReactNode }> = [
    {
      heading: 'Objective',
      content: (
        <p className={styles.description}>
          Mark numbers on your Bingo card as they are drawn. Be the first to complete a winning
          pattern and call out "Bingo!" to win.
        </p>
      ),
    },
    {
      heading: 'Getting Started',
      content: (
        <ol className={styles.stepsList}>
          <li>
            <strong>Generate a Card</strong> — Click "New Card" to generate a randomized Bingo card
          </li>
          <li>
            <strong>Draw Numbers</strong> — Click "Draw" to randomly select the next number
          </li>
          <li>
            <strong>Mark Your Card</strong> — Click on numbers on your card as they're drawn
          </li>
          <li>
            <strong>Complete a Pattern</strong> — Form a winning pattern on your card
          </li>
          <li>
            <strong>Win</strong> — Call "Bingo!" when you complete a pattern
          </li>
        </ol>
      ),
    },
    {
      heading: 'Winning Patterns',
      content: (
        <div className={styles.patternsList}>
          <div className={styles.patternItem}>
            <span className={styles.patternIcon}>—</span>
            <span>Horizontal line (any row)</span>
          </div>
          <div className={styles.patternItem}>
            <span className={styles.patternIcon}>|</span>
            <span>Vertical line (any column)</span>
          </div>
          <div className={styles.patternItem}>
            <span className={styles.patternIcon}>⧹</span>
            <span>Diagonal (corner to corner)</span>
          </div>
          <div className={styles.patternItem}>
            <span className={styles.patternIcon}>✕</span>
            <span>Four corners</span>
          </div>
          <div className={styles.patternItem}>
            <span className={styles.patternIcon}>□</span>
            <span>Full board (all numbers)</span>
          </div>
        </div>
      ),
    },
    {
      heading: 'Tips',
      content: (
        <ul className={styles.tipsList}>
          <li>Watch the drawn numbers area to track which numbers have been called</li>
          <li>Click numbers on your card to mark them (they'll turn a different color)</li>
          <li>Use the Hints feature to highlight potential winning patterns</li>
          <li>Play at your own pace — there's no time limit</li>
          <li>Try different game variants for variety and different challenges</li>
        </ul>
      ),
    },
  ]

  const renderSections = sections || defaultSections

  return (
    <dialog
      ref={dialogRef}
      className={containerClassName ? `${styles.modal} ${containerClassName}` : styles.modal}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.content} onClick={(e) => e.stopPropagation()} role="document">
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label={`Close ${title}`}
          >
            ✕
          </button>
        </div>

        {renderSections.map((section, idx) => (
          <div key={idx} className={styles.section}>
            <h3 className={styles.sectionTitle}>{section.heading}</h3>
            {section.content}
          </div>
        ))}

        <div className={styles.footer}>
          <button type="button" className={styles.closeAction} onClick={handleClose}>
            Got It!
          </button>
        </div>
      </div>
    </dialog>
  )
}
