import { SplashScreen } from '@/ui'
import { useCallback, useState } from 'react'

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
      <h1>Snakes and Ladders</h1>
      <p>Coming soon...</p>
    </div>
  )
}
