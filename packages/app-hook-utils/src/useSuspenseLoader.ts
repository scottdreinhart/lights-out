/**
 * useSuspenseLoader — React 18 Suspense-compatible data loader
 *
 * Usage:
 *   const data = useSuspenseLoader(promise)
 *   return <div>{data}</div>
 *   // Wrap in Suspense boundary
 */

import { use } from 'react'

/**
 * Unwrap a promise for use in Suspense-enabled components
 * The promise should be created outside the component
 *
 * @example
 * const promise = fetchDataPromise()
 * function Component() {
 *   const data = useSuspenseLoader(promise)
 *   return <div>{data}</div>
 * }
 */
export function useSuspenseLoader<T>(promise: Promise<T> | null): T | null {
  if (!promise) {
    return null
  }

  return use(promise)
}
