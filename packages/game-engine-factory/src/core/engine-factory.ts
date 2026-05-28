import type { ArchetypeId, EngineConfig, EngineTemplate } from './contracts'
import { ARCHETYPE_MATRIX } from '../archetypes/matrix'
import { createTemplate } from '../archetypes/templates'
import { VARIANT_CATALOG } from '../variants/catalog'

export const listArchetypes = (): readonly ArchetypeId[] => Object.keys(ARCHETYPE_MATRIX) as ArchetypeId[]

export const listVariants = (archetypeId: ArchetypeId): readonly string[] =>
  Object.keys(VARIANT_CATALOG[archetypeId] ?? {})

export interface CatalogValidationResult {
  isValid: boolean
  errors: string[]
}

export const validateFactoryCatalog = (): CatalogValidationResult => {
  const errors: string[] = []
  for (const archetypeId of listArchetypes()) {
    const archetype = ARCHETYPE_MATRIX[archetypeId]
    const variants = VARIANT_CATALOG[archetypeId]
    if (!variants || Object.keys(variants).length === 0) {
      errors.push(`Archetype "${archetypeId}" has no variants`)
      continue
    }
    if (!variants[archetype.defaultVariantId]) {
      errors.push(
        `Archetype "${archetypeId}" default variant "${archetype.defaultVariantId}" is missing`,
      )
    }
    for (const [variantKey, variant] of Object.entries(variants)) {
      if (variant.id !== variantKey) {
        errors.push(
          `Archetype "${archetypeId}" variant key "${variantKey}" must match id "${variant.id}"`,
        )
      }
    }
  }
  return {
    isValid: errors.length === 0,
    errors,
  }
}

const CATALOG_VALIDATION = validateFactoryCatalog()

export const createEngine = (config: Partial<EngineConfig> & { archetypeId: ArchetypeId }): EngineTemplate => {
  if (!CATALOG_VALIDATION.isValid) {
    throw new Error(`Invalid engine-factory catalog:\n${CATALOG_VALIDATION.errors.join('\n')}`)
  }
  const archetype = ARCHETYPE_MATRIX[config.archetypeId]
  if (!archetype) {
    throw new Error(`Unsupported archetype "${config.archetypeId}"`)
  }
  const variantId = config.variantId ?? archetype.defaultVariantId
  const normalized: EngineConfig = {
    archetypeId: config.archetypeId,
    variantId,
    seed: config.seed,
  }
  return createTemplate(normalized)
}
