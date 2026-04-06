/**
 * @games/shared-api-client — Centralized HTTP client with security defaults
 *
 * Core principles:
 * - Security by default (validates requests/responses, no exposed errors)
 * - Consistent error handling across all API calls
 * - No direct fetch() usage in application code
 * - CSRF protection ready (for future backend integration)
 * - Timeout enforcement
 *
 * Usage:
 *   import { createApiClient } from '@games/shared-api-client'
 *
 *   const api = createApiClient('http://api.example.com')
 *   const result = await api.get('/users/123')
 *   if (result.ok) {
 *     console.log(result.data)
 *   } else {
 *     console.error(result.error.message)
 *   }
 */

import { getConfig } from '@games/shared-config'
import { validateJSON } from '@games/shared-validators'

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  ok: true
  data: T
  status: number
  headers: Record<string, string>
}

export interface ApiError {
  ok: false
  error: {
    message: string
    code: string
    status: number
    details?: unknown
  }
}

export type ApiResult<T> = ApiSuccess<T> | ApiError

export interface ApiClientOptions {
  baseUrl: string
  timeout?: number
  headers?: Record<string, string>
  validateStatus?: (status: number) => boolean
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
}

// ────────────────────────────────────────────────────────────────────────────
// API Client Factory
// ────────────────────────────────────────────────────────────────────────────

/**
 * Create a configured API client instance
 *
 * @param options - Client configuration
 * @returns API client with get, post, put, delete methods
 *
 * @example
 *   const api = createApiClient({
 *     baseUrl: 'http://api.example.com',
 *     timeout: 30000,
 *     headers: { 'X-App-Version': '1.0' }
 *   })
 */
export function createApiClient(options: ApiClientOptions): ApiClient {
  return new ApiClient(options)
}

// ────────────────────────────────────────────────────────────────────────────
// API Client Class
// ────────────────────────────────────────────────────────────────────────────

export class ApiClient {
  private baseUrl: string
  private timeout: number
  private defaultHeaders: Record<string, string>
  private validateStatus: (status: number) => boolean

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '') // Remove trailing slash
    this.timeout = options.timeout ?? getConfig().apiTimeout
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
    this.validateStatus = options.validateStatus ?? ((status) => status >= 200 && status < 300)
  }

  /**
   * GET request
   */
  async get<T>(path: string, options?: RequestOptions): Promise<ApiResult<T>> {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  /**
   * POST request
   */
  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
    return this.request<T>(path, { ...options, method: 'POST', body })
  }

  /**
   * PUT request
   */
  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
    return this.request<T>(path, { ...options, method: 'PUT', body })
  }

  /**
   * DELETE request
   */
  async delete<T>(path: string, options?: RequestOptions): Promise<ApiResult<T>> {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  }

  /**
   * PATCH request
   */
  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResult<T>> {
    return this.request<T>(path, { ...options, method: 'PATCH', body })
  }

  /**
   * Core request handler with security practices
   *
   * @private
   */
  private async request<T>(path: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
    const url = this.buildUrl(path)
    const method = options.method ?? 'GET'
    const timeout = options.timeout ?? this.timeout
    const headers = this.buildHeaders(options.headers)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      // Build request
      const fetchOptions: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      }

      // Add body if present (and not a GET request)
      if (options.body && method !== 'GET') {
        fetchOptions.body = JSON.stringify(options.body)
      }

      // Execute request
      const response = await fetch(url, fetchOptions)

      // Clear timeout
      clearTimeout(timeoutId)

      // Parse response
      let data: unknown
      const contentType = response.headers.get('content-type')

      if (contentType?.includes('application/json')) {
        const text = await response.text()
        const validation = validateJSON(text)
        data = validation.ok ? validation.value : null
      } else {
        data = await response.text()
      }

      // Validate status
      if (!this.validateStatus(response.status)) {
        return {
          ok: false,
          error: {
            message: `HTTP ${response.status}: ${response.statusText}`,
            code: `HTTP_${response.status}`,
            status: response.status,
            details: data,
          },
        }
      }

      // Return success
      return {
        ok: true,
        data: data as T,
        status: response.status,
        headers: this.parseHeaders(response.headers),
      }
    } catch (err) {
      // Clear timeout
      clearTimeout(timeoutId)

      // Handle abort (timeout)
      if (err instanceof DOMException && err.name === 'AbortError') {
        return {
          ok: false,
          error: {
            message: `Request timeout after ${timeout}ms`,
            code: 'TIMEOUT',
            status: 0,
          },
        }
      }

      // Handle network errors
      return {
        ok: false,
        error: {
          message:
            err instanceof Error
              ? err.message
              : 'Network error',
          code: 'NETWORK_ERROR',
          status: 0,
        },
      }
    }
  }

  /**
   * Build full URL from base and path
   *
   * @private
   */
  private buildUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${this.baseUrl}${normalizedPath}`
  }

  /**
   * Merge default and custom headers
   *
   * @private
   */
  private buildHeaders(custom?: Record<string, string>): Record<string, string> {
    return { ...this.defaultHeaders, ...custom }
  }

  /**
   * Parse response headers into object
   *
   * @private
   */
  private parseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {}
    headers.forEach((value, key) => {
      result[key] = value
    })
    return result
  }
}
