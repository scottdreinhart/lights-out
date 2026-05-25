/**
 * useFormValidation — Complete form validation and state management hook
 *
 * Usage:
 *   const {
 *     values, errors, touched,
 *     setValue, setTouched,
 *     handleSubmit, reset
 *   } = useFormValidation(
 *     { email: '', password: '' },
 *     { email: [ValidationSchema.required(), ValidationSchema.email()], ... },
 *     async (values) => { await submitForm(values) }
 *   )
 */

import { useState, useCallback, FormEvent } from 'react'
import { validateValue, validateForm } from './schema'
import type { ValidationRule, ValidationSchema, FormValidationState } from './types'

export interface UseFormValidationOptions {
  validateOnChange?: boolean
  validateOnBlur?: boolean
  validateOnSubmit?: boolean
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useFormValidation(
  initialValues: Record<string, any>,
  schema: ValidationSchema,
  onSubmit?: (values: Record<string, any>) => Promise<void> | void,
  options: UseFormValidationOptions = {},
) {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    onSuccess,
    onError,
  } = options

  const [state, setState] = useState<FormValidationState>({
    values: initialValues,
    errors: {},
    touched: {},
    dirty: {},
    isValid: true,
    isDirty: false,
    isSubmitting: false,
  })

  // Update a field value
  const setValue = useCallback(
    async (field: string, value: any) => {
      setState((prev) => ({
        ...prev,
        values: { ...prev.values, [field]: value },
        dirty: { ...prev.dirty, [field]: true },
        isDirty: true,
      }))

      if (validateOnChange && schema[field]) {
        const errors = await validateValue(value, schema[field])
        setState((prev) => ({
          ...prev,
          errors: { ...prev.errors, [field]: errors },
        }))
      }
    },
    [schema, validateOnChange],
  )

  // Mark a field as touched
  const setTouched = useCallback((field: string, touched: boolean) => {
    setState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [field]: touched },
    }))

    if (validateOnBlur && touched && schema[field]) {
      validateField(field)
    }
  }, [schema, validateOnBlur])

  // Validate a single field
  const validateField = useCallback(
    async (field: string): Promise<boolean> => {
      if (!schema[field]) return true

      const errors = await validateValue(state.values[field], schema[field])
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [field]: errors },
      }))

      return errors.length === 0
    },
    [schema, state.values],
  )

  // Validate entire form
  const validateFormFunc = useCallback(async (): Promise<boolean> => {
    const allErrors = await validateForm(state.values, schema)
    setState((prev) => ({
      ...prev,
      errors: allErrors,
    }))

    return Object.keys(allErrors).length === 0
  }, [state.values, schema])

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      setState((prev) => ({ ...prev, isSubmitting: true }))

      try {
        const isValid = await validateFormFunc()

        if (!isValid) {
          setState((prev) => ({ ...prev, isSubmitting: false }))
          return
        }

        if (onSubmit) {
          await onSubmit(state.values)
        }

        onSuccess?.()
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          dirty: {},
          isDirty: false,
        }))
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        onError?.(err)
        setState((prev) => ({ ...prev, isSubmitting: false }))
      }
    },
    [validateFormFunc, onSubmit, onSuccess, onError, state.values],
  )

  // Reset form to initial state
  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      dirty: {},
      isValid: true,
      isDirty: false,
      isSubmitting: false,
    })
  }, [initialValues])

  // Get errors for a field
  const getFieldError = useCallback((field: string): string | undefined => {
    const errors = state.errors[field]
    return errors && errors.length > 0 ? errors[0] : undefined
  }, [state.errors])

  // Get all errors for a field
  const getFieldErrors = useCallback((field: string): string[] => {
    return state.errors[field] || []
  }, [state.errors])

  // Check if field has errors
  const hasError = useCallback((field: string): boolean => {
    return (state.errors[field] || []).length > 0
  }, [state.errors])

  return {
    // State
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isDirty: state.isDirty,
    isSubmitting: state.isSubmitting,

    // Field updates
    setValue,
    setTouched,
    setFieldValue: setValue,
    setFieldTouched: setTouched,

    // Validation
    validateField,
    validateForm: validateFormFunc,
    getFieldError,
    getFieldErrors,
    hasError,

    // Form submission
    handleSubmit,
    reset,
  }
}
