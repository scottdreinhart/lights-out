/**
 * Validation module barrel export
 *
 * Consolidated form validation framework for all game applications
 */

export { ValidationSchema, validateValue, validateForm } from './schema'
export { useFormValidation } from './useFormValidation'
export { ValidationError } from './ValidationError'

export type {
  ValidationRule,
  ValidationSchema as ValidationSchemaType,
  FieldValidation,
  FormValidationState,
  FormSubmitResult,
  ValidationOptions,
} from './types'
export type { UseFormValidationOptions } from './useFormValidation'
export type { ValidationErrorProps } from './ValidationError'

// Re-export CSS module for direct access if needed
import styles from './validation.module.css'
export { styles as validationStyles }
