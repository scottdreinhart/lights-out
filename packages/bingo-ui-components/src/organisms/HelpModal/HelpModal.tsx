import React, { useCallback, useEffect, useRef } from 'react'
import styles from './HelpModal.module.css'

export interface HelpModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly title?: string
  readonly items?: Array<{
    question: string
    answer: React.ReactNode
  }>
  readonly containerClassName?: string
  readonly triggerRef?: React.RefObject<HTMLElement>
}

/**
 * Generic Help Modal for Bingo variants.
 * Displays frequently asked questions and answers about game mechanics.
 */
export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  title = 'Help & FAQ',
  items,
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

  const defaultItems: Array<{ question: string; answer: React.ReactNode }> = [
    {
      question: 'How do I mark numbers on my card?',
      answer: (
        <p className={styles.itemAnswer}>
          Click on any number on your Bingo card to mark it. Marked numbers will change color to
          show they have been called. You can also mark numbers by clicking as they are drawn.
        </p>
      ),
    },
    {
      question: 'How do I win?',
      answer: (
        <p className={styles.itemAnswer}>
          Create a winning pattern on your card by marking the required numbers. The patterns
          depend on your game variant—it could be a line, diagonal, full board, or another
          configuration. Once you complete a winning pattern, call "Bingo!" to win the game.
        </p>
      ),
    },
    {
      question: 'Can I undo my moves?',
      answer: (
        <p className={styles.itemAnswer}>
          If undo is enabled in your game settings, you can undo recent marks on your card. Look
          for the Undo button in your controls. Check the rules for specific undo limitations.
        </p>
      ),
    },
    {
      question: 'What game variants are available?',
      answer: (
        <p className={styles.itemAnswer}>
          Different Bingo variants offer unique winning patterns and rules. Each variant has its
          own specific objectives and board configurations. The rules modal explains each variant's
          winning patterns in detail.
        </p>
      ),
    },
    {
      question: 'How does the hint system work?',
      answer: (
        <p className={styles.itemAnswer}>
          Use the hint feature to identify potential winning paths on your current card. Hints
          highlight numbers that could lead you closer to a winning pattern. The more hints you
          use, the easier the game becomes.
        </p>
      ),
    },
    {
      question: 'What does the difficulty setting do?',
      answer: (
        <p className={styles.itemAnswer}>
          Difficulty settings can affect pacing, board size, or game complexity depending on the
          variant. Easier levels provide more time or simpler patterns, while harder levels present
          increased challenges and faster gameplay.
        </p>
      ),
    },
  ]

  const renderItems = items || defaultItems

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

        <div className={styles.itemsContainer}>
          {renderItems.map((item, idx) => (
            <div key={idx} className={styles.item}>
              <h3 className={styles.itemQuestion}>{item.question}</h3>
              {item.answer}
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.closeAction} onClick={handleClose}>
            Got It!
          </button>
        </div>
      </div>
    </dialog>
  )
}
