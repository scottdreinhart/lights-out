import { HamburgerMenu, ReversiBoardSection, ReversiDialogs, SplashScreen } from '@/ui'

import type { UseReversiAppReturn } from '@/app'

import styles from './App.module.css'

interface ReversiSurfaceProps {
  game: UseReversiAppReturn
}

export function ReversiSurface({ game }: ReversiSurfaceProps) {
  return (
    <div className={styles.root}>
      <div style={game.boardVisibleStyle}>
        <header className={styles.header}>
          <div className={styles.titleWrap}>
            <h1 className={styles.title}>Reversi</h1>
            <p className={styles.subtitle}>Flip opponent discs and control the board.</p>
          </div>
          <HamburgerMenu
            onRules={() => game.setShowRulesModal(true)}
            onSettings={() => game.setShowSettingsModal(true)}
            onAbout={() => game.setShowAboutModal(true)}
          />
        </header>

        <main
          className={styles.main}
          style={{
            flexDirection: game.responsive.isDesktop ? 'row' : 'column',
          }}
        >
          <ReversiBoardSection game={game} />
        </main>
      </div>

      {game.showSplash && (
        <SplashScreen
          onFadeStart={game.handleSplashFadeStart}
          onComplete={game.handleSplashComplete}
          title="REVERSI"
        />
      )}

      <ReversiDialogs game={game} />
    </div>
  )
}
