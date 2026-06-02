import { useMemo } from 'react'
import { useKeyboardControls } from './useKeyboardControls'

type Enabled = boolean | (() => boolean)

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface DirectionalInputCallbacks {
	onMove?: (direction: Direction) => void
	onConfirm?: () => void
	onCancel?: () => void
	onHint?: () => void
}

export interface UseDirectionalInputOptions {
	enabled?: Enabled
	ignoreInputs?: boolean
	blockedKeys?: string[]
	preventDefault?: boolean
	/**
	 * If true, repeating key holds trigger onMove multiple times (not just keydown).
	 * Useful for smooth continuous movement. Default: false (only on initial press).
	 */
	allowRepeat?: boolean
}

/**
 * useDirectionalInput provides a simple directional input hook for movement-based games.
 *
 * Handles:
 * - Arrow keys + WASD for directional movement
 * - Space/Enter for confirmation
 * - Escape/Q for cancel
 * - H for hint (optional)
 *
 * Automatically detects and ignores keyboard input while user is typing in form fields.
 *
 * @param callbacks - Callbacks for directional input events
 * @param options - Configuration
 *
 * @example
 * useDirectionalInput({
 *   onMove: (direction) => {
 *     console.log(`Moving ${direction}`)
 *   },
 *   onConfirm: () => {
 *     console.log('Confirmed!')
 *   },
 * })
 */
export function useDirectionalInput(
	callbacks: DirectionalInputCallbacks,
	options: UseDirectionalInputOptions = {},
): void {
	const { enabled = true, ignoreInputs = true, blockedKeys, preventDefault = true, allowRepeat = false } = options

	const bindings = useMemo(
		() => [
			{
				action: 'move-up',
				keys: ['ArrowUp', 'KeyW', 'w'],
				onTrigger: () => callbacks.onMove?.('up'),
				enabled,
				preventDefault,
				allowRepeat,
				phase: 'keydown' as const,
			},
			{
				action: 'move-down',
				keys: ['ArrowDown', 'KeyS', 's'],
				onTrigger: () => callbacks.onMove?.('down'),
				enabled,
				preventDefault,
				allowRepeat,
				phase: 'keydown' as const,
			},
			{
				action: 'move-left',
				keys: ['ArrowLeft', 'KeyA', 'a'],
				onTrigger: () => callbacks.onMove?.('left'),
				enabled,
				preventDefault,
				allowRepeat,
				phase: 'keydown' as const,
			},
			{
				action: 'move-right',
				keys: ['ArrowRight', 'KeyD', 'd'],
				onTrigger: () => callbacks.onMove?.('right'),
				enabled,
				preventDefault,
				allowRepeat,
				phase: 'keydown' as const,
			},
			{
				action: 'confirm',
				keys: ['Space', 'Enter', 'NumpadEnter'],
				onTrigger: () => callbacks.onConfirm?.(),
				enabled,
				preventDefault,
				allowRepeat: false,
				phase: 'keydown' as const,
			},
			{
				action: 'cancel',
				keys: ['Escape', 'KeyQ', 'q'],
				onTrigger: () => callbacks.onCancel?.(),
				enabled,
				preventDefault,
				allowRepeat: false,
				phase: 'keydown' as const,
			},
			{
				action: 'hint',
				keys: ['KeyH', 'h'],
				onTrigger: () => callbacks.onHint?.(),
				enabled,
				preventDefault: false,
				allowRepeat: false,
				phase: 'keydown' as const,
			},
		],
		[callbacks, enabled, preventDefault, allowRepeat],
	)

	useKeyboardControls(bindings, {
		enabled,
		ignoreInputs,
		blockedKeys,
	})
}
