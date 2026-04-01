/**
 * crashLogger — dev-only crash and error logging utility
 * Stores error logs in localStorage for dev inspection
 * All functions are no-ops in production
 */

const IS_DEV: boolean =
  typeof import.meta !== 'undefined' && (import.meta.env as Record<string, unknown>)?.DEV === true

export type CrashLogLevel = 'error' | 'warn'

export interface CrashLogEntry {
  timestamp: number
  area: string
  message: string
  details?: string
}

const STORAGE_KEY = 'app-crash-logs'
const FATAL_STORAGE_KEY = 'app-fatal-crash'
const LIMIT = 30

function stringifyDetails(details: unknown): string | undefined {
  if (!details) {
    return undefined
  }
  if (details instanceof Error) {
    return details.stack ?? details.message
  }
  try {
    return JSON.stringify(details)
  } catch {
    return String(details)
  }
}

function loadLogs(): CrashLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CrashLogEntry[]) : []
  } catch {
    return []
  }
}

function saveLogs(logs: CrashLogEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, LIMIT)))
  } catch {
    return
  }
}

/**
 * Log a crash/error to development logs
 * No-op in production
 */
export function logCrash(
  area: string,
  error: unknown,
  details?: unknown,
  level: CrashLogLevel = 'error',
): void {
  if (!IS_DEV) {
    return
  }
  const message = error instanceof Error ? error.message : String(error)
  const entry: CrashLogEntry = {
    timestamp: Date.now(),
    area,
    message,
    details: stringifyDetails(details),
  }
  saveLogs([entry, ...loadLogs()])
  if (level === 'warn') {
    console.warn(`[CrashLog:${area}]`, message, details)
  } else {
    console.error(`[CrashLog:${area}]`, message, details)
  }
}

/**
 * Get all crash logs from localStorage
 * Returns empty array in production
 */
export function getCrashLogs(): CrashLogEntry[] {
  return IS_DEV ? loadLogs() : []
}

/**
 * Clear all crash logs from localStorage
 * No-op in production
 */
export function clearCrashLogs(): void {
  if (!IS_DEV) {
    return
  }
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    return
  }
}

/**
 * Mark a fatal crash (stored separately in sessionStorage)
 * No-op in production
 */
export function markFatalCrash(error: unknown): void {
  if (!IS_DEV) {
    return
  }
  const message = error instanceof Error ? error.message : String(error)
  try {
    sessionStorage.setItem(FATAL_STORAGE_KEY, JSON.stringify({ timestamp: Date.now(), message }))
  } catch {
    return
  }
}

/**
 * Get fatal crash info if available
 * Returns null in production or if no fatal crash was recorded
 */
export function getFatalCrash(): { timestamp: number; message: string } | null {
  if (!IS_DEV) {
    return null
  }
  try {
    const raw = sessionStorage.getItem(FATAL_STORAGE_KEY)
    if (!raw) {
      return null
    }
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return null
    }
    const p = parsed as Record<string, unknown>
    return {
      timestamp: Number.isFinite(p['timestamp']) ? (p['timestamp'] as number) : Date.now(),
      message: typeof p['message'] === 'string' ? (p['message'] as string) : 'Unknown fatal crash',
    }
  } catch {
    return null
  }
}

/**
 * Clear fatal crash info from sessionStorage
 * No-op in production
 */
export function clearFatalCrash(): void {
  if (!IS_DEV) {
    return
  }
  try {
    sessionStorage.removeItem(FATAL_STORAGE_KEY)
  } catch {
    return
  }
}
