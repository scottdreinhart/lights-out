import type { PropsWithChildren, ReactNode, RefObject } from 'react'
import { useModalKeyboard, useModalDialog } from '@games/app-hook-utils'
import styles from './Modal.module.css'

/**
 * Centralized modal styles export
 * Use these classes in your modal components
 */
export const modalStyles = styles

/**
 * Props for the Modal component wrapper
 */
export interface ModalProps extends PropsWithChildren {
  /** Whether the modal is currently open */
  isOpen: boolean
  /** Callback fired when the modal should close */
  onClose: () => void
  /** ARIA label for accessibility */
  ariaLabel: string
  /** Optional CSS class for the dialog backdrop */
  className?: string
  /** Optional CSS class for the modal container */
  containerClassName?: string
  /** Modal content (children) */
  children: ReactNode
}

/**
 * Reusable Modal component wrapper
 *
 * Provides:
 * - Dialog lifecycle management (showModal, close, focus restoration)
 * - Keyboard handling (Escape to close)
 * - Backdrop click detection (close when clicking outside)
 * - ARIA accessibility
 *
 * Replaces 30+ lines of boilerplate per modal file.
 *
 * @example
 * ```typescript
 * import { Modal, ModalHeader, ModalContent, ModalFooter, modalStyles } from '@games/ui-utils'
 *
 * function SettingsModal({ isOpen, onClose }) {
 *   return (
 *     <Modal 
 *       isOpen={isOpen} 
 *       onClose={onClose} 
 *       ariaLabel="Settings"
 *       className={modalStyles.backdrop}
 *       containerClassName={modalStyles.modal}
 *     >
 *       <ModalHeader title="Settings" onClose={onClose} className={modalStyles.title} />
 *       <ModalContent className={modalStyles.section}>
 *         Your content here
 *       </ModalContent>
 *       <ModalFooter onClose={onClose} className={modalStyles.actions} />
 *     </Modal>
 *   )
 * }
 * ```
 */
export function Modal({
  isOpen,
  onClose,
  ariaLabel,
  className = styles.backdrop,
  containerClassName = styles.modal,
  children
}: ModalProps) {
  const { dialogRef, handleBackdropClick } = useModalDialog({ isOpen, onClose })
  useModalKeyboard(dialogRef as RefObject<HTMLDialogElement>, onClose, isOpen)

  return (
    <dialog
      ref={dialogRef}
      className={className}
      onClick={handleBackdropClick}
      aria-label={ariaLabel}
    >
      <div className={containerClassName}>
        {children}
      </div>
    </dialog>
  )
}

export default Modal
