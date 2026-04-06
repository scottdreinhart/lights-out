import React, { useCallback, useEffect, useRef } from 'react'
import styles from './AboutModal.module.css'

export interface Feature {
  emoji: string
  title: string
  description: string
}

export interface AboutModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly title?: string
  readonly aboutText?: React.ReactNode
  readonly variants?: Array<{ name: string; description: string }>
  readonly features?: Feature[]
  readonly patternShowcase?: React.ReactNode
  readonly technology?: React.ReactNode
  readonly author?: React.ReactNode
  readonly moreGames?: React.ReactNode
}

/**
 * Generic About Modal for Bingo variants.
 * Displays game information, features, and technology details.
 */
export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  title = 'About Bingo',
  aboutText,
  variants,
  features,
  patternShowcase,
  technology,
  author,
  moreGames,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [isOpen])

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

  const defaultAboutText = (
    <p className={styles.description}>
      Experience classic Bingo with a modern twist. Play multiple variants and patterns while
      enjoying a smooth, accessible gaming experience across all platforms.
    </p>
  )

  const renderAboutText = aboutText ?? defaultAboutText

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
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

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>About the Game</h3>
          {renderAboutText}
        </div>

        {variants && variants.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Game Variants</h3>
            <ul className={styles.variantList}>
              {variants.map((variant, idx) => (
                <li key={idx}>
                  <strong>{variant.name}</strong> — {variant.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        {features && features.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Features</h3>
            <div className={styles.featureGrid}>
              {features.map((feature, idx) => (
                <div key={idx} className={styles.featureItem}>
                  <div className={styles.featureEmoji}>{feature.emoji}</div>
                  <div className={styles.featureContent}>
                    <div className={styles.featureTitle}>{feature.title}</div>
                    <div className={styles.featureDesc}>{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {patternShowcase && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Winning Patterns</h3>
            <p className={styles.description}>
              Click on the cards below to see examples of all the winning patterns. The colored
              tiles show which numbers need to be marked to win:
            </p>
            {patternShowcase}
          </div>
        )}

        {technology && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Technology</h3>
            {technology}
          </div>
        )}

        {author && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Creator</h3>
            {author}
          </div>
        )}

        {moreGames && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>More Games</h3>
            {moreGames}
          </div>
        )}

        <div className={styles.footer}>
          <button type="button" className={styles.closeAction} onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  )
}
