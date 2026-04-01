/**
 * Backtracking Solver with MRV (Minimum Remaining Values) Heuristic
 *
 * Standard CSP solving algorithm:
 * 1. Select unassigned variable with smallest domain (MRV)
 * 2. Order values by least-constraining-value heuristic
 * 3. Backtrack on constraint violation
 * 4. Target: <100ms for small boards (9×4 Sudoku)
 *
 * Reference: Russell & Norvig, "Artificial Intelligence: A Modern Approach"
 */

import type { CSP, Solver, SolveResult } from '../csp'
import {
  getAssignedValue,
  buildAssignmentFromDomains,
  isAssigned,
  getDomain,
  cloneCSP,
  getConstraintsForVariable,
} from '../csp'

interface BacktrackingSolverOptions {
  timeout?: number  // milliseconds
  verbose?: boolean // log decisions
}

/**
 * Backtracking solver implementation.
 * Uses MRV heuristic for variable selection + LCV for value ordering.
 */
export class BacktrackingSolver implements Solver {
  name = 'backtracking_mrv'
  complexity: 'EXPONENTIAL' = 'EXPONENTIAL'

  private timeout: number
  private verbose: boolean

  constructor(options: BacktrackingSolverOptions = {}) {
    this.timeout = options.timeout ?? 1000  // Default 1 second
    this.verbose = options.verbose ?? false
  }

  /**
   * Solve CSP using backtracking with MRV heuristic.
   * Returns either complete solution or partial assignment on timeout.
   */
  solve(csp: CSP, timeout?: number): SolveResult {
    const startTime = Date.now()
    const effectiveTimeout = timeout ?? this.timeout
    let iterations = 0

    // Clone to avoid mutating input
    const workingCSP = cloneCSP(csp)

    // Track decision path for debugging
    const decisionPath: string[] = []
    const conflictPath: string[] = []

    /**
     * Core backtracking algorithm.
     * Returns true if complete assignment found, false if backtrack needed.
     */
    const backtrack = (): boolean => {
      // Check timeout
      if (Date.now() - startTime > effectiveTimeout) {
        return false  // Soft timeout
      }

      iterations++

      // Check if complete assignment (all variables assigned)
      const completeAssignment = workingCSP.variables.every((variable) => {
        const domain = getDomain(workingCSP, variable.id)
        return domain && isAssigned(domain)
      })

      if (completeAssignment) {
        return true  // Solution found!
      }

      // Select unassigned variable using MRV heuristic
      const unassignedVar = selectUnassignedVariable(workingCSP)
      if (!unassignedVar) {
        return false  // No unassigned variables but not complete (shouldn't happen)
      }

      const varDomain = getDomain(workingCSP, unassignedVar.id)
      if (!varDomain || varDomain.possible.size === 0) {
        // Domain wipeout (contradiction)
        conflictPath.push(`${unassignedVar.id}: empty domain`)
        return false
      }

      // Order values by least-constraining-value heuristic
      const orderedValues = orderValuesByLCV(workingCSP, unassignedVar.id, varDomain)

      // Try each value in order
      for (const value of orderedValues) {
        // Save current domains for backtracking
        const savedDomains = saveDomainState(workingCSP)

        // Assign value
        varDomain.possible = new Set([value])
        decisionPath.push(`${unassignedVar.id} = ${value}`)

        // Check constraints involving this variable
        const isConsistent = checkConsistency(workingCSP, unassignedVar.id)

        if (isConsistent && backtrack()) {
          return true  // Found solution with this assignment
        }

        // Backtrack: restore domains
        restoreDomainState(workingCSP, savedDomains)
        decisionPath.pop()

        if (this.verbose) {
          console.log(`Backtracked from ${unassignedVar.id} = ${value}`)
        }
      }

      return false  // No value worked, backtrack further
    }

    // Run backtracking
    const solved = backtrack()

    // Build final assignment
    const assignment = buildAssignmentFromDomains(workingCSP)

    const timeMs = Date.now() - startTime

    if (this.verbose) {
      console.log(
        `[${this.name}] Solved: ${solved}, Iterations: ${iterations}, Time: ${timeMs}ms`,
      )
    }

    return {
      solved,
      assignment,
      iterations,
      timeMs,
      decisionPath: solved ? decisionPath : undefined,
      conflictPath: conflictPath.length > 0 ? conflictPath : undefined,
      metadata: {
        solver: this.name,
        branchingFactor: calculateBranchingFactor(iterations, decisionPath.length),
      },
    }
  }

  /**
   * Estimate difficulty without full solve (optional optimization).
   * Returns difficulty score 0-100 based on domain sizes.
   */
  getEstimatedDifficulty(csp: CSP): number {
    const domainSizes = csp.domains.map((d) => d.possible.size)
    const avgDomainSize = domainSizes.reduce((a, b) => a + b, 0) / domainSizes.length

    // Simple heuristic: larger avg domain = more choices = harder
    // Scale to 0-100
    const maxPossibleDomainSize = Math.max(...domainSizes)
    return Math.min(100, (avgDomainSize / maxPossibleDomainSize) * 100)
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Select unassigned variable using MRV (Minimum Remaining Values) heuristic.
 * Chooses the variable with smallest domain (fewest choices = early constraint detection).
 *
 * @param csp Working CSP instance
 * @returns Unassigned variable with minimum domain size, or undefined
 */
function selectUnassignedVariable(csp: CSP) {
  let minVar = null
  let minDomainSize = Infinity

  for (const variable of csp.variables) {
    const domain = getDomain(csp, variable.id)
    if (!domain) continue

    // Skip assigned variables
    if (isAssigned(domain)) continue

    // Track minimum
    if (domain.possible.size < minDomainSize) {
      minDomainSize = domain.possible.size
      minVar = variable
    }
  }

  return minVar
}

/**
 * Order values by LCV (Least-Constraining-Value) heuristic.
 * Values that eliminate fewest choices in neighboring variables come first.
 *
 * @param csp Working CSP instance
 * @param variableId Variable being assigned
 * @param domain Domain to order
 * @returns Array of values ordered by LCV
 */
function orderValuesByLCV(
  csp: CSP,
  variableId: string,
  domain: { possible: Set<number | string | boolean> },
): Array<number | string | boolean> {
  const values = Array.from(domain.possible)

  // If small domain, use natural order (optimization)
  if (values.length <= 2) return values

  // Score each value by counting eliminated neighbors
  const valueScores: Array<[value: number | string | boolean, score: number]> = []

  for (const value of values) {
    // Count how many neighbor values would still be possible after assigning this value
    let remainingNeighborChoices = 0

    const constraints = getConstraintsForVariable(csp, variableId)
    for (const constraint of constraints) {
      for (const neighborVarId of constraint.scope) {
        if (neighborVarId === variableId) continue

        const neighborDomain = getDomain(csp, neighborVarId)
        if (!neighborDomain || isAssigned(neighborDomain)) continue

        // Count how many values would still be valid
        // (This is a rough heuristic; full LCV would check each value)
        remainingNeighborChoices += neighborDomain.possible.size
      }
    }

    valueScores.push([value, remainingNeighborChoices])
  }

  // Sort by least-constraining (highest remaining choices come first)
  valueScores.sort((a, b) => b[1] - a[1])

  return valueScores.map(([value]) => value)
}

/**
 * Check if assignment respects all constraints.
 * Used to prune inconsistent assignments early.
 *
 * @param csp Working CSP
 * @param variableId Recently assigned variable
 * @returns true if consistent, false if violation found
 */
function checkConsistency(csp: CSP, variableId: string): boolean {
  // Get all constraints involving this variable
  const constraints = getConstraintsForVariable(csp, variableId)

  // Build current assignment (only assigned variables)
  const assignment = new Map<string, number | string | boolean>()
  for (const variable of csp.variables) {
    const domain = getDomain(csp, variable.id)
    if (domain && isAssigned(domain)) {
      const value = getAssignedValue(domain)
      if (value !== undefined) {
        assignment.set(variable.id, value)
      }
    }
  }

  // Check each constraint
  for (const constraint of constraints) {
    // If constraint is fully assigned, check satisfaction
    if (constraint.scope.every((varId) => assignment.has(varId))) {
      if (!constraint.isSatisfied(assignment)) {
        return false  // Constraint violated
      }
    }

    // If constraint is partially assigned, check for early failure
    // (e.g., uniqueness violation if two assigned variables in constraint have same value)
    if (constraint.name === 'unique') {
      const assignedVars = constraint.scope.filter((varId) => assignment.has(varId))
      const assignedValues = assignedVars.map((varId) => assignment.get(varId))
      const uniqueValues = new Set(assignedValues)

      if (assignedValues.length !== uniqueValues.size) {
        return false  // Duplicate found in unique constraint
      }
    }
  }

  return true
}

/**
 * Save current domain state for backtracking.
 * Creates deep copy of all domain possible sets.
 *
 * @param csp CSP instance
 * @returns Domain state snapshot
 */
function saveDomainState(
  csp: CSP,
): Map<string, Set<number | string | boolean>> {
  const saved = new Map<string, Set<number | string | boolean>>()

  for (const domain of csp.domains) {
    saved.set(domain.variableId, new Set(domain.possible))
  }

  return saved
}

/**
 * Restore domain state after backtracking.
 *
 * @param csp CSP instance
 * @param saved Saved state from saveDomainState()
 */
function restoreDomainState(
  csp: CSP,
  saved: Map<string, Set<number | string | boolean>>,
): void {
  for (const domain of csp.domains) {
    const savedPossible = saved.get(domain.variableId)
    if (savedPossible) {
      domain.possible = new Set(savedPossible)
    }
  }
}

/**
 * Calculate average branching factor.
 * Low factor = good pruning, high factor = many backtr tracks.
 *
 * @param iterations Total iterations
 * @param decisionCount Total decisions made
 * @returns Estimated branching factor
 */
function calculateBranchingFactor(iterations: number, decisionCount: number): number {
  if (decisionCount === 0) return 1
  return Math.pow(iterations, 1 / decisionCount)
}

export default BacktrackingSolver
