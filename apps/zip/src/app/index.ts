/**
 * Zip App Layer Exports
 * Public API for Zip game hooks and services
 */

export * from './hooks'
// useGame is the canonical alias — zip uses useZipGame internally
export {
  ensureWasmReady,
  findOptimalPathAi,
  findOptimalPathAsync,
  generateSolvableMazeAi,
  generateSolvableMazeAsync,
  getHintMoveAi,
  getHintMoveAsync,
  terminateAsyncAi,
} from './aiEngine'
export * from './securityModules'
