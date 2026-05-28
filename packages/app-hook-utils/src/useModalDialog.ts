import { useCallback, useEffect, useRef } from 'react'

/**
 * Configuration for useModalDialog hook
 */
export interface UseModalDialogConfig {
  /** Whether the modal is currently open */
  isOpen: boolean
  /** Callback fired when the modal should close (backdrop click, etc.) */
  onClose: () => void
}

/**
 * Result object from useModalDialog hook
 */
export interface UseModalDialogResult {
  /** Ref to attach to dialog element */
  dialogRef: React.RefObject<HTMLDialogElement | null>
  /** Handler for backdrop click (close when clicking outside dialog) */
  handleBackdropClick: (e: React.MouseEvent<HTMLDialogElement>) => void
}

/**
 * Unified hook for modal dialog lifecycle management
 *
 * Handles:
 * - Dialog show/close lifecycle based on isOpen prop
 * - Focus management (save and restore previous focus)
 * - Backdrop click detection (close on background click)
 *
 * Eliminates 20+ lines of boilerplate per modal file.
 *
 * @param config - Configuration object with isOpen and onClose
 * @returns Object with dialogRef and handleBackdropClick handler
 *
 * @example
 * ```typescript
 * function SettingsModal({ isOpen, onClose }) {
 *   const { dialogRef, handleBackdropClick } = useModalDialog({ isOpen, onClose })
 *   useModalKeyboard(dialogRef, onClose, isOpen)
 *
 *   return (
 *     <dialog
 *       ref={dialogRef}
 *       className={styles.backdrop}
 *       onClick={handleBackdropClick}
 *       aria-label="Settings"
 *     >
 *       <h2>Settings</h2>
 *       modal content
 *     </dialog>
 *   )
 * }
 * ```
 */
export function useModalDialog({ isOpen, onClose }: UseModalDialogConfig): UseModalDialogResult {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const prevFocus = useRef<HTMLElement | null>(null)

  // Handle dialog open/close and focus management
  useEffect(() => {
    if (isOpen) {
      // Save current focused element before opening
      prevFocus.current = document.activeElement as HTMLElement
      // Open the dialog
      dialogRef.current?.showModal()
    } else {
      // Close the dialog
      dialogRef.current?.close()
      // Restore previous focus
      prevFocus.current?.focus()
    }
  }, [isOpen])

  // Handle backdrop click (click outside dialog)
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      // Only close if clicking the backdrop itself, not dialog content
      if (e.target === dialogRef.current) {
        onClose()
      }
    },
    [onClose],
  )

  return { dialogRef: dialogRef as React.RefObject<HTMLDialogElement>, handleBackdropClick }
}
