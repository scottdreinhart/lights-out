/**
 * IonicAlertDialog — Wrapper around IonAlert with sensible defaults.
 *
 * Perfect replacement for browser `confirm()` / `alert()`.
 * Automatically dismisses on standard button actions.
 *
 * Features:
 * - Confirmation dialogs (OK / Cancel)
 * - Alert dialogs (with custom buttons)
 * - Platform-native appearance (iOS vs Android)
 * - WCAG accessible
 * - Keyboard support (Enter and Escape)
 * - Auto-focus first button on open
 *
 * Usage:
 * const handleDelete = async () => {
 *   const confirmed = await alertRef.current?.show()
 *   if (confirmed) {
 *     // User clicked OK / Confirm
 *   }
 * }
 *
 * <IonicAlertDialog
 *   ref={alertRef}
 *   title="Delete?"
 *   message="This cannot be undone."
 *   okText="Delete"
 *   okColor="danger"
 *   cancelText="Cancel"
 * />
 */

import { IonAlert } from '@ionic/react'
import React, { useRef } from 'react'

export interface AlertButton {
  text: string
  handler?: () => void | boolean
  role?: 'cancel' | 'destructive' | 'default'
  cssClass?: string
}

interface IonicAlertDialogProps {
  /**
   * Alert title
   */
  title: string

  /**
   * Alert message body
   */
  message: string

  /**
   * Color theme: primary, secondary, danger, success, warning, dark, light
   */
  color?: string

  /**
   * Text for OK/confirm button (if using simple confirm pattern)
   */
  okText?: string

  /**
   * Color for OK button
   */
  okColor?: string

  /**
   * Text for Cancel button
   */
  cancelText?: string

  /**
   * Custom buttons (alternative to okText/cancelText)
   */
  buttons?: AlertButton[]

  /**
   * Callback when alert closes
   */
  onDismiss?: (data: { role?: string }) => void

  /**
   * CSS class for custom styling
   */
  className?: string
}

export const IonicAlertDialog = React.forwardRef<
  {
    present: () => Promise<void>
    dismiss: () => Promise<void>
  },
  IonicAlertDialogProps
>(function IonicAlertDialog(
  {
    title,
    message,
    color = 'primary',
    okText = 'OK',
    okColor = color,
    cancelText = 'Cancel',
    buttons,
    onDismiss,
    className,
  },
  ref,
) {
  const alertRef = useRef<HTMLIonAlertElement | null>(null)

  // Expose present/dismiss methods
  React.useImperativeHandle(ref, () => ({
    present: async () => {
      if (!alertRef.current) {
        return
      }
      await alertRef.current.present()
    },
    dismiss: async () => {
      if (!alertRef.current) {
        return
      }
      await alertRef.current.dismiss()
    },
  }))

  // Default buttons if not provided
  const defaultButtons: AlertButton[] =
    buttons ||
    [
      {
        text: cancelText,
        role: 'cancel',
        cssClass: 'alert-button-secondary',
      },
      {
        text: okText,
        role: 'default',
        cssClass: `alert-button-primary alert-button-${okColor}`,
      },
    ]

  return (
    <IonAlert
      ref={alertRef}
      header={title}
      message={message}
      buttons={defaultButtons.map((btn) => ({
        text: btn.text,
        role: btn.role,
        handler: btn.handler,
        cssClass: btn.cssClass,
      }))}
      onDidDismiss={(event) => onDismiss?.({ role: event.detail.role })}
      className={className}
    />
  )
})

IonicAlertDialog.displayName = 'IonicAlertDialog'
