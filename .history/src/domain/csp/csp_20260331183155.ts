/**
 * CSP Factory & Utilities
 *
 * Helper functions for creating, querying, and manipulating CSP instances.
 * Used throughout solvers, generators, and the application layer.
 */

import type { Constraint, CSP, Domain, Variable } from './types'
import { Difficulty, PuzzleType } from './types'

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Simple UUID v4-style generator (crypto-secure would be better in production)
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// ============================================================================
// CSP FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a new empty CSP instance.
 *
 * @param puzzleType Type of puzzle (determines constraint registry)
 * @param difficulty Target difficulty
 * @returns Empty CSP ready for variables/constraints
 */
export function createCSP<T = number | string | boolean>(
  puzzleType: PuzzleType,
  difficulty?: Difficulty,
): CSP<T> {
  return {
    id: generateId(),
    puzzleType,
    variables: [],
    domains: [],
    constraints: [],
    clues: new Map(),
    metadata: {
      difficulty,
      createdAt: Date.now(),
      source: 'generated',
    },
  }
}

/**
 * Add a variable to CSP.
 *
 * @param csp CSP instance
 * @param variable Variable to add
 * @param domainValues Initial domain values
 */
export function addVariable<T = number | string | boolean>(
  csp: CSP<T>,
  variable: Variable,
  domainValues: Set<T>,
): void {
  csp.variables.push(variable)
  csp.domains.push({
    variableId: variable.id,
    possible: new Set(domainValues),
    initial: new Set(domainValues),
  })
}

/**
 * Add constraint to CSP.
 *
 * @param csp CSP instance
 * @param constraint Constraint to add
 */
export function addConstraint(csp: CSP, constraint: Constraint): void {
  // Validate scope variables exist
  const varIds = new Set(csp.variables.map((v) => v.id))
  for (const scopeVarId of constraint.scope) {
    if (!varIds.has(scopeVarId)) {
      throw new Error(
        `Constraint scope includes undefined variable: ${scopeVarId}`,
      )
    }
  }

  csp.constraints.push(constraint)
}

/**
 * Set a clue (initial value) in CSP.
 *
 * @param csp CSP instance
 * @param variableId Variable to set
 * @param value Clue value (immutable)
 */
export function setClue<T = number | string | boolean>(
  csp: CSP<T>,
  variableId: string,
  value: T,
): void {
  // Validate variable exists
  if (!csp.variables.find((v) => v.id === variableId)) {
    throw new Error(`Variable not found: ${variableId}`)
  }

  csp.clues.set(variableId, value)

  // Reduce domain to single value
  const domain = csp.domains.find((d) => d.variableId === variableId)
  if (domain) {
    domain.possible = new Set([value])
  }
}

/**
 * Clone a CSP instance (deep copy).
 * Useful for solver backtracking and puzzle generation.
 */
export function cloneCSP<T = number | string | boolean>(csp: CSP<T>): CSP<T> {
  return {
    id: csp.id,
    puzzleType: csp.puzzleType,
    variables: csp.variables.map((v) => ({
      ...v,
      metadata: { ...v.metadata },
    })),
    domains: csp.domains.map((d) => ({
      ...d,
      possible: new Set(d.possible),
      initial: new Set(d.initial),
    })),
    constraints: csp.constraints,  // Constraints are immutable
    clues: new Map(csp.clues),
    metadata: { ...csp.metadata },
  }
}

// ============================================================================
// DOMAIN MANAGEMENT
// ============================================================================

/**
 * Reduce a variable's domain to a single value.
 * Used by: Constraint propagation, backtracking assignment.
 *
 * @param domain Domain to reduce
 * @param value Value to assign
 * @returns true if reduction successful, false if domain became empty
 */
export function reduceToValue<T = number | string | boolean>(
  domain: Domain,
  value: T,
): boolean {
  if (!domain.possible.has(value)) {
    return false  // Value not in domain
  }
  domain.possible = new Set([value])
  return true
}

/**
 * Remove a value from a variable's domain.
 * Used by: Constraint propagation (arc consistency).
 *
 * @param domain Domain to modify
 * @param value Value to remove
 * @returns true if value was in domain, false if already removed
 */
export function removeFromDomain<T = number | string | boolean>(
  domain: Domain,
  value: T,
): boolean {
  if (!domain.possible.has(value)) {
    return false
  }
  domain.possible.delete(value)
  return domain.possible.size > 0  // true if domain not empty
}

/**
 * Check if a variable's domain is empty (contradiction).
 */
export function isDomainEmpty(domain: Domain): boolean {
  return domain.possible.size === 0
}

/**
 * Get domain for a variable by ID.
 */
export function getDomain(csp: CSP, variableId: string): Domain | undefined {
  return csp.domains.find((d) => d.variableId === variableId)
}

/**
 * Get variable by ID.
 */
export function getVariable(csp: CSP, variableId: string): Variable | undefined {
  return csp.variables.find((v) => v.id === variableId)
}

/**
 * Check if a variable is fully assigned (domain size = 1).
 */
export function isAssigned(domain: Domain): boolean {
  return domain.possible.size === 1
}

/**
 * Get the assigned value (assumes isAssigned = true).
 */
export function getAssignedValue<T = number | string | boolean>(
  domain: Domain,
): T | undefined {
  if (domain.possible.size === 1) {
    return Array.from(domain.possible)[0] as T
  }
  return undefined
}

/**
 * Build full assignment from domains.
 * Only includes assigned variables.
 */
export function buildAssignmentFromDomains(
  csp: CSP,
): Map<string, number | string | boolean> {
  const assignment = new Map<string, number | string | boolean>()

  for (const domain of csp.domains) {
    if (isAssigned(domain)) {
      const value = getAssignedValue(domain)
      if (value !== undefined) {
        assignment.set(domain.variableId, value)
      }
    }
  }

  return assignment
}

// ============================================================================
// CONSTRAINT QUERYING
// ============================================================================

/**
 * Get all constraints involving a variable.
 *
 * @param csp CSP instance
 * @param variableId Variable ID
 * @returns Constraints with this variable in scope
 */
export function getConstraintsForVariable(
  csp: CSP,
  variableId: string,
): Constraint[] {
  return csp.constraints.filter((c) => c.scope.includes(variableId))
}

/**
 * Get all unary constraints (single variable).
 */
export function getUnaryConstraints(csp: CSP): Constraint[] {
  return csp.constraints.filter((c) => c.scope.length === 1)
}

/**
 * Get all binary constraints (two variables).
 */
export function getBinaryConstraints(csp: CSP): Constraint[] {
  return csp.constraints.filter((c) => c.scope.length === 2)
}

/**
 * Get all higher-order constraints (3+ variables).
 */
export function getHigherOrderConstraints(csp: CSP): Constraint[] {
  return csp.constraints.filter((c) => c.scope.length > 2)
}

// ============================================================================
// VALIDATION & STATISTICS
// ============================================================================

/**
 * Check if CSP is well-formed.
 * Validates that all variables and constraints are consistent.
 */
export function isWellFormed(csp: CSP): boolean {
  const varIds = new Set(csp.variables.map((v) => v.id))

  // Check 1: Variables and domains match
  if (csp.variables.length !== csp.domains.length) {
    return false
  }

  // Check 2: All domain variable IDs exist
  for (const domain of csp.domains) {
    if (!varIds.has(domain.variableId)) {
      return false
    }
  }

  // Check 3: All constraint scopes reference existing variables
  for (const constraint of csp.constraints) {
    for (const scopeVarId of constraint.scope) {
      if (!varIds.has(scopeVarId)) {
        return false
      }
    }
  }

  // Check 4: All clues reference existing variables
  for (const clueVarId of csp.clues.keys()) {
    if (!varIds.has(clueVarId)) {
      return false
    }
  }

  return true
}

/**
 * Get CSP statistics for debugging/analysis.
 */
export interface CSPStats {
  variableCount: number
  constraintCount: number
  unaryConstraintsCount: number
  binaryConstraintsCount: number
  higherOrderConstraintsCount: number
  clueCount: number
  avgDomainSize: number
  minDomainSize: number
  maxDomainSize: number
  emptyDomainCount: number
}

export function getCSPStats(csp: CSP): CSPStats {
  const domainSizes = csp.domains.map((d) => d.possible.size)

  return {
    variableCount: csp.variables.length,
    constraintCount: csp.constraints.length,
    unaryConstraintsCount: csp.constraints.filter((c) => c.scope.length === 1)
      .length,
    binaryConstraintsCount: csp.constraints.filter((c) => c.scope.length === 2)
      .length,
    higherOrderConstraintsCount: csp.constraints.filter(
      (c) => c.scope.length > 2,
    ).length,
    clueCount: csp.clues.size,
    avgDomainSize: domainSizes.reduce((a, b) => a + b, 0) / domainSizes.length,
    minDomainSize: Math.min(...domainSizes),
    maxDomainSize: Math.max(...domainSizes),
    emptyDomainCount: domainSizes.filter((s) => s === 0).length,
  }
}

// ============================================================================
// UUID GENERATION (for variable IDs)
// ============================================================================

/**
 * Generate a grid-based variable ID (e.g., "cell_0_0" for row 0, col 0).
 * Used by grid puzzles (Sudoku, Queens, Tango, etc.)
 */
export function generateCellId(row: number, col: number): string {
  return `cell_${row}_${col}`
}

/**
 * Generate an edge variable ID (e.g., "edge_0_0_0_1" for connected cells).
 * Used by path puzzles (Zip, etc.)
 */
export function generateEdgeId(
  row1: number,
  col1: number,
  row2: number,
  col2: number,
): string {
  // Normalize order to ensure consistency
  if (row1 > row2 || (row1 === row2 && col1 > col2)) {
    return `edge_${row2}_${col2}_${row1}_${col1}`
  }
  return `edge_${row1}_${col1}_${row2}_${col2}`
}

/**
 * Generate a node variable ID (e.g., "node_0" for graph node).
 * Used by graph-based puzzles (Crossclimb, Pinpoint, etc.)
 */
export function generateNodeId(index: number): string {
  return `node_${index}`
}

export default {
  createCSP,
  addVariable,
  addConstraint,
  setClue,
  cloneCSP,
  reduceToValue,
  removeFromDomain,
  isDomainEmpty,
  getDomain,
  getVariable,
  isAssigned,
  getAssignedValue,
  buildAssignmentFromDomains,
  getConstraintsForVariable,
  getUnaryConstraints,
  getBinaryConstraints,
  getHigherOrderConstraints,
  isWellFormed,
  getCSPStats,
  generateCellId,
  generateEdgeId,
  generateNodeId,
}
