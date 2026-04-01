/**
 * CSP Solver Worker
 * Offloads constraint solving to background thread to avoid UI blocking
 *
 * Handoff: Main thread sends CSP + timeout, worker sends back SolveResult
 * Handles: Solving, generation, propagation
 *
 * This file runs in a Web Worker context (self = worker global scope)
 */

import { BacktrackingSolver } from '../domain/solvers'
import { enforceArcConsistency } from '../domain/propagation'
import { generatePuzzle } from '../domain/generators'
import type {
  WorkerSolveResponse,
  WorkerGenerateResponse,
  WorkerPropagateResponse,
  WorkerError,
  WorkerReady,
} from './messages'

// ============================================================================
// WORKER STATE
// ============================================================================

const WORKER_ID = `worker_${Math.random().toString(36).substring(2, 11)}`
const solver = new BacktrackingSolver({ timeout: 1000 })

// ============================================================================
// MESSAGE HANDLER
// ============================================================================

self.addEventListener('message', (event: MessageEvent) => {
  const msg = event.data

  if (!isWorkerRequest(msg)) {
    handleError(`Invalid message type: ${typeof msg}`, 'UNKNOWN')
    return
  }

  try {
    switch (msg.type) {
      case 'SOLVE_REQUEST':
        handleSolveRequest(msg)
        break
      case 'GENERATE_REQUEST':
        handleGenerateRequest(msg)
        break
      case 'PROPAGATE_REQUEST':
        handlePropagateRequest(msg)
        break
      default:
        handleError(`Unknown request type: ${(msg as any).type}`, (msg as any).requestId)
    }
  } catch (error) {
    handleError(
      `Unhandled error: ${error instanceof Error ? error.message : String(error)}`,
      (msg as any).requestId,
    )
  }
})

// ============================================================================
// REQUEST HANDLERS
// ============================================================================

/**
 * Handle SOLVE_REQUEST: run backtracking solver on CSP
 */
function handleSolveRequest(msg: any) {
  const { csp, timeout, requestId } = msg

  if (!csp) {
    handleError('Missing CSP in SOLVE_REQUEST', requestId)
    return
  }

  // Run solver: CSP → SolveResult
  const result = solver.solve(csp, timeout || 1000)

  const response: WorkerSolveResponse = {
    type: 'SOLVE_RESPONSE',
    result,
    requestId,
    worker: WORKER_ID,
  }

  self.postMessage(response)
}

/**
 * Handle GENERATE_REQUEST: generate random puzzle with target difficulty
 */
function handleGenerateRequest(msg: any) {
  const { templateCSP, difficulty, validateUniqueness, requestId } = msg

  if (!templateCSP) {
    handleError('Missing templateCSP in GENERATE_REQUEST', requestId)
    return
  }

  try {
    const puzzle = generatePuzzle(templateCSP, {
      difficulty,
      validateUniqueness,
      timeout: 5000,
    })

    const response: WorkerGenerateResponse = {
      type: 'GENERATE_RESPONSE',
      puzzle,
      requestId,
      worker: WORKER_ID,
    }

    self.postMessage(response)
  } catch (error) {
    handleError(
      `Generation failed: ${error instanceof Error ? error.message : String(error)}`,
      requestId,
    )
  }
}

/**
 * Handle PROPAGATE_REQUEST: enforce arc consistency on CSP
 */
function handlePropagateRequest(msg: any) {
  const { csp, requestId } = msg

  if (!csp) {
    handleError('Missing CSP in PROPAGATE_REQUEST', requestId)
    return
  }

  try {
    const result = enforceArcConsistency(csp, { timeout: 5000 })

    const response: WorkerPropagateResponse = {
      type: 'PROPAGATE_RESPONSE',
      csp,  // Return modified CSP with reduced domains
      consistent: result.consistent,
      requestId,
      worker: WORKER_ID,
    }

    self.postMessage(response)
  } catch (error) {
    handleError(
      `Propagation failed: ${error instanceof Error ? error.message : String(error)}`,
      requestId,
    )
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Send error response to main thread
 */
function handleError(error: string, requestId: string = 'UNKNOWN') {
  const response: WorkerError = {
    type: 'ERROR',
    error,
    requestId,
    worker: WORKER_ID,
  }

  self.postMessage(response)
}

// Send READY message to indicate worker is initialized
const ready: WorkerReady = {
  type: 'READY',
  worker: WORKER_ID,
}

self.postMessage(ready)
