import { SplashScreen } from '@/ui'
import { useCallback, useState } from 'react'
import { CrossclimbGame } from '../CrossclimbGame'

export function App() {
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false)
  }, [])

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <div className="app">
      <CrossclimbGame />
    </div>
  )
}
