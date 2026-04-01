/**
 * Constraint Propagation - Public API
 * Export all propagation algorithms (AC-3, future extensions)
 */

export { enforceArcConsistency, enforceUnaryConstraints } from './arc-consistency'
export type { ACResult, ArcConsistencyOptions } from './arc-consistency'
