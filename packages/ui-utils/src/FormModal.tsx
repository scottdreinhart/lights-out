import React, { FormEvent } from 'react'
import { Modal } from './Modal'
import { ModalHeader, ModalContent, ModalFooter } from './ModalLayout'

/**
 * Props for FormModal component
 */
export interface FormModalProps {
  /** Whether the dialog is open */
  isOpen: boolean
  /** Title of the form dialog */
  title: string
  /** Form content (input fields, etc.) */
  children: React.ReactNode
  /** Text for submit button (default: "Save") */
  submitLabel?: string
  /** Text for cancel button (default: "Cancel") */
  cancelLabel?: string
  /** Callback when form is submitted */
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  /** Callback when user cancels */
  onCancel: () => void
  /** Whether submit button is disabled */
  isSubmitting?: boolean
  /** Optional CSS class for dialog container */
  className?: string
}

/**
 * FormModal — Reusable form dialog
 *
 * Wrapper for forms with submit/cancel buttons. Prevents submission
 * unless isSubmitting is false.
 *
 * @example
 * ```tsx
 * const [showForm, setShowForm] = useState(false)
 * const [formData, setFormData] = useState({ name: '' })
 * const [isSubmitting, setIsSubmitting] = useState(false)
 *
 * const handleSubmit = async (e: FormEvent) => {
 *   e.preventDefault()
 *   setIsSubmitting(true)
 *   try {
 *     await api.saveSettings(formData)
 *   } finally {
 *     setIsSubmitting(false)
 *     setShowForm(false)
 *   }
 * }
 *
 * <FormModal
 *   isOpen={showForm}
 *   title="Edit Settings"
 *   submitLabel="Save"
 *   cancelLabel="Cancel"
 *   isSubmitting={isSubmitting}
 *   onSubmit={handleSubmit}
 *   onCancel={() => setShowForm(false)}
 * >
 *   <label>
 *     Name:
 *     <input
 *       type="text"
 *       value={formData.name}
 *       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
 *     />
 *   </label>
 * </FormModal>
 * ```
 */
export function FormModal({
  isOpen,
  title,
  children,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  onSubmit,
  onCancel,
  isSubmitting = false,
  className,
}: FormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      ariaLabel={title}
      className={className}
    >
      <form onSubmit={onSubmit}>
        <ModalHeader title={title} onClose={onCancel} />
        <ModalContent>{children}</ModalContent>
        <ModalFooter showCloseButton={false}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: `1px solid var(--feature-border, #666)`,
              background: 'transparent',
              color: 'var(--feature-text, #fff)',
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#1976d2',
              color: '#fff',
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? `${submitLabel}...` : submitLabel}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default FormModal
