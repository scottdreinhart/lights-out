/**
 * useViewLoader — Load async data with loading/error/success states
 *
 * Usage:
 *   const { isLoading, data, error, retry } = useViewLoader(() => fetchGameData())
 *   return (
 *     <div>
 *       {isLoading && <Spinner />}
 *       {error && <ErrorMessage onRetry={retry} />}
 *       {data && <GameView data={data} />}
 *     </div>
 *   )
 */

import { useState, useCallback, useEffect } from 'react'

export interface UseViewLoaderOptions<T> {
  onError?: (error: Error) => void
  onSuccess?: (data: T) => void
  autoLoad?: boolean
}

export function useViewLoader<T>(
  loadFn: () => Promise<T>,
  options: UseViewLoaderOptions<T> = {},
) {
  const { onError, onSuccess, autoLoad = true } = options

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await loadFn()
      setData(result)
      onSuccess?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [loadFn, onError, onSuccess])

  const retry = useCallback(() => load(), [load])

  useEffect(() => {
    if (autoLoad) {
      load()
    }
  }, [])

  return {
    isLoading,
    data,
    error,
    retry,
    setData,
  }
}
