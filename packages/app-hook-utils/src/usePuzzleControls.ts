import { useMemo } from 'react'

import { useKeyboardControls, type KeyboardActionBinding } from './useKeyboardControls'

/**
 * Callbacks for puzzle game controls
 */
export interface PuzzleControlsCallbacks {
  /** Handle player movement (arrow keys or WASD) */
  onMove?: (direction: 'up' | 'down' | 'left' | 'right') => void
  /** Handle action confirmation (Enter or Space) */
  onConfirm?: () => void
  /** Handle hint request (H key) */
  onHint?: () => void
  /** Handle game reset (R key) */
  onReset?: () => void
}

/**
 * Options for puzzle controls
 */
export interface PuzzleControlsOptions {
  /** Whether keyboard input is enabled (default: true) */
  enabled?: boolean
}

/**
 * usePuzzleControls — Hook for grid-based puzzle games
 *
 * Provides semantic keyboard controls for puzzle games:
 * - Movement: Arrow keys or WASD
 * - Confirm/Select: Enter or Space
 * - Hint: H key
 * - Reset: R key
 *
 * @example
 * ```tsx
 * export function PuzzleGame() {
 *   const handleMove = useCallback((dir) => {
 *     // Move player in direction
 *   }, [])
 *
 *   usePuzzleControls({
 *     onMove: handleMove,
 *     onConfirm: handleSelect,
 *     onHint: handleHint,
 *     onReset: handleReset
 *   })
 *
 *   return <div>puzzle game</div>
 * }
 * ```
 */
export function usePuzzleControls(
  callbacks: PuzzleControlsCallbacks,
  options: PuzzleControlsOptions = {},
): void {
  const { enabled = true } = options

  const bindings: KeyboardActionBinding[] = useMemo(
    () => [
      {
        action: 'move-up',
        keys: ['ArrowUp', 'KeyW'],
        onTrigger: () => callbacks.onMove?.('up'),
        enabled,
      },
      {
        action: 'move-down',
        keys: ['ArrowDown', 'KeyS'],
        onTrigger: () => callbacks.onMove?.('down'),
        enabled,
      },
      {
        action: 'move-left',
        keys: ['ArrowLeft', 'KeyA'],
        onTrigger: () => callbacks.onMove?.('left'),
        enabled,
      },
      {
        action: 'move-right',
        keys: ['ArrowRight', 'KeyD'],
        onTrigger: () => callbacks.onMove?.('right'),
        enabled,
      },
      {
        action: 'confirm',
        keys: ['Enter', 'Space'],
        onTrigger: () => callbacks.onConfirm?.(),
        enabled,
      },
      {
        action: 'hint',
        keys: ['KeyH'],
        onTrigger: () => callbacks.onHint?.(),
        enabled,
      },
      {
        action: 'reset',
        keys: ['KeyR'],
        onTrigger: () => callbacks.onReset?.(),
        enabled,
      },
    ],
    [callbacks, enabled],
  )

  useKeyboardControls(bindings, { enabled })
}
