import React from 'react'
import { Modal } from './Modal'
import { ModalHeader, ModalContent, ModalFooter } from './ModalLayout'

/**
 * Props for ConfirmDialog component
 */
export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean
  /** Title of the confirm dialog */
  title: string
  /** Message/content to display */
  message: string | React.ReactNode
  /** Text for confirm button (default: "Yes") */
  confirmLabel?: string
  /** Text for cancel button (default: "No") */
  cancelLabel?: string
  /** Callback when user confirms */
  onConfirm: () => void
  /** Callback when user cancels */
  onCancel: () => void
  /** Optional CSS class for dialog container */
  className?: string
  /** Danger/warning variant (red confirm button) */
  isDangerous?: boolean
}

/**
 * ConfirmDialog — Reusable confirmation dialog
 *
 * Standard yes/no confirmation pattern for delete, unsaved changes, etc.
 *
 * @example
 * ```tsx
 * const [showConfirm, setShowConfirm] = useState(false)
 *
 * <ConfirmDialog
 *   isOpen={showConfirm}
 *   title="Delete Game"
 *   message="Are you sure you want to delete your saved game? This cannot be undone."
 *   confirmLabel="Delete"
 *   cancelLabel="Keep"
 *   isDangerous={true}
 *   onConfirm={() => deleteSavedGame()}
 *   onCancel={() => setShowConfirm(false)}
 * />
 * ```
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  onConfirm,
  onCancel,
  className,
  isDangerous = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      ariaLabel={title}
      className={className}
    >
      <ModalHeader title={title} onClose={onCancel} />
      <ModalContent>{message}</ModalContent>
      <ModalFooter showCloseButton={false}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: `1px solid var(--feature-border, #666)`,
            background: 'transparent',
            color: 'var(--feature-text, #fff)',
          }}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: isDangerous ? '#d32f2f' : '#1976d2',
            color: '#fff',
          }}
        >
          {confirmLabel}
        </button>
      </ModalFooter>
    </Modal>
  )
}

export default ConfirmDialog
