import { useMemo } from 'react'
import { useKeyboardControls, type KeyboardActionBinding } from './useKeyboardControls'

export type LotteryInputCallbacks = {
	onQuickPick?: () => void
	onMarkManual?: (cardIndex: number) => void
	onConfirm?: () => void
	onCancel?: () => void
	onPause?: () => void
}

export type LotteryInputOptions = {
	enabled?: boolean | (() => boolean)
	autoPlay?: boolean
	allowManualMarking?: boolean
	confirmKeys?: readonly string[]
	cancelKeys?: readonly string[]
	pauseKeys?: readonly string[]
}

/**
 * Minimal input hook for lottery-style games (bingo, lottery, etc.).
 *
 * Most lottery games are auto-play with minimal user interaction:
 * - Minimal control (game runs mostly automatically)
 * - Optional manual marking for some variants
 * - Confirm/Next round action
 * - Cancel to exit
 *
 * Used by: bingo, bingo-30, bingo-80, bingo-90, bingo-pattern, bingo-progressive,
 *          bingo-bonus, bingo-blackout, bingo-rush, bingo-survival, speed-bingo
 *
 * @param callbacks - Action callbacks
 * @param options - Configuration
 *
 * @example
 * useLotteryInput({
 *   onConfirm: () => nextRound(),
 *   onCancel: () => exit()
 * }, { autoPlay: true })
 */
export function useLotteryInput(
	callbacks: LotteryInputCallbacks,
	{
		enabled = true,
		// autoPlay = true, // Removed: not currently used
		allowManualMarking = false,
		confirmKeys = ['Space', 'Enter'],
		cancelKeys = ['Escape'],
		pauseKeys = ['KeyP'],
	}: LotteryInputOptions = {},
): void {
	const bindings: KeyboardActionBinding[] = useMemo(() => {
		const baseBindings: KeyboardActionBinding[] = [
			// Confirm / Next round (always available)
			{
				action: 'lottery-confirm',
				keys: [...confirmKeys],
				onTrigger: () => callbacks.onConfirm?.(),
				enabled,
				preventDefault: true,
			},

			// Cancel / Exit (always available)
			{
				action: 'lottery-cancel',
				keys: [...cancelKeys],
				onTrigger: () => callbacks.onCancel?.(),
				enabled,
				preventDefault: true,
			},

			// Pause (useful for auto-play games)
			{
				action: 'lottery-pause',
				keys: [...pauseKeys],
				onTrigger: () => callbacks.onPause?.(),
				enabled,
				preventDefault: true,
			},
		]

		// Add manual marking if enabled
		if (allowManualMarking && callbacks.onMarkManual) {
			// 0-9 keys for quick marking (for bingo cards with up to 10 columns)
			for (let i = 0; i < 10; i++) {
				baseBindings.push({
					action: `lottery-mark-${i}`,
					keys: [`Digit${i}`],
					onTrigger: () => callbacks.onMarkManual?.(i),
					enabled,
					preventDefault: true,
				})
			}
		}

		return baseBindings
	}, [callbacks, enabled, allowManualMarking, confirmKeys, cancelKeys, pauseKeys])

	useKeyboardControls(bindings, { enabled })
}
