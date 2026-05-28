// Sources: https://github.com/loociano/tamagotchi-tech-specs/blob/master/index.md and
// https://tamagotchi.fandom.com/wiki/Care

import type { VariantProfile, VariantRegistry } from '../variant.interface'
import { angelVariant } from './angel'
import { oceanVariant } from './ocean'
import { originalVariant } from './original'

export const variantRegistry: VariantRegistry = {
  original: originalVariant,
  angel: angelVariant,
  ocean: oceanVariant,
}

export function getVariantProfile(variantId: VariantProfile['id']): VariantProfile {
  switch (variantId) {
    case 'angel':
      return angelVariant
    case 'ocean':
      return oceanVariant
    case 'original':
    default:
      return originalVariant
  }
}

export { angelVariant } from './angel'
export { oceanVariant } from './ocean'
export { originalVariant } from './original'
