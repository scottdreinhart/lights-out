import { useConnectFourApp } from '@/app'
import { HamburgerMenu } from '@/ui/molecules'

import { ConnectFourSurface } from './ConnectFourSurface'

export default function App() {
  const game = useConnectFourApp()

  return (
    <div className="app">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <HamburgerMenu
          onExit={game.onExit}
          onToggleSound={game.onToggleSound}
          soundEnabled={game.soundEnabled}
        />
        <h1 style={{ flex: 1, textAlign: 'center', margin: 0 }}>Connect Four</h1>
        <div style={{ width: '44px' }} />
      </div>

      <ConnectFourSurface game={game} />
    </div>
  )
}
