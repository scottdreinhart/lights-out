/**
 * Arc Consistency Algorithm AC-3
 *
 * Constraint propagation using arc consistency reduces domain sizes
 * BEFORE backtracking search, significantly reducing search space.
 *
 * AC-3 Algorithm:
 * 1. Queue all arcs (X_i, X_j) for each constraint
 * 2. While queue is non-empty:
 *    a. (X_i, X_j) = pop(queue)
 *    b. If REVISE(X_i, X_j) removed values from X_i:
 *       - Check domain wipeout (domain empty = unsolvable)
 *       - Re-queue all arcs (X_k, X_i) for neighbors X_k != X_j
 * 3. Return: consistent (true) or domain wipeout (false)
 *
 * Time: O(ed³) where e = constraints, d = domain size
 * For most puzzles: <500ms even on large domains
 *
 * Reference: Russell & Norvig, "Artificial Intelligence", Algorithm 6.3
 */

import type { CSP, Domain } from '../csp'
import { getDomain, getConstraintsForVariable } from '../csp'

interface ArcConsistencyOptions {
  timeout?: number  // milliseconds
  verbose?: boolean // log revisions
}

interface ACResult {
  consistent: boolean  // true if no domain wipeout
  timeMs: number
  revisions: number    // count of domain reductions
  emptyDomains: string[] // variables with empty domains (if inconsistent)
}

/**
 * AC-3 Arc Consistency Algorithm
 *
 * Reduces variable domains by enforcing arc consistency on all constraints.
 * Called before backtracking search to prune inconsistent values early.
 *
 * @param csp Constraint Satisfaction Problem
 * @param options.timeout milliseconds limit
 * @param options.verbose log revision operations
 * @returns ACResult with consistency status, revisions, timing
 */
export function enforceArcConsistency(
  csp: CSP,
  options: ArcConsistencyOptions = {},
): ACResult {
  const startTime = Date.now()
  const timeout = options.timeout ?? 5000  // 5s default
  const verbose = options.verbose ?? false
  let revisions = 0
  const emptyDomains: string[] = []

  // Build arc queue: (X_i, X_j) for all constraints
  const arcQueue: Array<[string, string]> = []

  for (const constraint of csp.constraints) {
    const scope = constraint.scope

    if (scope.length === 1) {
      // Unary constraint: X_i must satisfy predicate
      // Handle separately (domain reduction, not arc consistency)
      continue
    }

    if (scope.length === 2) {
      // Binary constraint: add both directions
      arcQueue.push([scope[0], scope[1]])
      arcQueue.push([scope[1], scope[0]])
    } else {
      // Higher-order constraint: decompose to pairwise
      // (Approximation: treat as connected pairs)
      for (let i = 0; i < scope.length; i++) {
        for (let j = 0; j < scope.length; j++) {
          if (i !== j) {
            arcQueue.push([scope[i], scope[j]])
          }
        }
      }
    }
  }

  if (verbose) {
    console.log(`[AC-3] Starting with ${arcQueue.length} arcs`)
  }

  // Process arcs
  while (arcQueue.length > 0) {
    // Timeout check
    if (Date.now() - startTime > timeout) {
      if (verbose) {
        console.log(`[AC-3] Timeout after ${revisions} revisions`)
      }
      return {
        consistent: true,  // Assume consistent on timeout (return partial result)
        timeMs: Date.now() - startTime,
        revisions,
        emptyDomains: [],
      }
    }

    const arc = arcQueue.shift()!
    const [Xi, Xj] = arc

    const domainXi = getDomain(csp, Xi)
    const domainXj = getDomain(csp, Xj)

    if (!domainXi || !domainXj) {
      continue  // Variable not in CSP
    }

    // REVISE: remove values from domainXi inconsistent with domainXj
    const beforeSize = domainXi.possible.size
    revise(csp, domainXi, domainXj, Xi, Xj)
    const afterSize = domainXi.possible.size

    if (afterSize === 0) {
      // Domain wipeout: CSP is inconsistent
      emptyDomains.push(Xi)
      if (verbose) {
        console.log(`[AC-3] Domain wipeout at ${Xi}`)
      }
      return {
        consistent: false,
        timeMs: Date.now() - startTime,
        revisions,
        emptyDomains,
      }
    }

    if (afterSize < beforeSize) {
      // Domain was reduced: re-queue neighbors
      revisions++

      const neighbors = getNeighbors(csp, Xi, Xj)
      for (const neighbor of neighbors) {
        arcQueue.push([neighbor, Xi])
      }

      if (verbose) {
        console.log(
          `[AC-3] Reduced ${Xi} to ${afterSize} values, re-queued ${neighbors.length} arcs`,
        )
      }
    }
  }

  if (verbose) {
    console.log(
      `[AC-3] Consistent after ${revisions} revisions in ${Date.now() - startTime}ms`,
    )
  }

  return {
    consistent: true,
    timeMs: Date.now() - startTime,
    revisions,
    emptyDomains: [],
  }
}

/**
 * REVISE(X_i, X_j): Remove values from X_i unsupported by any value in X_j
 *
 * For each value v in domain(X_i):
 *   Check if there exists a value u in domain(X_j) such that (v, u) satisfies all constraints
 *   If no such u exists, remove v from domain(X_i)
 *
 * @param csp CSP instance
 * @param domainXi Domain to revise (may be modified)
 * @param domainXj Domain to check support from
 * @param Xi Variable ID for domain being revised
 * @param Xj Variable ID for support domain
 * @returns true if domain was revised
 */
function revise(
  csp: CSP,
  domainXi: Domain,
  domainXj: Domain,
  Xi: string,
  Xj: string,
): boolean {
  let revised = false

  // Try each value in domainXi
  for (const valueXi of Array.from(domainXi.possible)) {
    // Check if there exists a support (valueXj) for this value
    let hasSupport = false

    for (const valueXj of domainXj.possible) {
      // Check if (valueXi, valueXj) satisfies all constraints between Xi and Xj
      if (isConsistent(csp, Xi, valueXi, Xj, valueXj)) {
        hasSupport = true
        break  // Found support, move to next value
      }
    }

    // If no support found, remove valueXi from domainXi
    if (!hasSupport) {
      domainXi.possible.delete(valueXi)
      revised = true
    }
  }

  return revised
}

/**
 * Check if assignment (Xi=valueXi, Xj=valueXj) satisfies all constraints between Xi and Xj
 *
 * @param csp CSP instance
 * @param Xi Variable ID
 * @param valueXi Value assigned to Xi
 * @param Xj Variable ID
 * @param valueXj Value assigned to Xj
 * @returns true if assignment is consistent with all constraints, false otherwise
 */
function isConsistent(
  csp: CSP,
  Xi: string,
  valueXi: number | string | boolean,
  Xj: string,
  valueXj: number | string | boolean,
): boolean {
  // Get all constraints involving both Xi and Xj
  const constraints = getConstraintsForVariable(csp, Xi)

  // Create partial assignment: {Xi: valueXi, Xj: valueXj}
  const assignment = new Map<string, number | string | boolean>()
  assignment.set(Xi, valueXi)
  assignment.set(Xj, valueXj)

  // Check each constraint
  for (const constraint of constraints) {
    // Only check constraints involving both Xi and Xj
    if (!constraint.scope.includes(Xj)) {
      continue
    }

    // If constraint involves only these two variables, check it fully
    if (constraint.scope.every((varId) => assignment.has(varId))) {
      if (!constraint.isSatisfied(assignment)) {
        return false  // Constraint violated
      }
    }
    // If constraint involves additional variables, assume support exists
    // (full consistency check would need to consider all unassigned variables)
  }

  return true
}

/**
 * Get all neighbors of Xi (variables that share a constraint with Xi, except Xj)
 *
 * @param csp CSP instance
 * @param Xi Variable ID
 * @param Xj Variable to exclude from neighbors
 * @returns Array of neighbor variable IDs
 */
function getNeighbors(csp: CSP, Xi: string, Xj: string): string[] {
  const neighbors = new Set<string>()

  const constraints = getConstraintsForVariable(csp, Xi)
  for (const constraint of constraints) {
    for (const varId of constraint.scope) {
      if (varId !== Xi && varId !== Xj) {
        neighbors.add(varId)
      }
    }
  }

  return Array.from(neighbors)
}

// ============================================================================
// UNARY CONSTRAINT HANDLING
// ============================================================================

/**
 * Apply unary constraints (single-variable predicates) to reduce domains
 *
 * Unary constraints like "cell value must be odd" reduce domain directly
 * without consulting other variables.
 *
 * @param csp CSP instance
 * @param options.timeout milliseconds limit
 * @returns true if consistent, false if domain wipeout
 */
export function enforceUnaryConstraints(
  csp: CSP,
  options: ArcConsistencyOptions = {},
): boolean {
  const timeout = options.timeout ?? 1000
  const startTime = Date.now()

  for (const constraint of csp.constraints) {
    if (constraint.scope.length !== 1) {
      continue  // Skip non-unary constraints
    }

    const varId = constraint.scope[0]
    const domain = getDomain(csp, varId)
    if (!domain) continue

    // Apply unary constraint: remove values that don't satisfy it
    const toRemove: Array<number | string | boolean> = []

    for (const value of domain.possible) {
      const assignment = new Map<string, number | string | boolean>()
      assignment.set(varId, value)

      if (!constraint.isSatisfied(assignment)) {
        toRemove.push(value)
      }
    }

    // Remove unsupported values
    for (const value of toRemove) {
      domain.possible.delete(value)
    }

    // Check domain wipeout
    if (domain.possible.size === 0) {
      return false
    }

    // Timeout check
    if (Date.now() - startTime > timeout) {
      return true  // Assume consistent on timeout
    }
  }

  return true
}

export type { ACResult, ArcConsistencyOptions }
