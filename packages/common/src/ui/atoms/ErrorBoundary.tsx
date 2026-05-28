/**
 * Re-export of centralized ErrorBoundary from @games/ui-utils
 * 
 * The Error Boundary component catches rendering errors from any child
 * components and displays a fallback UI instead of crashing the entire app.
 * 
 * See packages/ui-utils/src/ErrorBoundary.tsx for implementation details.
 * 
 * Usage:
 *   import { ErrorBoundary } from '@games/common'
 *   
 *   <ErrorBoundary onError={logger.error}>
 *     <GameBoard />
 *   </ErrorBoundary>
 */
export { ErrorBoundary, type ErrorBoundaryProps } from '@games/ui-utils'

