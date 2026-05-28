import { useCallback, useEffect, useState } from 'react'

export interface UseTickingReducerGameResult<TState, TAction, TMeta> {
  state: TState
  meta: TMeta
  dispatch: (action: TAction) => void
  reset: () => void
}

export interface TickingReducerGameConfig<TState, TAction, TMeta> {
  initialState: TState
  reduceState: (state: TState, action: TAction) => TState
  tickAction: TAction
  tickIntervalMs?: number
  meta: TMeta
}

export const createUseTickingReducerGameHook = <TState, TAction, TMeta>({
  initialState,
  reduceState,
  tickAction,
  tickIntervalMs = 1400,
  meta,
}: TickingReducerGameConfig<TState, TAction, TMeta>) => {
  return (): UseTickingReducerGameResult<TState, TAction, TMeta> => {
    const [state, setState] = useState<TState>(initialState)

    const dispatch = useCallback(
      (action: TAction) => {
        setState((prev) => reduceState(prev, action))
      },
      [reduceState],
    )

    const reset = useCallback(() => {
      setState(initialState)
    }, [initialState])

    useEffect(() => {
      const timer = window.setInterval(() => {
        setState((prev) => reduceState(prev, tickAction))
      }, tickIntervalMs)

      return () => window.clearInterval(timer)
    }, [reduceState, tickAction, tickIntervalMs])

    return { state, meta, dispatch, reset }
  }
}
