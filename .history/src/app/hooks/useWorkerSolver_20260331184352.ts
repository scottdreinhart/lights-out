/**
 * useWorkerSolver Hook
 * Manages CSP solver worker lifecycle and request/response coordination
 *
 * Usage:
 *   const { solve, generate, propagate, isReady } = useWorkerSolver()
 *   const result = await solve(csp, 1000)
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import type { CSP, SolveResult, GeneratedPuzzle } from '@/domain/csp'
import type { Difficulty } from '@/domain/csp'
import type {
  WorkerRequest,
  WorkerResponse,
  WorkerSolveResponse,
  WorkerGenerateResponse,
  WorkerPropagateResponse,
} from '../messages'
import { generateRequestId, isWorkerResponse } from '../messages'

interface PendingRequest {
  resolve: (value: any) => void
  reject: (reason?: any) => void
  timeout: NodeJS.Timeout
}

/**
 * useWorkerSolver - manage solver worker
 *
 * Creates and manages lifecycle of CSP solver worker
 * Coordinates request/response via Promise-based API
 *
 * @returns Object with solve, generate, propagate methods and isReady flag
 */
export function useWorkerSolver() {
  const workerRef = useRef<Worker | null>(null)
  const pendingRef = useRef<Map<string, PendingRequest>>(new Map())
  const [isReady, setIsReady] = useState(false)

  // Initialize worker on mount
  useEffect(() => {
    // Import worker as module (Vite-specific)
    const SolverWorker = new Worker(new URL('../solver.worker.ts', import.meta.url), {
      type: 'module',
    })

    const handleMessage = (event: MessageEvent<WorkerResponse>) => {
      const msg = event.data

      if (!isWorkerResponse(msg)) {
        console.warn('[useWorkerSolver] Invalid response from worker:', msg)
        return
      }

      // Handle READY signal
      if (msg.type === 'READY') {
        setIsReady(true)
        return
      }

      // Handle response for pending request
      const requestId = msg.requestId || 'UNKNOWN'
      const pending = pendingRef.current.get(requestId)

      if (!pending) {
        console.warn(`[useWorkerSolver] No pending request for ${requestId}`)
        return
      }

      // Clear timeout
      clearTimeout(pending.timeout)
      pendingRef.current.delete(requestId)

      // Handle error
      if (msg.type === 'ERROR') {
        pending.reject(new Error(msg.error))
        return
      }

      // Resolve with response data
      switch (msg.type) {
        case 'SOLVE_RESPONSE':
          pending.resolve((msg as WorkerSolveResponse).result)
          break
        case 'GENERATE_RESPONSE':
          pending.resolve((msg as WorkerGenerateResponse).puzzle)
          break
        case 'PROPAGATE_RESPONSE':
          pending.resolve({
            csp: (msg as WorkerPropagateResponse).csp,
            consistent: (msg as WorkerPropagateResponse).consistent,
          })
          break
      }
    }

    const handleError = (event: ErrorEvent) => {
      console.error('[useWorkerSolver] Worker error:', event.message)
      // Reject all pending requests on error
      pendingRef.current.forEach(({ reject, timeout }) => {
        clearTimeout(timeout)
        reject(new Error(`Worker error: ${event.message}`))
      })
      pendingRef.current.clear()
    }

    SolverWorker.addEventListener('message', handleMessage)
    SolverWorker.addEventListener('error', handleError)

    workerRef.current = SolverWorker

    return () => {
      SolverWorker.removeEventListener('message', handleMessage)
      SolverWorker.removeEventListener('error', handleError)
      SolverWorker.terminate()
      setIsReady(false)
    }
  }, [])

  /**
   * Post request to worker and return Promise
   */
  const postRequest = useCallback(
    (request: WorkerRequest, timeoutMs: number = 10000): Promise<any> => {
      if (!workerRef.current) {
        return Promise.reject(new Error('[useWorkerSolver] Worker not initialized'))
      }

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          pendingRef.current.delete(request.requestId)
          reject(new Error(`[useWorkerSolver] Request ${request.requestId} timed out`))
        }, timeoutMs)

        pendingRef.current.set(request.requestId, { resolve, reject, timeout })
        workerRef.current!.postMessage(request)
      })
    },
    [],
  )

  /**
   * Solve CSP asynchronously
   */
  const solve = useCallback(
    async (csp: CSP, timeout: number = 1000): Promise<SolveResult> => {
      const requestId = generateRequestId()
      const request: any = {
        type: 'SOLVE_REQUEST',
        csp,
        timeout,
        requestId,
      }
      return postRequest(request, timeout + 500)
    },
    [postRequest],
  )

  /**
   * Generate puzzle asynchronously
   */
  const generate = useCallback(
    async (
      templateCSP: CSP,
      difficulty: Difficulty,
      validateUniqueness: boolean = false,
    ): Promise<GeneratedPuzzle | null> => {
      const requestId = generateRequestId()
      const request: any = {
        type: 'GENERATE_REQUEST',
        templateCSP,
        difficulty,
        validateUniqueness,
        requestId,
      }
      return postRequest(request, 10000)  // 10s timeout for generation
    },
    [postRequest],
  )

  /**
   * Propagate constraints asynchronously
   */
  const propagate = useCallback(
    async (csp: CSP): Promise<{ csp: CSP; consistent: boolean }> => {
      const requestId = generateRequestId()
      const request: any = {
        type: 'PROPAGATE_REQUEST',
        csp,
        requestId,
      }
      return postRequest(request, 6000)  // 6s timeout for propagation
    },
    [postRequest],
  )

  return {
    solve,
    generate,
    propagate,
    isReady,
  }
}

export type { PendingRequest }
