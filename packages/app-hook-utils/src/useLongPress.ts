import { useCallback, useRef } from 'react'

interface LongPressConfig {
	duration?: number
	onLongPress: () => void
	onLongPressEnd?: () => void
}

export const useLongPress = ({ duration = 500, onLongPress, onLongPressEnd }: LongPressConfig) => {
	const timerRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null)
	const pressStartedRef = useRef(false)

	const handleTouchStart = useCallback(() => {
		pressStartedRef.current = true
		timerRef.current = globalThis.setTimeout(() => {
			if (pressStartedRef.current) {
				onLongPress()
			}
		}, duration)
	}, [duration, onLongPress])

	const handleTouchEnd = useCallback(() => {
		if (timerRef.current) {
			globalThis.clearTimeout(timerRef.current)
		}
		if (pressStartedRef.current) {
			pressStartedRef.current = false
			if (onLongPressEnd) {
				onLongPressEnd()
			}
		}
	}, [onLongPressEnd])

	const handleMouseDown = useCallback(() => {
		handleTouchStart()
	}, [handleTouchStart])

	const handleMouseUp = useCallback(() => {
		handleTouchEnd()
	}, [handleTouchEnd])

	return {
		onTouchStart: handleTouchStart,
		onTouchEnd: handleTouchEnd,
		onMouseDown: handleMouseDown,
		onMouseUp: handleMouseUp,
	}
}