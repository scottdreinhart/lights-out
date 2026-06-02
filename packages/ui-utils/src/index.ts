export type CxArg =
  | string
  | false
  | null
  | undefined
  | Record<string, unknown>
  | Array<string | false | null | undefined>

export const cx = (...args: CxArg[]): string => {
  return args
    .flatMap((arg) => {
      if (typeof arg === 'string') {
        return arg
      }

      if (Array.isArray(arg)) {
        return arg.filter((item): item is string => typeof item === 'string')
      }

      if (typeof arg === 'object' && arg !== null) {
        return Object.entries(arg)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key)
      }

      return []
    })
    .join(' ')
}

/**
 * Responsive breakpoints — shared across all game apps.
 * Synchronized with responsive.ts in @games/domain-shared.
 */
export const BREAKPOINTS = {
  sm: 375,
  md: 600,
  lg: 900,
  xl: 1200,
} as const

export { Modal, modalStyles } from './Modal'
export type { ModalProps } from './Modal'
export { ModalHeader, ModalContent, ModalFooter, modalLayoutStyles } from './ModalLayout'
export type { ModalHeaderProps, ModalContentProps, ModalFooterProps } from './ModalLayout'
export { GameControls } from './GameControls'
export { HamburgerMenu } from './HamburgerMenu'
export type { HamburgerMenuProps, MenuAction } from './HamburgerMenu'
export { FeatureShell } from './FeatureShell'
export type { FeatureShellProps } from './FeatureShell'
export { AppHeader } from './AppHeader'
export type { AppHeaderProps } from './AppHeader'
export { ConfirmDialog } from './ConfirmDialog'
export type { ConfirmDialogProps } from './ConfirmDialog'
export { AlertDialog } from './AlertDialog'
export type { AlertDialogProps } from './AlertDialog'
export { FormModal } from './FormModal'
export type { FormModalProps } from './FormModal'
export { ErrorBoundary } from './ErrorBoundary'
export type { ErrorBoundaryProps } from './ErrorBoundary'
export { default as animationsModule } from './animations.module.css'
export { LoadingOverlay } from './LoadingOverlay'
export type { LoadingOverlayProps } from './LoadingOverlay'
export { LoadingSpinner } from './LoadingSpinner'
export type { LoadingSpinnerProps } from './LoadingSpinner'
export { ValidationSchema, validateValue, validateForm } from './validation/schema'
export { useFormValidation } from './validation/useFormValidation'
export { ValidationError } from './validation/ValidationError'
export type { ValidationRule, FieldValidation, FormValidationState, FormSubmitResult, ValidationOptions } from './validation/types'
export type { UseFormValidationOptions } from './validation/useFormValidation'
export type { ValidationErrorProps } from './validation/ValidationError'
export { validationStyles } from './validation'
