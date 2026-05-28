import { useMemo } from 'react'
import { useKeyboardControls, type KeyboardActionBinding } from './useKeyboardControls'

export type RunnerAction = 'laneLeft' | 'laneRight' | 'primary' | 'secondary' | 'tertiary' | 'reset'

export type RunnerInputCallbacks = {
	onLaneLeft?: () => void
	onLaneRight?: () => void
	onPrimary?: () => void
	onSecondary?: () => void
	onTertiary?: () => void
	onReset?: () => void
}

export type RunnerInputOptions = {
	enabled?: boolean | (() => boolean)
	isGameOver?: boolean
	laneLeftKeys?: readonly string[]
	laneRightKeys?: readonly string[]
	primaryKeys?: readonly string[]
	secondaryKeys?: readonly string[]
	tertiaryKeys?: readonly string[]
	resetKeys?: readonly string[]
}

/**
 * Specialized input hook for endless runner games with lane-based movement.
 *
 * Handles:
 * - Arrow Left/A: Move to left lane
 * - Arrow Right/D: Move to right lane
 * - Space/Enter: Primary action (jump, shoot, etc.)
 * - Arrow Down/S: Secondary action (slide, aim down, etc.)
 * - Shift: Tertiary action (special ability, etc.)
 * - R: Reset (restart game)
 *
 * Game-over state disables movement but allows reset via Space/Enter.
 *
 * Used by: dash-lanes, pulse-burst, angle-war, vector-assault, sky-blitz, arc-spin
 *
 * @param callbacks - Action callbacks
 * @param options - Configuration
 *
 * @example
 * useRunnerInput({
 *   onLaneLeft: () => dispatch('laneLeft'),
 *   onLaneRight: () => dispatch('laneRight'),
 *   onPrimary: () => dispatch('jump'),
 *   onReset: () => reset()
 * }, { isGameOver: phase === 'gameOver' })
 */
export function useRunnerInput(
	callbacks: RunnerInputCallbacks,
	{
		enabled = true,
		isGameOver = false,
		laneLeftKeys = ['ArrowLeft', 'KeyA'],
		laneRightKeys = ['ArrowRight', 'KeyD'],
		primaryKeys = ['Space', 'Enter'],
		secondaryKeys = ['KeyS', 'ArrowDown'],
		tertiaryKeys = ['ShiftLeft', 'ShiftRight'],
		resetKeys = ['KeyR'],
	}: RunnerInputOptions = {},
): void {
	const bindings: KeyboardActionBinding[] = useMemo(() => {
		void isGameOver

		return [
			// Movement actions (disabled during game over)
			{
				action: 'lane-left',
				keys: [...laneLeftKeys],
				onTrigger: () => callbacks.onLaneLeft?.(),
				enabled: enabled && !isGameOver,
				preventDefault: true,
			},
			{
				action: 'lane-right',
				keys: [...laneRightKeys],
				onTrigger: () => callbacks.onLaneRight?.(),
				enabled: enabled && !isGameOver,
				preventDefault: true,
			},

			// Primary action (active during game, reset during game over)
			{
				action: 'primary',
				keys: [...primaryKeys],
				onTrigger: () => {
					if (isGameOver && callbacks.onReset) {
						callbacks.onReset()
					} else {
						callbacks.onPrimary?.()
					}
				},
				enabled,
				preventDefault: true,
			},

			// Secondary action (disabled during game over)
			{
				action: 'secondary',
				keys: [...secondaryKeys],
				onTrigger: () => callbacks.onSecondary?.(),
				enabled: enabled && !isGameOver,
				preventDefault: true,
			},

			// Tertiary action (disabled during game over)
			{
				action: 'tertiary',
				keys: [...tertiaryKeys],
				onTrigger: () => callbacks.onTertiary?.(),
				enabled: enabled && !isGameOver,
				preventDefault: true,
			},

			// Reset always available
			{
				action: 'reset',
				keys: [...resetKeys],
				onTrigger: () => callbacks.onReset?.(),
				enabled,
				preventDefault: true,
			},
		]
	}, [callbacks, enabled, isGameOver, laneLeftKeys, laneRightKeys, primaryKeys, secondaryKeys, tertiaryKeys, resetKeys])

	useKeyboardControls(bindings, { enabled })
}
