/**
 * Variant configuration hook for Bingo.
 * Provides access to variant-specific settings and feature flags.
 */

import {
  BINGO_VARIANTS,
  getTimeLimit,
  getTotalNumbers,
  getVariantConfig,
  hasPowerUps,
  supportsPatternBonus,
  supportsSpeedBonus,
  type BingoVariantId,
} from '@games/bingo-domain'
import { useMemo } from 'react'

export interface VariantFeatures {
  hasSpeedBonus: boolean
  hasPatternBonus: boolean
  hasPowerUps: boolean
  hasTimeLimit: boolean
  totalNumbers: number
  timeLimitSeconds?: number
}

export function useVariant(variantId: BingoVariantId) {
  const config = useMemo(() => getVariantConfig(variantId), [variantId])

  const features = useMemo((): VariantFeatures => {
    return {
      hasSpeedBonus: supportsSpeedBonus(variantId),
      hasPatternBonus: supportsPatternBonus(variantId),
      hasPowerUps: hasPowerUps(variantId),
      hasTimeLimit: variantId === 'survival',
      totalNumbers: getTotalNumbers(variantId),
      timeLimitSeconds: variantId === 'survival' ? getTimeLimit(variantId) : undefined,
    }
  }, [variantId])

  return {
    config,
    features,
    variantId,
    allVariants: BINGO_VARIANTS,
  }
}
