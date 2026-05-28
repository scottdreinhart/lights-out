import { useCallback, useEffect } from 'react'
import { useSwipe, type SwipeDirection } from './useSwipe'

export type InputAction =
	| 'ROLL'
	| 'HOLD'
	| 'MENU'
	| 'UP'
	| 'DOWN'
	| 'LEFT'
	| 'RIGHT'
	| 'SELECT'
	| 'BACK'
	| 'PASS'
	| 'CONTINUE'

/**
 * Fire TV Remote Control Keycodes (AGENTS.md § 32.1)
 * Used for Fire TV web app compatibility.
 * Must support standard d-pad, select, back, play/pause, rewind, fast forward.
 */
const FIRE_TV_KEYCODES = {
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	SELECT: 13,
	BACK: 4,
	PLAY_PAUSE: 179,
	REWIND: 227,
	FAST_FORWARD: 228,
}

export interface UnifiedInputConfig {
	onAction: (action: InputAction) => void
	includeKeyboard?: boolean
	includeTouch?: boolean
	includeFireTV?: boolean
	touchMinDistance?: number
}

/**
 * Unified input controller that composes keyboard, touch, and d-pad/remote control inputs.
 *
 * Handles:
 * - Keyboard input: Arrow keys, WASD, Space, Enter, Escape, P, C keys
 * - Touch swipe: 4-directional swipe detection with configurable distance threshold
 * - Fire TV Remote: D-pad (37-40), Select (13), Back (4), Play/Pause (179), Rewind (227), FastForward (228)
 *
 * All inputs route to a single `onAction` callback with `InputAction` type.
 *
 * @param config - Configuration object
 * @param config.onAction - Callback when any input action is triggered
 * @param config.includeKeyboard - Enable keyboard input (default: true)
 * @param config.includeTouch - Enable touch swipe input (default: true)
 * @param config.includeFireTV - Enable Fire TV remote keycodes (default: false, enable only on Fire TV platform)
 * @param config.touchMinDistance - Minimum swipe distance in pixels (default: 20)
 *
 * @example
 * // Standard usage with keyboard + touch
 * useUnifiedInput({
 *   onAction: (action) => handleGameAction(action),
 *   includeKeyboard: true,
 *   includeTouch: true
 * })
 *
 * @example
 * // Fire TV with d-pad support
 * useUnifiedInput({
 *   onAction: (action) => handleGameAction(action),
 *   includeFireTV: true
 * })
 */
export function useUnifiedInput({
	onAction,
	includeKeyboard = true,
	includeTouch = true,
	includeFireTV = false,
	// touchMinDistance = 20, // Removed: not currently used
}: UnifiedInputConfig): void {
	// Map swipe direction to InputAction
	const handleSwipe = useCallback(
		(direction: SwipeDirection) => {
			switch (direction) {
				case 'up':
					onAction('UP')
					break
				case 'down':
					onAction('DOWN')
					break
				case 'left':
					onAction('LEFT')
					break
				case 'right':
					onAction('RIGHT')
					break
			}
		},
		[onAction],
	)

	// Wire touch swipe if enabled
	useSwipe(handleSwipe, includeTouch)

	// Wire keyboard + Fire TV remote keycodes if enabled
	useEffect(() => {
		if (!includeKeyboard && !includeFireTV) {
			return
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			// Keyboard input (code-based, works across keyboard layouts)
			if (includeKeyboard) {
				switch (e.code) {
					case 'Space':
						onAction('ROLL')
						e.preventDefault()
						return
					case 'Enter':
						onAction('HOLD')
						e.preventDefault()
						return
					case 'Escape':
						onAction('MENU')
						e.preventDefault()
						return
					case 'ArrowUp':
					case 'KeyW':
						onAction('UP')
						e.preventDefault()
						return
					case 'ArrowDown':
					case 'KeyS':
						onAction('DOWN')
						e.preventDefault()
						return
					case 'ArrowLeft':
					case 'KeyA':
						onAction('LEFT')
						e.preventDefault()
						return
					case 'ArrowRight':
					case 'KeyD':
						onAction('RIGHT')
						e.preventDefault()
						return
					case 'KeyP':
						onAction('PASS')
						e.preventDefault()
						return
					case 'KeyC':
						onAction('CONTINUE')
						e.preventDefault()
						return
				}
			}

			// Fire TV remote control keycodes (per AGENTS.md § 32.1)
			if (includeFireTV) {
				const keyCode = e.keyCode || e.which

				switch (keyCode) {
					case FIRE_TV_KEYCODES.UP:
						onAction('UP')
						e.preventDefault()
						return
					case FIRE_TV_KEYCODES.DOWN:
						onAction('DOWN')
						e.preventDefault()
						return
					case FIRE_TV_KEYCODES.LEFT:
						onAction('LEFT')
						e.preventDefault()
						return
					case FIRE_TV_KEYCODES.RIGHT:
						onAction('RIGHT')
						e.preventDefault()
						return
					case FIRE_TV_KEYCODES.SELECT:
						onAction('SELECT')
						e.preventDefault()
						return
					case FIRE_TV_KEYCODES.BACK:
						onAction('BACK')
						e.preventDefault()
						return
				}
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [onAction, includeKeyboard, includeFireTV])
}
