import React from 'react'
import { Modal } from './Modal'
import { ModalHeader, ModalContent, ModalFooter } from './ModalLayout'

/**
 * Props for AlertDialog component
 */
export interface AlertDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean
  /** Title of the alert dialog */
  title: string
  /** Message/content to display */
  message: string | React.ReactNode
  /** Text for action button (default: "OK") */
  actionLabel?: string
  /** Callback when user acknowledges alert */
  onAction: () => void
  /** Optional CSS class for dialog container */
  className?: string
  /** Alert type (affects styling) */
  type?: 'info' | 'warning' | 'error' | 'success'
}

/**
 * AlertDialog — Reusable alert/notification dialog
 *
 * Single-action dialog for informational messages, warnings, errors, etc.
 *
 * @example
 * ```tsx
 * const [showAlert, setShowAlert] = useState(false)
 *
 * <AlertDialog
 *   isOpen={showAlert}
 *   type="error"
 *   title="Connection Error"
 *   message="Failed to save your progress. Please check your internet connection."
 *   actionLabel="OK"
 *   onAction={() => setShowAlert(false)}
 * />
 * ```
 */
export function AlertDialog({
  isOpen,
  title,
  message,
  actionLabel = 'OK',
  onAction,
  className,
  type = 'info',
}: AlertDialogProps) {
  const getTypeColor = () => {
    switch (type) {
      case 'error':
        return '#d32f2f'
      case 'warning':
        return '#f57c00'
      case 'success':
        return '#388e3c'
      case 'info':
      default:
        return '#1976d2'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onAction}
      ariaLabel={title}
      className={className}
    >
      <ModalHeader title={title} onClose={onAction} />
      <ModalContent>{message}</ModalContent>
      <ModalFooter showCloseButton={false}>
        <button
          type="button"
          onClick={onAction}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: getTypeColor(),
            color: '#fff',
            flex: 1,
          }}
        >
          {actionLabel}
        </button>
      </ModalFooter>
    </Modal>
  )
}

export default AlertDialog
