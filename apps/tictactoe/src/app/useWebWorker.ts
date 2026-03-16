import { useCallback, useEffect, useRef } from 'react'

interface UseWebWorkerReturn {
  postMessage: (data: unknown) => void
  setOnMessage: (handler: ((event: MessageEvent) => void) | null) => void
  workerRef: React.RefObject<Worker | null>
}

const useWebWorker = (factory: () => Worker): UseWebWorkerReturn => {
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    const worker = factory()
    worker.onerror = (e) => {
      console.error('[useWebWorker] Worker error:', e.message, e)
    }
    workerRef.current = worker

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const postMessage = useCallback((data: unknown) => {
    workerRef.current?.postMessage(data)
  }, [])

  const setOnMessage = useCallback((handler: ((event: MessageEvent) => void) | null) => {
    if (workerRef.current) {
      workerRef.current.onmessage = handler
    }
  }, [])

  return { postMessage, setOnMessage, workerRef }
}

export default useWebWorker
