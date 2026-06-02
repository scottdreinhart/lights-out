import { useMemo } from 'react'
import { useKeyboardControls, type KeyboardActionBinding } from './useKeyboardControls'

export type MovementDirection = 'up' | 'down' | 'left' | 'right'

export type MovementInputCallbacks = {
	onMove?: (direction: MovementDirection) => void
	onJump?: () => void
	onAction?: () => void
	onCancel?: () => void
}

export type MovementInputOptions = {
	enabled?: boolean | (() => boolean)
	includeWasd?: boolean
	allowRepeat?: boolean
	jumpKeys?: readonly string[]
	actionKeys?: readonly string[]
	cancelKeys?: readonly string[]
}

/**
 * Continuous directional movement input hook for platformers, climbers, and runners.
 *
 * Handles:
 * - Arrow keys + optional WASD for continuous directional input (up/down/left/right)
 * - Space for jump action
 * - Enter for general action
 * - Escape for cancel/pause
 *
 * Used by: tower-rise, circuit-maze, crossclimb, neon-hop, snake, platformers
 *
 * @param callbacks - Directional and action callbacks
 * @param options - Configuration
 *
 * @example
 * useMovementInput({
 *   onMove: (direction) => { updatePlayerPosition(direction) },
 *   onJump: () => { jump() }
 * }, { includeWasd: true, allowRepeat: true })
 */
export function useMovementInput(
	callbacks: MovementInputCallbacks,
	{
		enabled = true,
		includeWasd = true,
		allowRepeat = true, // Default true for continuous movement feel
		jumpKeys = ['Space'],
		actionKeys = ['Enter'],
		cancelKeys = ['Escape'],
	}: MovementInputOptions = {},
): void {
	const bindings: KeyboardActionBinding[] = useMemo(() => {
		const baseBindings: KeyboardActionBinding[] = [
			{
				action: 'move-up',
				keys: ['ArrowUp'],
				onTrigger: () => callbacks.onMove?.('up'),
				enabled,
				allowRepeat,
				preventDefault: true,
				phase: 'keydown',
			},
			{
				action: 'move-down',
				keys: ['ArrowDown'],
				onTrigger: () => callbacks.onMove?.('down'),
				enabled,
				allowRepeat,
				preventDefault: true,
				phase: 'keydown',
			},
			{
				action: 'move-left',
				keys: ['ArrowLeft'],
				onTrigger: () => callbacks.onMove?.('left'),
				enabled,
				allowRepeat,
				preventDefault: true,
				phase: 'keydown',
			},
			{
				action: 'move-right',
				keys: ['ArrowRight'],
				onTrigger: () => callbacks.onMove?.('right'),
				enabled,
				allowRepeat,
				preventDefault: true,
				phase: 'keydown',
			},
		]

		// Add WASD if enabled
		if (includeWasd) {
			baseBindings.push(
				{
					action: 'move-up-w',
					keys: ['KeyW'],
					onTrigger: () => callbacks.onMove?.('up'),
					enabled,
					allowRepeat,
					preventDefault: true,
					phase: 'keydown',
				},
				{
					action: 'move-down-s',
					keys: ['KeyS'],
					onTrigger: () => callbacks.onMove?.('down'),
					enabled,
					allowRepeat,
					preventDefault: true,
					phase: 'keydown',
				},
				{
					action: 'move-left-a',
					keys: ['KeyA'],
					onTrigger: () => callbacks.onMove?.('left'),
					enabled,
					allowRepeat,
					preventDefault: true,
					phase: 'keydown',
				},
				{
					action: 'move-right-d',
					keys: ['KeyD'],
					onTrigger: () => callbacks.onMove?.('right'),
					enabled,
					allowRepeat,
					preventDefault: true,
					phase: 'keydown',
				},
			)
		}

		// Add jump action
		if (callbacks.onJump) {
			baseBindings.push({
				action: 'jump',
				keys: [...jumpKeys],
				onTrigger: () => callbacks.onJump?.(),
				enabled,
				preventDefault: true,
			})
		}

		// Add generic action
		if (callbacks.onAction) {
			baseBindings.push({
				action: 'action',
				keys: [...actionKeys],
				onTrigger: () => callbacks.onAction?.(),
				enabled,
				preventDefault: true,
			})
		}

		// Add cancel/pause
		if (callbacks.onCancel) {
			baseBindings.push({
				action: 'cancel',
				keys: [...cancelKeys],
				onTrigger: () => callbacks.onCancel?.(),
				enabled,
				preventDefault: true,
			})
		}

		return baseBindings
	}, [callbacks, enabled, includeWasd, allowRepeat, jumpKeys, actionKeys, cancelKeys])

	useKeyboardControls(bindings, { enabled })
}
