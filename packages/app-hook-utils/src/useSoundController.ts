import { useCallback, useRef, useState } from 'react'

interface UseSoundControllerConfig {
	initialEnabled?: boolean
	loadEnabled?: () => boolean
	persistEnabled?: (enabled: boolean) => void
}

export interface UseSoundControllerResult {
	soundEnabled: boolean
	toggleSound: () => void
	setSoundEnabled: (enabled: boolean) => void
	canPlay: () => boolean
	runIfPlayable: (fn: () => void) => void
}

const prefersReducedMotion = (): boolean =>
	typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const useSoundController = ({
	initialEnabled = true,
	loadEnabled,
	persistEnabled,
}: UseSoundControllerConfig = {}): UseSoundControllerResult => {
	const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
		if (!loadEnabled) {
			return initialEnabled
		}
		return loadEnabled()
	})

	const reducedMotionRef = useRef(prefersReducedMotion())

	const setSoundEnabled = useCallback(
		(enabled: boolean) => {
			setSoundEnabledState(enabled)
			persistEnabled?.(enabled)
		},
		[persistEnabled],
	)

	const toggleSound = useCallback(() => {
		setSoundEnabledState((prev) => {
			const next = !prev
			persistEnabled?.(next)
			return next
		})
	}, [persistEnabled])

	const canPlay = useCallback(() => {
		return soundEnabled && !reducedMotionRef.current
	}, [soundEnabled])

	const runIfPlayable = useCallback(
		(fn: () => void) => {
			if (canPlay()) {
				fn()
			}
		},
		[canPlay],
	)

	return {
		soundEnabled,
		toggleSound,
		setSoundEnabled,
		canPlay,
		runIfPlayable,
	}
}