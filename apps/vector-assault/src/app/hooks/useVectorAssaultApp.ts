import { useCallback, useState } from 'react'

import { useGame } from './useGame'

export const useVectorAssaultApp = () => {
  const [showSplash, setShowSplash] = useState(true)
  const { state, meta, dispatch, reset } = useGame()

  const progressPercent = Math.min(100, Math.max(0, state.progress))

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false)
  }, [])

  return {
    handleSplashComplete,
    meta,
    progressPercent,
    reset,
    showSplash,
    state,
    dispatch,
  }
}

export type UseVectorAssaultAppReturn = ReturnType<typeof useVectorAssaultApp>
