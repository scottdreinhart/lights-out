/**
 * Bingo game hooks - Shared across all bingo variants
 * 
 * Public API:
 * - useGame: Game state management and control
 * - useVariant: Variant configuration and feature flags
 * - useScoring: Scoring system with bonuses and multipliers
 * - VariantProvider: Context provider for variant configuration
 * - useVariantContext: Hook to access variant context
 */

export { useGame } from './useGame'
export { useVariant } from './useVariant'
export { useScoring } from './useScoring'
export { VariantProvider, useVariantContext } from './VariantContext'

export type { VariantFeatures } from './useVariant'
export type { GameScores, PlayerScore } from './useScoring'
export type { VariantContextValue, VariantProviderProps } from './VariantContext'
