import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './SettingsModal.module.css'

export interface Theme {
  id: string
  label: string
  color: string
}

export interface SettingsModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly themes: Theme[]
  readonly selectedTheme?: string
  readonly onThemeChange?: (themeId: string) => void
}

/**
 * Generic Settings Modal for Bingo variants.
 * Displays theme/palette selection and other options.
 */
export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  themes,
  selectedTheme = themes[0]?.id || 'classic',
  onThemeChange,
}) => {
  const [localTheme, setLocalTheme] = useState(selectedTheme)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [isOpen])

  useEffect(() => {
    setLocalTheme(selectedTheme)
  }, [selectedTheme])

  const handleThemeChange = useCallback(
    (themeId: string) => {
      setLocalTheme(themeId)
      onThemeChange?.(themeId)
    },
    [onThemeChange],
  )

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

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.content} onClick={(e) => e.stopPropagation()} role="document">
        <div className={styles.header}>
          <h2 className={styles.title}>Settings</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Color Theme</h3>
          <div className={styles.themeGrid}>
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={`${styles.themeOption} ${localTheme === theme.id ? styles.selected : ''}`}
                onClick={() => handleThemeChange(theme.id)}
                aria-pressed={localTheme === theme.id}
                aria-label={`Select ${theme.label} theme`}
              >
                <div className={styles.themeColor} style={{ backgroundColor: theme.color }} />
                <span className={styles.themeName}>{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.closeActionBtn} onClick={handleClose}>
            Done
          </button>
        </div>
      </div>
    </dialog>
  )
}
