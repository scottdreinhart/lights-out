/**
 * Worker Message Protocol
 * Shared message types for worker <-> main thread communication
 *
 * Messages use discriminated unions for type safety
 */

import type { CSP, SolveResult, GeneratedPuzzle } from '../domain/csp'

// ============================================================================
// OUTBOUND MESSAGES (Main → Worker)
// ============================================================================

export interface WorkerSolveRequest {
  type: 'SOLVE_REQUEST'
  csp: CSP
  timeout: number
  requestId: string
}

export interface WorkerGenerateRequest {
  type: 'GENERATE_REQUEST'
  templateCSP: CSP
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
  validateUniqueness: boolean
  requestId: string
}

export interface WorkerPropagateRequest {
  type: 'PROPAGATE_REQUEST'
  csp: CSP
  requestId: string
}

export type WorkerRequest = WorkerSolveRequest | WorkerGenerateRequest | WorkerPropagateRequest

// ============================================================================
// INBOUND MESSAGES (Worker → Main)
// ============================================================================

export interface WorkerSolveResponse {
  type: 'SOLVE_RESPONSE'
  result: SolveResult
  requestId: string
  worker: string
}

export interface WorkerGenerateResponse {
  type: 'GENERATE_RESPONSE'
  puzzle: GeneratedPuzzle | null
  requestId: string
  worker: string
}

export interface WorkerPropagateResponse {
  type: 'PROPAGATE_RESPONSE'
  csp: CSP
  consistent: boolean
  requestId: string
  worker: string
}

export interface WorkerError {
  type: 'ERROR'
  error: string
  requestId: string
  worker: string
}

export interface WorkerReady {
  type: 'READY'
  worker: string
}

export type WorkerResponse =
  | WorkerSolveResponse
  | WorkerGenerateResponse
  | WorkerPropagateResponse
  | WorkerError
  | WorkerReady

// ============================================================================
// UTILS
// ============================================================================

/**
 * Type guard: check if message is a request
 */
export function isWorkerRequest(msg: unknown): msg is WorkerRequest {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    'type' in msg &&
    ['SOLVE_REQUEST', 'GENERATE_REQUEST', 'PROPAGATE_REQUEST'].includes(
      (msg as any).type,
    )
  )
}

/**
 * Type guard: check if message is a response
 */
export function isWorkerResponse(msg: unknown): msg is WorkerResponse {
  return (
    typeof msg === 'object' &&
    msg !== null &&
    'type' in msg &&
    ['SOLVE_RESPONSE', 'GENERATE_RESPONSE', 'PROPAGATE_RESPONSE', 'ERROR', 'READY'].includes(
      (msg as any).type,
    )
  )
}

/**
 * Generate unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
