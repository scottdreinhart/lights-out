/**
 * Validation Schema Builder — Create validation rules for form fields
 *
 * Usage:
 *   const schema = {
 *     email: [
 *       ValidationSchema.required(),
 *       ValidationSchema.email(),
 *     ],
 *     password: [
 *       ValidationSchema.required(),
 *       ValidationSchema.minLength(8),
 *     ],
 *   }
 */

import type { ValidationRule } from './types'

export class ValidationSchema {
  /**
   * Create a required field validation rule
   */
  static required(message = 'This field is required'): ValidationRule {
    return {
      type: 'required',
      message,
      validate: (value) => {
        if (typeof value === 'string') return value.trim().length > 0
        if (Array.isArray(value)) return value.length > 0
        return value !== null && value !== undefined && value !== ''
      },
    }
  }

  /**
   * Create a minimum length validation rule
   */
  static minLength(
    length: number,
    message?: string,
  ): ValidationRule {
    return {
      type: 'minLength',
      message: message || `Minimum ${length} characters required`,
      metadata: { length },
      validate: (value) => {
        if (typeof value !== 'string') return true
        return value.length >= length
      },
    }
  }

  /**
   * Create a maximum length validation rule
   */
  static maxLength(
    length: number,
    message?: string,
  ): ValidationRule {
    return {
      type: 'maxLength',
      message: message || `Maximum ${length} characters allowed`,
      metadata: { length },
      validate: (value) => {
        if (typeof value !== 'string') return true
        return value.length <= length
      },
    }
  }

  /**
   * Create a regex pattern validation rule
   */
  static pattern(
    pattern: RegExp,
    message = 'Invalid format',
  ): ValidationRule {
    return {
      type: 'pattern',
      message,
      metadata: { pattern: pattern.source },
      validate: (value) => {
        if (typeof value !== 'string') return true
        return pattern.test(value)
      },
    }
  }

  /**
   * Create an email validation rule
   */
  static email(message = 'Invalid email address'): ValidationRule {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return {
      type: 'email',
      message,
      validate: (value) => {
        if (typeof value !== 'string') return true
        return emailPattern.test(value)
      },
    }
  }

  /**
   * Create a custom validation rule
   */
  static custom(
    validate: (value: any) => boolean | Promise<boolean>,
    message = 'Invalid value',
  ): ValidationRule {
    return {
      type: 'custom',
      message,
      validate,
    }
  }

  /**
   * Create a numeric validation rule
   */
  static numeric(message = 'Must be a number'): ValidationRule {
    return {
      type: 'pattern',
      message,
      validate: (value) => {
        if (value === null || value === undefined || value === '') return true
        return !isNaN(Number(value))
      },
    }
  }

  /**
   * Create a URL validation rule
   */
  static url(message = 'Invalid URL'): ValidationRule {
    const urlPattern = /^https?:\/\/.+/
    return {
      type: 'pattern',
      message,
      validate: (value) => {
        if (typeof value !== 'string') return true
        return urlPattern.test(value)
      },
    }
  }

  /**
   * Create a match field validation rule (for password confirmation)
   */
  static match(
    fieldValue: any,
    message = 'Fields do not match',
  ): ValidationRule {
    return {
      type: 'custom',
      message,
      validate: (value) => value === fieldValue,
    }
  }
}

/**
 * Validate a single value against rules
 */
export async function validateValue(
  value: any,
  rules: ValidationRule[],
): Promise<string[]> {
  const errors: string[] = []

  for (const rule of rules) {
    if (rule.validate) {
      try {
        const isValid = await rule.validate(value)
        if (!isValid) {
          errors.push(rule.message)
        }
      } catch (err) {
        errors.push(rule.message)
      }
    }
  }

  return errors
}

/**
 * Validate all fields against schema
 */
export async function validateForm(
  values: Record<string, any>,
  schema: Record<string, ValidationRule[]>,
): Promise<Record<string, string[]>> {
  const errors: Record<string, string[]> = {}

  for (const [field, rules] of Object.entries(schema)) {
    const fieldErrors = await validateValue(values[field], rules)
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors
    }
  }

  return errors
}
