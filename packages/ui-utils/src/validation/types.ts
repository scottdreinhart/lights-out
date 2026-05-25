/**
 * Validation types — Core interfaces for form validation framework
 */

/**
 * Single validation rule for a field
 */
export interface ValidationRule {
  /** Type of validation rule */
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'custom'
  /** Error message if validation fails */
  message: string
  /** Custom validation function (optional for most types) */
  validate?: (value: any) => boolean | Promise<boolean>
  /** Additional metadata for rule */
  metadata?: Record<string, any>
}

/**
 * Validation state for a single field
 */
export interface FieldValidation {
  value: any
  errors: string[]
  isValid: boolean
  isDirty: boolean
  isTouched: boolean
}

/**
 * Overall form validation state
 */
export interface FormValidationState {
  values: Record<string, any>
  errors: Record<string, string[]>
  touched: Record<string, boolean>
  dirty: Record<string, boolean>
  isValid: boolean
  isDirty: boolean
  isSubmitting: boolean
}

/**
 * Schema mapping field names to validation rules
 */
export type ValidationSchema = Record<string, ValidationRule[]>

/**
 * Form submission result
 */
export interface FormSubmitResult {
  success: boolean
  error?: Error
}

/**
 * Validation options
 */
export interface ValidationOptions {
  validateOnChange?: boolean
  validateOnBlur?: boolean
  validateOnSubmit?: boolean
  validateOnMount?: boolean
}
