import { SoundProvider, ThemeProvider, useSimonGame } from '@/app'
import { SimonThemeMenu } from '@/ui/molecules'
import { GameBoard } from '@/ui/organisms'
import { SplashScreen } from '@games/common'
import { useState } from 'react'
import styles from './AppShell.module.css'

export const AppShell = () => {
  const [view, setView] = useState<'loading' | 'game'>('loading')

  const {
    state,
    uiState,
    rules,
    beginGame,
    playSequence,
    makeMove,
    reset,
    toggleRules,
    closeRules,
    setDifficulty,
  } = useSimonGame()

  if (view === 'loading') {
    return (
      <SoundProvider>
        <ThemeProvider>
          <div className={styles.root}>
            <SplashScreen onComplete={() => setView('game')} minimumDuration={1500} title="SIMON" />
          </div>
        </ThemeProvider>
      </SoundProvider>
    )
  }

  return (
    <SoundProvider>
      <ThemeProvider>
        <div className={styles.root}>
          <header className={styles.appHeader}>
            <h1 className={styles.appTitle}>Simon</h1>
            <div className={styles.headerMenuArea}>
              <SimonThemeMenu />
            </div>
          </header>
          <div className={styles.gameContainer}>
            <GameBoard
              state={state}
              rules={rules}
              showRules={uiState.showRules}
              onColorClick={makeMove}
              onStart={beginGame}
              onPlaySequence={playSequence}
              onReset={reset}
              onToggleRules={toggleRules}
              onCloseRules={closeRules}
              onDifficultyChange={setDifficulty}
            />
          </div>
        </div>
      </ThemeProvider>
    </SoundProvider>
  )
}
