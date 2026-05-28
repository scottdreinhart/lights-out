import { useMemo } from 'react'
import { useKeyboardControls, type KeyboardActionBinding } from './useKeyboardControls'

export type GridNavigationCallbacks = {
	onMove?: (direction: 'up' | 'down' | 'left' | 'right') => void
	onSelect?: () => void
	onCancel?: () => void
	onHint?: () => void
}

export type GridNavigationOptions = {
	enabled?: boolean | (() => boolean)
	includeWasd?: boolean
	allowRepeat?: boolean
	selectKeys?: readonly string[]
	cancelKeys?: readonly string[]
}

/**
 * Unified grid navigation input hook for grid-based puzzle/board games.
 *
 * Handles:
 * - Arrow keys + optional WASD for directional movement (up/down/left/right)
 * - Space/Enter for selection
 * - Escape/Q for cancel
 * - H for optional hint
 *
 * Used by: zip, checkers, connect-four, reversi, lights-out, tictactoe, nim, sudoku, minesweeper
 *
 * @param callbacks - Directional and action callbacks
 * @param options - Configuration
 * @example
 * useGridNavigationInput({
 *   onMove: (direction) => { updateFocus(direction) },
 *   onSelect: () => { selectCell() },
 *   onCancel: () => { clearSelection() }
 * })
 */
export function useGridNavigationInput(
	callbacks: GridNavigationCallbacks,
	{
		enabled = true,
		includeWasd = true,
		allowRepeat = false,
		selectKeys = ['Space', 'Enter'],
		cancelKeys = ['Escape', 'KeyQ'],
	}: GridNavigationOptions = {},
): void {
	const bindings: KeyboardActionBinding[] = useMemo(() => {
		const baseBindings: KeyboardActionBinding[] = [
			{
				action: 'grid-up',
				keys: ['ArrowUp'],
				onTrigger: () => callbacks.onMove?.('up'),
				enabled,
				allowRepeat,
				preventDefault: true,
			},
			{
				action: 'grid-down',
				keys: ['ArrowDown'],
				onTrigger: () => callbacks.onMove?.('down'),
				enabled,
				allowRepeat,
				preventDefault: true,
			},
			{
				action: 'grid-left',
				keys: ['ArrowLeft'],
				onTrigger: () => callbacks.onMove?.('left'),
				enabled,
				allowRepeat,
				preventDefault: true,
			},
			{
				action: 'grid-right',
				keys: ['ArrowRight'],
				onTrigger: () => callbacks.onMove?.('right'),
				enabled,
				allowRepeat,
				preventDefault: true,
			},
			{
				action: 'grid-select',
				keys: [...selectKeys],
				onTrigger: () => callbacks.onSelect?.(),
				enabled,
				preventDefault: true,
			},
			{
				action: 'grid-cancel',
				keys: [...cancelKeys],
				onTrigger: () => callbacks.onCancel?.(),
				enabled,
				preventDefault: true,
			},
		]

		// Add WASD if enabled
		if (includeWasd) {
			baseBindings.push(
				{
					action: 'grid-up-w',
					keys: ['KeyW'],
					onTrigger: () => callbacks.onMove?.('up'),
					enabled,
					allowRepeat,
					preventDefault: true,
				},
				{
					action: 'grid-down-s',
					keys: ['KeyS'],
					onTrigger: () => callbacks.onMove?.('down'),
					enabled,
					allowRepeat,
					preventDefault: true,
				},
				{
					action: 'grid-left-a',
					keys: ['KeyA'],
					onTrigger: () => callbacks.onMove?.('left'),
					enabled,
					allowRepeat,
					preventDefault: true,
				},
				{
					action: 'grid-right-d',
					keys: ['KeyD'],
					onTrigger: () => callbacks.onMove?.('right'),
					enabled,
					allowRepeat,
					preventDefault: true,
				},
			)
		}

		// Add optional hint key
		if (callbacks.onHint) {
			baseBindings.push({
				action: 'grid-hint',
				keys: ['KeyH'],
				onTrigger: () => callbacks.onHint?.(),
				enabled,
				preventDefault: false,
			})
		}

		return baseBindings
	}, [callbacks, enabled, includeWasd, allowRepeat, selectKeys, cancelKeys])

	useKeyboardControls(bindings, { enabled })
}
