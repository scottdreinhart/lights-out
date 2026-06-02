/**
 * Domain layer barrel export — re-exports from shared @games/bingo-domain package.
 *
 * The actual game logic (types, rules, card operations) is now in the shared package
 * to avoid circular dependencies with bingo-game-hooks.
 */

export * from '@games/bingo-domain'
