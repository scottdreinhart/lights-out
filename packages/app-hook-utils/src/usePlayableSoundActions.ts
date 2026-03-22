import { useMemo } from 'react'

type SoundAction = () => void | Promise<void>
type SoundActionMap<T extends string> = Record<T, SoundAction>
type BoundSoundActionMap<T extends string> = Record<T, () => void>

export const usePlayableSoundActions = <T extends string>(
	runIfPlayable: (fn: () => void) => void,
	actions: SoundActionMap<T>,
): BoundSoundActionMap<T> => {
	const actionEntries = Object.entries(actions) as Array<[T, SoundAction]>

	return useMemo(() => {
		const bound = {} as BoundSoundActionMap<T>

		for (const [actionName, actionFn] of actionEntries) {
			bound[actionName] = () => {
				runIfPlayable(() => {
					void actionFn()
				})
			}
		}

		return bound
	}, [runIfPlayable, ...actionEntries.map(([, actionFn]) => actionFn)])
}