export type {
  ArchetypeId,
  EngineConfig,
  GameConfig,
  EngineTemplate,
  EngineVariantConfig,
  GameState,
  GameStatus,
  InputCommand,
  TickState,
} from './core/contracts'

export {
  createEngine,
  listArchetypes,
  listVariants,
  validateFactoryCatalog,
  type CatalogValidationResult,
} from './core/engine-factory'
export { ARCHETYPE_MATRIX, type ArchetypeDefinition } from './archetypes/matrix'
export { VARIANT_CATALOG } from './variants/catalog'
