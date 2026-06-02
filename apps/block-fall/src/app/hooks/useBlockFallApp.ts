import { useGame } from './useGame'

export interface UseBlockFallAppReturn {
  dispatch: ReturnType<typeof useGame>['dispatch']
  meta: ReturnType<typeof useGame>['meta']
  progressPercent: number
  reset: ReturnType<typeof useGame>['reset']
  state: ReturnType<typeof useGame>['state']
}

export const useBlockFallApp = (): UseBlockFallAppReturn => {
  const { state, meta, dispatch, reset } = useGame()
  const progressPercent = Math.min(100, Math.max(0, (state.progress / 130) * 100))

  return {
    dispatch,
    meta,
    progressPercent,
    reset,
    state,
  }
}

export default useBlockFallApp
