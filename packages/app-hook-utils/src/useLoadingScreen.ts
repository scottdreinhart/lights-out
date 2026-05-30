/**
 * useLoadingScreen — Manage full-screen loading state
 *
 * Usage:
 *   const { isLoading, setIsLoading } = useLoadingScreen()
 *   return <LoadingOverlay isVisible={isLoading} />
 */

import { useState, useCallback } from 'react'

export interface UseLoadingScreenOptions {
  initialMessage?: string
  showSpinner?: boolean
  showProgress?: boolean
}

export interface UseLoadingScreenState {
  isLoading: boolean
  progress: number
  message: string
  error: Error | null
}

export function useLoadingScreen(options: UseLoadingScreenOptions = {}) {
  const {
    initialMessage = 'Loading...',
    showSpinner = true,
    showProgress = false,
  } = options

  void showSpinner
  void showProgress

  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState(initialMessage)
  const [error, setError] = useState<Error | null>(null)

  const reset = useCallback(() => {
    setIsLoading(false)
    setProgress(0)
    setMessage(initialMessage)
    setError(null)
  }, [initialMessage])

  const startLoading = useCallback((msg?: string) => {
    setIsLoading(true)
    if (msg) setMessage(msg)
    setProgress(0)
    setError(null)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  const setError_ = useCallback((err: Error | null) => {
    setError(err)
    if (err) setIsLoading(false)
  }, [])

  return {
    isLoading,
    setIsLoading,
    progress,
    setProgress,
    message,
    setMessage,
    error,
    setError: setError_,
    reset,
    startLoading,
    stopLoading,
  }
}
