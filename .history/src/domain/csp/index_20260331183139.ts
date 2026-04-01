/**
 * CSP (Constraint Satisfaction Problem) Core Module
 *
 * Game-agnostic abstractions for all 7 puzzle types.
 * Provides:
 * - Type definitions (CSP, Variable, Domain, Constraint, etc.)
 * - Base constraint classes
 * - Factory functions for CSP creation
 * - Utilities for domain management and constraint querying
 */

// Types
export type {
  CSP,
  Constraint,
  Domain,
  DifficultyMetrics,
  GameState,
  GeneratedPuzzle,
  Hint,
  PuzzleGenerator,
  SolveResult,
  Solver,
  Variable,
} from './types'

export {
  Difficulty,
  PuzzleType,
} from './types'

// Constraints
export {
  BaseConstraint,
  BinaryConstraint,
  ConstraintFactory,
  CustomConstraint,
  DomainConstraint,
  EqualityConstraint,
  InequalityConstraint,
  InclusionConstraint,
  UniqueConstraint,
} from './constraint'

// CSP Utilities
export {
  addConstraint,
  addVariable,
  buildAssignmentFromDomains,
  cloneCSP,
  createCSP,
  generateCellId,
  generateEdgeId,
  generateNodeId,
  getBinaryConstraints,
  getCSPStats,
  getConstraintsForVariable,
  getDomain,
  getHigherOrderConstraints,
  getUnaryConstraints,
  getVariable,
  getAssignedValue,
  isDomainEmpty,
  isAssigned,
  isWellFormed,
  removeFromDomain,
  reduceToValue,
  setClue,
  type CSPStats,
} from './csp'

// Default exports
export { default as Constraint } from './constraint'
export { default as CSPUtilities } from './csp'
