/**
 * @games/shared-validators — Centralized input validation for all game applications
 *
 * Core principles:
 * - Trust nothing from external sources (UI, network, storage)
 * - Validate at boundaries (enforce trust-boundary policy)
 * - Type-safe results (returns either validated data or explicit error)
 * - Framework-agnostic (pure functions, no React/DOM dependencies)
 *
 * Usage:
 *   import { validateString, validateNumber, validateURL } from '@games/shared-validators'
 *
 *   // Type-safe validation
 *   const result = validateString(input, { minLength: 1, maxLength: 100 })
 *   if (result.ok) {
 *     console.log(result.value) // ✅ Type: string
 *   } else {
 *     console.error(result.error) // ❌ Validation error message
 *   }
 */

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

export interface ValidationSuccess<T> {
  ok: true
  value: T
}

export interface ValidationFailure {
  ok: false
  error: string
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure

export interface StringValidationOptions {
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  allowedCharacters?: string
  trim?: boolean
}

export interface NumberValidationOptions {
  min?: number
  max?: number
  integer?: boolean
}

// ────────────────────────────────────────────────────────────────────────────
// String Validation
// ────────────────────────────────────────────────────────────────────────────

/**
 * Validate string input with optional constraints
 *
 * @param input - Value to validate
 * @param options - Validation constraints (minLength, maxLength, pattern, etc.)
 * @returns Validation result with typed output or error
 *
 * @example
 *   const result = validateString(userInput, { minLength: 1, maxLength: 100 })
 *   if (result.ok) console.log(result.value)
 */
export function validateString(
  input: unknown,
  options: StringValidationOptions = {},
): ValidationResult<string> {
  // Type check
  if (typeof input !== 'string') {
    return { ok: false, error: 'Expected string' }
  }

  let value = options.trim ? input.trim() : input

  // Length check
  if (options.minLength !== undefined && value.length < options.minLength) {
    return {
      ok: false,
      error: `String too short (min ${options.minLength} characters)`,
    }
  }

  if (options.maxLength !== undefined && value.length > options.maxLength) {
    return {
      ok: false,
      error: `String too long (max ${options.maxLength} characters)`,
    }
  }

  // Pattern check
  if (options.pattern && !options.pattern.test(value)) {
    return { ok: false, error: 'String does not match required pattern' }
  }

  // Character whitelist check
  if (options.allowedCharacters) {
    const allowedSet = new Set(options.allowedCharacters)
    for (const char of value) {
      if (!allowedSet.has(char)) {
        return {
          ok: false,
          error: `String contains disallowed character: ${char}`,
        }
      }
    }
  }

  return { ok: true, value }
}

// ────────────────────────────────────────────────────────────────────────────
// Number Validation
// ────────────────────────────────────────────────────────────────────────────

/**
 * Validate numeric input with optional constraints
 *
 * @param input - Value to validate
 * @param options - Validation constraints (min, max, integer)
 * @returns Validation result with typed output or error
 */
export function validateNumber(
  input: unknown,
  options: NumberValidationOptions = {},
): ValidationResult<number> {
  // Type check
  if (typeof input !== 'number' || isNaN(input)) {
    return { ok: false, error: 'Expected valid number' }
  }

  // Integer check
  if (options.integer && !Number.isInteger(input)) {
    return { ok: false, error: 'Expected integer' }
  }

  // Range check
  if (options.min !== undefined && input < options.min) {
    return { ok: false, error: `Number too small (min ${options.min})` }
  }

  if (options.max !== undefined && input > options.max) {
    return { ok: false, error: `Number too large (max ${options.max})` }
  }

  return { ok: true, value: input }
}

// ────────────────────────────────────────────────────────────────────────────
// URL Validation
// ────────────────────────────────────────────────────────────────────────────

/**
 * Validate and normalize URL, rejecting dangerous protocols
 *
 * Safe protocols: http, https, mailto
 * Blocked protocols: javascript, data, vbscript
 *
 * @param input - URL string to validate
 * @returns Validation result with normalized URL or error
 */
export function validateURL(input: unknown): ValidationResult<string> {
  // String check
  const strResult = validateString(input, { maxLength: 2048 })
  if (!strResult.ok) return strResult

  const urlString = strResult.value.trim()

  // Try to parse as URL
  try {
    const url = new URL(urlString)

    // Whitelist safe protocols
    const safeProtocols = ['http:', 'https:', 'mailto:']
    if (!safeProtocols.includes(url.protocol)) {
      return { ok: false, error: `Unsafe protocol: ${url.protocol}` }
    }

    return { ok: true, value: url.toString() }
  } catch {
    return { ok: false, error: 'Invalid URL format' }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Email Validation
// ────────────────────────────────────────────────────────────────────────────

/**
 * Validate email address format
 * Uses simplified RFC 5322 pattern (practical for UI validation)
 *
 * @param input - Email string to validate
 * @returns Validation result with normalized email or error
 */
export function validateEmail(input: unknown): ValidationResult<string> {
  // String check
  const strResult = validateString(input, { maxLength: 254 })
  if (!strResult.ok) return strResult

  const email = strResult.value.toLowerCase().trim()

  // Simple email pattern (RFC 5322 simplified)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    return { ok: false, error: 'Invalid email format' }
  }

  return { ok: true, value: email }
}

// ────────────────────────────────────────────────────────────────────────────
// JSON Validation
// ────────────────────────────────────────────────────────────────────────────

/**
 * Safely parse and validate JSON
 *
 * @param input - JSON string to parse
 * @param schema - Optional validation schema (reserved for future use)
 * @returns Validation result with parsed object or error
 */
export function validateJSON<T>(
  input: unknown,
  schema?: unknown,
): ValidationResult<T> {
  // String check
  const strResult = validateString(input)
  if (!strResult.ok) return strResult

  try {
    const parsed = JSON.parse(strResult.value)
    return { ok: true, value: parsed as T }
  } catch {
    return { ok: false, error: 'Invalid JSON format' }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Generic Type Guard
// ────────────────────────────────────────────────────────────────────────────

/**
 * Validate that input matches expected type
 *
 * @param input - Value to check
 * @param expectedType - Type name ('string', 'number', 'boolean', 'object', 'array')
 * @returns Validation result
 */
export function validateType(
  input: unknown,
  expectedType: 'string' | 'number' | 'boolean' | 'object' | 'array',
): ValidationResult<unknown> {
  const actualType =
    Array.isArray(input) ? 'array' : typeof input

  if (actualType === expectedType) {
    return { ok: true, value: input }
  }

  return {
    ok: false,
    error: `Expected ${expectedType}, got ${actualType}`,
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Batch Validation Helper
// ────────────────────────────────────────────────────────────────────────────

/**
 * Validate object properties against a schema
 *
 * @param obj - Object to validate
 * @param schema - Schema describing expected properties and their validators
 * @returns Validation result with validated object or first error
 *
 * @example
 *   const schema = {
 *     name: (v) => validateString(v, { minLength: 1, maxLength: 100 }),
 *     age: (v) => validateNumber(v, { min: 0, max: 150, integer: true }),
 *   }
 *   const result = validateObject(obj, schema)
 */
export function validateObject<T extends Record<string, unknown>>(
  obj: unknown,
  schema: Record<string, (value: unknown) => ValidationResult<unknown>>,
): ValidationResult<T> {
  // Object check
  if (typeof obj !== 'object' || obj === null) {
    return { ok: false, error: 'Expected object' }
  }

  const validated: Record<string, unknown> = {}

  // Validate each property
  for (const [key, validator] of Object.entries(schema)) {
    const value = (obj as Record<string, unknown>)[key]
    const result = validator(value)

    if (!result.ok) {
      return {
        ok: false,
        error: `Property "${key}": ${result.error}`,
      }
    }

    validated[key] = result.value
  }

  return { ok: true, value: validated as T }
}
