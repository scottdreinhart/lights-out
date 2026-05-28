import { SplashScreen } from '@/ui'
import { lazy, Suspense, useEffect, useState } from 'react'

const ZipGame = lazy(async () => {
  const module = await import('./ZipGame')
  return { default: module.ZipGame }
})

export function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [boardVisible, setBoardVisible] = useState(false)

  useEffect(() => {
    void import('./ZipGame')
  }, [])

  return (
    <div className="app">
      <div
        style={{
          opacity: boardVisible ? 1 : 0,
          pointerEvents: boardVisible ? 'auto' : 'none',
          transition: 'opacity 15s ease',
        }}
      >
        <Suspense fallback={<div className="app">Loading Zip...</div>}>
          <ZipGame />
        </Suspense>
      </div>
      {showSplash && (
        <SplashScreen
          onFadeStart={() => setBoardVisible(true)}
          onComplete={() => setShowSplash(false)}
          title="ZIP"
        />
      )}
    </div>
  )
}
