import { useMemo } from 'react'
import { useKeyboardControls } from './useKeyboardControls'

/**
 * Generic options for game action hooks
 */
export interface GameActionsOptions {
  /** Whether input is enabled (default: true) */
  enabled?: boolean
}

/**
 * Key binding configuration for a single action
 */
export interface ActionKeyBinding {
  /** List of keyboard codes that trigger this action */
  keys: readonly string[]
  /** Callback function to invoke when triggered */
  onTrigger?: () => void
  /** Human-readable label for the action */
  label?: string
}

/**
 * Configuration for creating a game action hook
 */
export interface GameActionsConfig {
  /** Map of action names to their key bindings */
  [actionName: string]: ActionKeyBinding
}

/**
 * Factory function to create specialized game action hooks
 *
 * Eliminates boilerplate by generating hooks from a configuration object.
 * Each generated hook handles keyboard input mapping and callback invocation.
 *
 * @template T - The action configuration object type
 *
 * @param config - Configuration mapping action names to key bindings
 * @returns A custom hook that handles the configured game actions
 *
 * @example
 * ```typescript
 * // Create a puzzle game hook
 * export const usePuzzleControls = createGameActionsHook({
 *   move: {
 *     keys: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'],
 *     label: 'Move'
 *   },
 *   confirm: {
 *     keys: ['Enter', 'Space'],
 *     label: 'Confirm'
 *   },
 *   hint: {
 *     keys: ['KeyH'],
 *     label: 'Hint'
 *   }
 * })
 *
 * // Use it in a component
 * usePuzzleControls({
 *   onMove: handleMove,
 *   onConfirm: handleConfirm,
 *   onHint: handleHint
 * })
 * ```
 */
export function createGameActionsHook<T extends GameActionsConfig>(config: T) {
  type ActionNames = keyof T
  type Callbacks = {
    [K in ActionNames as `on${Capitalize<string & K>}`]?: () => void
  }

  return function useGameActions(callbacks: Callbacks, options: GameActionsOptions = {}): void {
    const { enabled = true } = options

    const bindings = useMemo(
      () =>
        Object.entries(config).map(([actionName, binding]) => ({
          action: actionName,
          keys: binding.keys,
          onTrigger: () => {
            const callbackName = `on${actionName.charAt(0).toUpperCase()}${actionName.slice(1)}`
            const callback = callbacks[callbackName as keyof Callbacks]
            if (typeof callback === 'function') {
              callback()
            }
          },
          enabled,
        })),
      [callbacks, config, enabled],
    )

    useKeyboardControls(bindings, { enabled })
  }
}

/**
 * Helper to create action callback maps with proper typing
 *
 * @example
 * ```typescript
 * const callbacks = createGameActionCallbacks<typeof puzzleConfig>({
 *   onMove: handleMove,
 *   onConfirm: handleConfirm
 * })
 * ```
 */
export function createGameActionCallbacks<T extends GameActionsConfig>(
  callbacks: Partial<{
    [K in keyof T as `on${Capitalize<string & K>}`]: () => void
  }>
) {
  return callbacks
}
