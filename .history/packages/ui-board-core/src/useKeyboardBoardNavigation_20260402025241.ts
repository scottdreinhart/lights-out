import { useCallback, useMemo } from 'react'
import { useKeyboardControls } from '@games/app-hook-utils'

export interface Position {
  row: number
  col: number
}

export interface UseKeyboardBoardNavigationOptions {
  /**
   * Grid dimensions
   */
  rows: number
  cols: number

  /**
   * Current keyboard focus position
   */
  keyboardFocus: Position | null

  /**
   * Callback when focus moves to a new position
   */
  onFocusChange: (position: Position | null) => void

  /**
   * Callback when action key is pressed (space/enter)
   */
  onAction?: () => void

  /**
   * Callback when cancel key is pressed (escape/Q)
   */
  onCancel?: () => void

  /**
   * Whether keyboard navigation is enabled
   */
  enabled?: boolean

  /**
   * Play sound on navigation (optional sound effect callback)
   */
  onNavigate?: () => void

  /**
   * Wrap around edges (default true for circular navigation)
   */
  wrapAround?: boolean
}

/**
 * Hook for keyboard-based grid navigation
 *
 * Provides:
 * - Arrow key + WASD navigation on NxM grids
 * - Space/Enter for actions
 * - Escape/Q for cancel
 * - Optional wrapping at edges
 * - Automatic focus management
 *
 * Usage:
 * ```tsx
 * const [focus, setFocus] = useState<Position | null>(null)
 * useKeyboardBoardNavigation({
 *   rows: 8,
 *   cols: 8,
 *   keyboardFocus: focus,
 *   onFocusChange: setFocus,
 *   onAction: handleSelectPiece,
 *   onCancel: handleDeselect,
 * })
 * ```
 */
export function useKeyboardBoardNavigation({
  rows,
  cols,
  keyboardFocus,
  onFocusChange,
  onAction,
  onCancel,
  enabled = true,
  onNavigate,
  wrapAround = false,
}: UseKeyboardBoardNavigationOptions) {
  /**
   * Move focus in a cardinal direction, respecting board bounds
   */
  const moveFocus = useCallback(
    (deltaRow: number, deltaCol: number) => {
      if (!enabled) return

      const currentRow = keyboardFocus?.row ?? -1
      const currentCol = keyboardFocus?.col ?? -1

      let newRow = currentRow + deltaRow
      let newCol = currentCol + deltaCol

      // Handle wrapping
      if (wrapAround) {
        newRow = ((newRow % rows) + rows) % rows
        newCol = ((newCol % cols) + cols) % cols
      } else {
        // Clamp to board bounds
        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
          return
        }
      }

      onFocusChange({ row: newRow, col: newCol })
      onNavigate?.()
    },
    [keyboardFocus, rows, cols, enabled, onFocusChange, onNavigate, wrapAround],
  )

  /**
   * Keyboard bindings for grid navigation
   */
  const keyboardBindings = useMemo(
    () => [
      // Navigation: Arrow keys
      { action: 'up', keys: ['ArrowUp'], onTrigger: () => moveFocus(-1, 0) },
      { action: 'down', keys: ['ArrowDown'], onTrigger: () => moveFocus(1, 0) },
      { action: 'left', keys: ['ArrowLeft'], onTrigger: () => moveFocus(0, -1) },
      { action: 'right', keys: ['ArrowRight'], onTrigger: () => moveFocus(0, 1) },

      // Navigation: WASD (alternative)
      { action: 'up-w', keys: ['KeyW'], onTrigger: () => moveFocus(-1, 0) },
      { action: 'down-s', keys: ['KeyS'], onTrigger: () => moveFocus(1, 0) },
      { action: 'left-a', keys: ['KeyA'], onTrigger: () => moveFocus(0, -1) },
      { action: 'right-d', keys: ['KeyD'], onTrigger: () => moveFocus(0, 1) },

      // Action: Select/Confirm
      ...(onAction
        ? [{ action: 'confirm', keys: ['Space', 'Enter'], onTrigger: onAction }]
        : []),

      // Action: Cancel/Deselect
      ...(onCancel
        ? [{ action: 'cancel', keys: ['Escape', 'KeyQ'], onTrigger: onCancel }]
        : []),
    ],
    [moveFocus, onAction, onCancel],
  )

  // Register keyboard bindings
  useKeyboardControls(keyboardBindings)
}

export default useKeyboardBoardNavigation
