import type { GameAction, GameState, SentinelAiTier } from '@/domain'
import { GAME_META, LEVEL_ONE, TICK_MS, createInitialGameState, reduceGameState } from '@/domain'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useKeyboardControls } from '@games/app-hook-utils'

import { computeSentinelStates, ensureWasmReady, getSentinelAiRuntime } from '@/app/aiEngine'

export interface UseGameResult {
	state: GameState
	meta: typeof GAME_META
	aiRuntime: 'wasm' | 'js'
	dispatch: (action: GameAction) => void
	reset: () => void
	setSentinelAiTier: (tier: SentinelAiTier) => void
}

export const useGame = (): UseGameResult => {
	const [state, setState] = useState<GameState>(() => createInitialGameState(LEVEL_ONE))

	const dispatch = useCallback((action: GameAction) => {
		setState((prev) => reduceGameState(prev, action))
	}, [])

	const reset = useCallback(() => {
		setState(createInitialGameState(LEVEL_ONE))
	}, [])

	const setSentinelAiTier = useCallback((tier: SentinelAiTier) => {
		setState((prev) => reduceGameState(prev, { type: 'setSentinelAiTier', tier }))
	}, [])

	useEffect(() => {
		let timer: number | null = null
		let active = true

		void ensureWasmReady().finally(() => {
			if (!active) {
				return
			}
			timer = window.setInterval(() => {
				setState((prev) => {
					const aiResult = computeSentinelStates(prev)
					return reduceGameState(prev, { type: 'tick', sentinels: aiResult.sentinels })
				})
			}, TICK_MS)
		})

		return () => {
			active = false
			if (timer !== null) {
				window.clearInterval(timer)
			}
		}
	}, [])

	const keyboardBindings = useMemo(
		() => [
			{ action: 'move-up', keys: ['ArrowUp', 'KeyW'], onTrigger: () => setState((prev) => reduceGameState(prev, { type: 'move', direction: 'up' })) },
			{ action: 'move-down', keys: ['ArrowDown', 'KeyS'], onTrigger: () => setState((prev) => reduceGameState(prev, { type: 'move', direction: 'down' })) },
			{ action: 'move-left', keys: ['ArrowLeft', 'KeyA'], onTrigger: () => setState((prev) => reduceGameState(prev, { type: 'move', direction: 'left' })) },
			{ action: 'move-right', keys: ['ArrowRight', 'KeyD'], onTrigger: () => setState((prev) => reduceGameState(prev, { type: 'move', direction: 'right' })) },
			{ action: 'dash', keys: ['Space', 'ShiftLeft', 'ShiftRight'], onTrigger: () => setState((prev) => reduceGameState(prev, { type: 'dash' })) },
			{ action: 'restart', keys: ['KeyR'], onTrigger: () => setState((prev) => reduceGameState(prev, { type: 'restart' })) },
			{ action: 'tier-1', keys: ['Digit1'], onTrigger: () => setState((prev) => reduceGameState(prev, { type: 'setSentinelAiTier', tier: 'easy' })) },
			{ action: 'tier-2', keys: ['Digit2'], onTrigger: () => setState((prev) => reduceGameState(prev, { type: 'setSentinelAiTier', tier: 'medium' })) },
			{ action: 'tier-3', keys: ['Digit3'], onTrigger: () => setState((prev) => reduceGameState(prev, { type: 'setSentinelAiTier', tier: 'hard' })) },
			{ action: 'tier-4', keys: ['Digit4'], onTrigger: () => setState((prev) => reduceGameState(prev, { type: 'setSentinelAiTier', tier: 'elite' })) },
		],
		[],
	)

	useKeyboardControls(keyboardBindings)

	return {
		state,
		meta: GAME_META,
		aiRuntime: getSentinelAiRuntime(),
		dispatch,
		reset,
		setSentinelAiTier,
	}
}