/**
 * Application layer barrel export — memory app.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useGame, useMemory } from '@/app'
 */

// Game hooks
export { useMemory } from './hooks/useMemory'

// useGame is the canonical alias — memory uses useMemory internally
export { useMemory as useGame } from './hooks/useMemory'
