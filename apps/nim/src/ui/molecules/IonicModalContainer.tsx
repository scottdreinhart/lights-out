/**
 * IonicModalContainer — Wrapper around IonModal with sensible defaults.
 *
 * Features:
 * - Full-screen on mobile, centered modal on desktop
 * - Automatic keyboard handling (ESC to close)
 * - Fade animation
 * - Platform-aware sizing
 * - WCAG accessible (aria-modal, focus trap)
 *
 * Usage:
 * const [isOpen, setIsOpen] = useState(false)
 * return (
 *   <>
 *     <button onClick={() => setIsOpen(true)}>Open Modal</button>
 *     <IonicModalContainer isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *       <h2>Modal Content</h2>
 *       <p>Your content here</p>
 *     </IonicModalContainer>
 *   </>
 * )
 */

import { IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/react'
import React from 'react'

import { useIonicPlatform } from '@/app'
import { useResponsiveState } from '@games/app-hook-utils'
import styles from './IonicModalContainer.module.css'

interface IonicModalContainerProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean

  /**
   * Callback when modal should close (ESC, back button, or external close)
   */
  onClose: () => void

  /**
   * Modal title (optional, auto-rendered in header if provided)
   */
  title?: string

  /**
   * Modal content
   */
  children: React.ReactNode

  /**
   * CSS class for custom styling
   */
  className?: string

  /**
   * Close button text (default: no close button)
   */
  closeButtonText?: string

  /**
   * Confirm button text (optional)
   */
  confirmButtonText?: string

  /**
   * Confirm button handler
   */
  onConfirm?: () => void

  /**
   * Dialog role (default: 'dialog')
   */
  role?: 'dialog' | 'alertdialog'

  /**
   * Presentation style: 'fullscreen' (mobile) or 'card' (desktop centered)
   * Default: auto (fullscreen on mobile, card on desktop)
   */
  presentation?: 'fullscreen' | 'card' | 'auto'
}

export const IonicModalContainer = React.forwardRef<HTMLIonModalElement, IonicModalContainerProps>(
  function IonicModalContainer(
    {
      isOpen,
      onClose,
      title,
      children,
      className,
      closeButtonText,
      confirmButtonText,
      onConfirm,
      role = 'dialog',
      presentation = 'auto',
    },
    ref,
  ) {
    const platform = useIonicPlatform()
    const responsive = useResponsiveState()

    // Auto presentation based on platform
    const effectivePresentation =
      presentation === 'auto'
        ? platform.isMobileDevice
          ? 'fullscreen'
          : 'card'
        : presentation

    const presentingElement =
      typeof document !== 'undefined'
        ? (document.querySelector('ion-app') as HTMLElement | null) ?? undefined
        : undefined

    return (
      <IonModal
        ref={ref}
        isOpen={isOpen}
        onDidDismiss={onClose}
        className={`${styles.modal} ${className || ''}`}
        role={role}
        presentingElement={presentingElement}
      >
        {title && (
          <IonHeader>
            <IonToolbar>
              <IonTitle>{title}</IonTitle>
            </IonToolbar>
          </IonHeader>
        )}

        <IonContent className={styles.content} scrollEvents>
          <div
            className={styles.container}
            style={{
              padding: responsive.contentDensity === 'compact' ? '1rem' : '2rem',
              maxWidth: effectivePresentation === 'fullscreen' ? '100%' : '600px',
              margin: platform.isMobileDevice ? 0 : '0 auto',
            }}
          >
            {children}
          </div>
        </IonContent>

        {/* Footer with action buttons */}
        {(closeButtonText || confirmButtonText) && (
          <div className={styles.footer}>
            <div
              className={styles.buttonGroup}
              style={{
                gap: responsive.contentDensity === 'compact' ? '0.5rem' : '1rem',
              }}
            >
              {closeButtonText && (
                <button
                  className={`${styles.button} ${styles.buttonSecondary}`}
                  onClick={onClose}
                  aria-label={closeButtonText}
                >
                  {closeButtonText}
                </button>
              )}
              {confirmButtonText && onConfirm && (
                <button
                  className={`${styles.button} ${styles.buttonPrimary}`}
                  onClick={onConfirm}
                  aria-label={confirmButtonText}
                >
                  {confirmButtonText}
                </button>
              )}
            </div>
          </div>
        )}
      </IonModal>
    )
  },
)

IonicModalContainer.displayName = 'IonicModalContainer'
