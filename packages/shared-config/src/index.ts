/**
 * @games/shared-config — Centralized environment variable management
 *
 * Core principles:
 * - NEVER expose secrets in client code
 * - Whitelist approach: Only explicitly exported variables are available
 * - Type-safe: All config values are typed
 * - Validation: Required values checked at startup
 *
 * CRITICAL RULES:
 * - Never use process.env directly in components
 * - Never import process.env in client code
 * - All public config must be prefixed with VITE_
 * - Private config stays on server only
 *
 * Usage:
 *   import { getConfig } from '@games/shared-config'
 *   const { appName, apiUrl } = getConfig()
 */

// ────────────────────────────────────────────────────────────────────────────
// Configuration Interface
// ────────────────────────────────────────────────────────────────────────────

export interface AppConfig {
  // App Identity
  appName: string
  appVersion: string
  environment: 'development' | 'production'

  // API Configuration (client-safe)
  apiUrl: string
  apiTimeout: number

  // Feature Flags
  enableDebugTools: boolean
  enableAnalytics: boolean
  enableCrashReporting: boolean

  // Build Information
  buildDate: string
  buildRef: string
}

// ────────────────────────────────────────────────────────────────────────────
// Configuration Getter (Memoized)
// ────────────────────────────────────────────────────────────────────────────

let cachedConfig: AppConfig | null = null

/**
 * Get validated application configuration
 *
 * All values are whitelisted and validated at load time
 *
 * @returns Typed configuration object
 * @throws Error if required configuration is missing
 */
export function getConfig(): AppConfig {
  // Return cached config if already loaded
  if (cachedConfig) {
    return cachedConfig
  }

  // Load config from environment (browser: import.meta.env, server: process.env)
  const env = typeof import.meta === 'object' && import.meta.env ? import.meta.env : (process.env as Record<string, string | undefined>)

  const config: AppConfig = {
    // App Identity - always available
    appName: env.VITE_APP_NAME || 'Game Platform',
    appVersion: env.VITE_APP_VERSION || '1.0.0',
    environment: (env.VITE_APP_ENV || 'production') as 'development' | 'production',

    // API Configuration
    apiUrl: env.VITE_API_URL || 'http://localhost:3000/api',
    apiTimeout: parseInt(env.VITE_API_TIMEOUT || '30000', 10),

    // Feature Flags
    enableDebugTools: env.VITE_ENABLE_DEBUG === 'true',
    enableAnalytics: env.VITE_ENABLE_ANALYTICS !== 'false',
    enableCrashReporting: env.VITE_ENABLE_CRASH_REPORTING !== 'false',

    // Build Information
    buildDate: env.VITE_BUILD_DATE || new Date().toISOString(),
    buildRef: env.VITE_BUILD_REF || 'unknown',
  }

  // Validate required configuration
  validateConfig(config)

  // Cache for future calls
  cachedConfig = config

  return config
}

// ────────────────────────────────────────────────────────────────────────────
// Configuration Validation
// ────────────────────────────────────────────────────────────────────────────

/**
 * Validate that required config values are present and valid
 *
 * @throws Error if validation fails
 */
function validateConfig(config: AppConfig): void {
  const errors: string[] = []

  // Validate required fields
  if (!config.appName || config.appName.trim() === '') {
    errors.push('VITE_APP_NAME is required')
  }

  if (!config.apiUrl || config.apiUrl.trim() === '') {
    errors.push('VITE_API_URL is required')
  }

  // Validate formats
  if (!['development', 'production'].includes(config.environment)) {
    errors.push(
      `VITE_APP_ENV must be 'development' or 'production', got: ${config.environment}`,
    )
  }

  if (isNaN(config.apiTimeout) || config.apiTimeout <= 0) {
    errors.push(`VITE_API_TIMEOUT must be a positive number, got: ${config.apiTimeout}`)
  }

  // Throw if any validation errors
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`)
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Safe Environment Accessors (Prevent Accidental Secrets)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Safely get a boolean environment variable
 *
 * Only accessible for whitelisted VITE_ variables
 *
 * @param varName - Environment variable name
 * @param defaultValue - Default if not set
 * @returns Boolean value
 */
export function getBooleanEnv(varName: string, defaultValue: boolean = false): boolean {
  if (!varName.startsWith('VITE_')) {
    console.warn(
      `⚠️ Security: Attempted to access non-whitelisted env var: ${varName}`,
    )
    return defaultValue
  }

  const env = typeof import.meta === 'object' && import.meta.env ? import.meta.env : (process.env as Record<string, string | undefined>)
  const value = env[varName]

  if (value === undefined) return defaultValue
  return value === 'true' || value === '1' || value === 'yes'
}

/**
 * Safely get a string environment variable
 *
 * Only accessible for whitelisted VITE_ variables
 *
 * @param varName - Environment variable name
 * @param defaultValue - Default if not set
 * @returns String value
 */
export function getStringEnv(varName: string, defaultValue: string = ''): string {
  if (!varName.startsWith('VITE_')) {
    console.warn(
      `⚠️ Security: Attempted to access non-whitelisted env var: ${varName}`,
    )
    return defaultValue
  }

  const env = typeof import.meta === 'object' && import.meta.env ? import.meta.env : (process.env as Record<string, string | undefined>)
  return env[varName] ?? defaultValue
}

/**
 * Safely get a numeric environment variable
 *
 * Only accessible for whitelisted VITE_ variables
 *
 * @param varName - Environment variable name
 * @param defaultValue - Default if not set
 * @returns Numeric value
 */
export function getNumberEnv(varName: string, defaultValue: number = 0): number {
  if (!varName.startsWith('VITE_')) {
    console.warn(
      `⚠️ Security: Attempted to access non-whitelisted env var: ${varName}`,
    )
    return defaultValue
  }

  const env = typeof import.meta === 'object' && import.meta.env ? import.meta.env : (process.env as Record<string, string | undefined>)
  const value = env[varName]

  if (value === undefined) return defaultValue
  const num = parseInt(value, 10)
  return isNaN(num) ? defaultValue : num
}

// ────────────────────────────────────────────────────────────────────────────
// Configuration Reset (Testing Only)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Reset cached configuration (testing only)
 *
 * @internal - Do not use in production code
 */
export function resetConfigCache(): void {
  if (process.env.NODE_ENV === 'test') {
    cachedConfig = null
  }
}
