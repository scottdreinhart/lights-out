import { SplashScreen } from '@/ui'
import { useState } from 'react'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [contentVisible, setContentVisible] = useState(false)

  return (
    <div className="app">
      <div style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 15s ease' }}>
        <h1>Monchola</h1>
        <p>Traditional dice/board race game with capture mechanics</p>
      </div>
      {showSplash && (
        <SplashScreen
          onFadeStart={() => setContentVisible(true)}
          onComplete={() => setShowSplash(false)}
          title="MONCHOLA"
        />
      )}
    </div>
  )
}
