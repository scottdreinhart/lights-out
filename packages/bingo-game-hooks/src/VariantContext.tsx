/**
 * Variant context provider for Bingo.
 * Provides variant configuration to all components without prop drilling.
 */

import { createContext, ReactNode, useContext } from 'react'
import { type BingoVariantId, BINGO_VARIANTS } from '@games/bingo-domain'
import { useVariant } from './useVariant'
import type { VariantFeatures } from './useVariant'

export interface VariantContextValue {
  variantId: BingoVariantId
  config: (typeof BINGO_VARIANTS)[BingoVariantId]
  features: VariantFeatures
}

/**
 * Context for accessing variant configuration throughout the app.
 */
const VariantContext = createContext<VariantContextValue | null>(null)

export interface VariantProviderProps {
  children: ReactNode
  variantId: BingoVariantId
}

/**
 * Provider component for variant context.
 */
export function VariantProvider({ children, variantId }: VariantProviderProps) {
  const { config, features } = useVariant(variantId)

  const value: VariantContextValue = {
    variantId,
    config,
    features,
  }

  return <VariantContext.Provider value={value}>{children}</VariantContext.Provider>
}

/**
 * Hook to access variant context from any component.
 * Throws if used outside VariantProvider.
 */
export function useVariantContext(): VariantContextValue {
  const context = useContext(VariantContext)
  if (!context) {
    throw new Error(
      'useVariantContext must be used within a VariantProvider'
    )
  }
  return context
}
