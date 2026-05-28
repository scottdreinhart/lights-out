import React from 'react'
import styles from './Modal.module.css'

/**
 * Centralized modal layout styles export
 * Use these classes in your ModalHeader, ModalContent, and ModalFooter components
 */
export const modalLayoutStyles = {
  title: styles.title,
  section: styles.section,
  actions: styles.actions,
  button: styles.button,
}

/**
 * ModalHeader component - standardized modal header with title and close button
 */
export interface ModalHeaderProps {
  /** Title text to display in header */
  title: string
  /** Callback when close button is clicked */
  onClose: () => void
  /** Optional CSS class for the header element */
  className?: string
}

export function ModalHeader({ title, onClose, className = styles.title }: ModalHeaderProps) {
  return (
    <div className={className}>
      <h2>{title}</h2>
      <button type="button" onClick={onClose} aria-label="Close modal">
        ✕
      </button>
    </div>
  )
}

/**
 * ModalContent component - container for modal body content
 */
export interface ModalContentProps {
  /** Modal body content */
  children: React.ReactNode
  /** Optional CSS class for the content container */
  className?: string
}

export function ModalContent({ children, className = styles.section }: ModalContentProps) {
  return <div className={className}>{children}</div>
}

/**
 * ModalFooter component - standardized modal footer with actions
 */
export interface ModalFooterProps {
  /** Footer content (buttons, actions, etc.) */
  children?: React.ReactNode
  /** Callback when default close button is clicked */
  onClose?: () => void
  /** Whether to show a default close button */
  showCloseButton?: boolean
  /** Optional CSS class for the footer element */
  className?: string
}

export function ModalFooter({
  children,
  onClose,
  showCloseButton = true,
  className = styles.actions
}: ModalFooterProps) {
  return (
    <div className={className}>
      {children}
      {showCloseButton && onClose && (
        <button type="button" onClick={onClose} className={styles.button}>
          Close
        </button>
      )}
    </div>
  )
}
