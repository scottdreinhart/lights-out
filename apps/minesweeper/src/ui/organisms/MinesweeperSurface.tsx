import type { UseMinesweeperAppReturn } from '@/app'
import { SplashScreen } from '@/ui'
import { GameBoard, HamburgerMenu, Hud, LandingPage, ScoresScreen } from '@/ui/molecules'
import { useEffect, useRef } from 'react'

import { HelpModal, RulesModal } from './modals'

const DIFFICULTIES = ['beginner', 'intermediate', 'expert'] as const

type MinesweeperSurfaceProps = {
  app: UseMinesweeperAppReturn
}

export function MinesweeperSurface({ app }: MinesweeperSurfaceProps) {
  const menuToggleRef = useRef<HTMLButtonElement | null>(null)
  const firstMenuActionRef = useRef<HTMLButtonElement | null>(null)
  const previousMenuOpenRef = useRef(app.menuOpen)

  useEffect(() => {
    const wasOpen = previousMenuOpenRef.current

    if (app.menuOpen && !wasOpen) {
      firstMenuActionRef.current?.focus()
    }

    if (!app.menuOpen && wasOpen) {
      menuToggleRef.current?.focus()
    }

    previousMenuOpenRef.current = app.menuOpen
  }, [app.menuOpen])

  if (app.screen === 'splash') {
    return <SplashScreen onComplete={app.handleSplashComplete} />
  }

  if (app.screen === 'landing') {
    return (
      <main className="ms-shell">
        <LandingPage
          difficulty={app.difficulty}
          difficulties={DIFFICULTIES}
          onDifficultyChange={app.changeDifficulty}
          onStart={app.startGame}
          onViewScores={app.openScores}
          onShowRules={() => app.setShowRulesModal(true)}
          onShowHelp={() => app.setShowHelpModal(true)}
          stats={app.stats}
        />
      </main>
    )
  }

  if (app.screen === 'scores') {
    return (
      <main className="ms-shell">
        <ScoresScreen stats={app.stats} onBack={app.goHome} onStart={app.startGame} />
      </main>
    )
  }

  return (
    <main className="ms-shell">
      <div className="ms-app">
        <header className="ms-topbar">
          <div>
            <p className="ms-kicker">Mission Control</p>
            <h1>Minesweeper</h1>
          </div>
          <button
            type="button"
            ref={menuToggleRef}
            className={`ms-hamburger${app.menuOpen ? ' ms-hamburger-open' : ''}`}
            onClick={() => app.setMenuOpen((current) => !current)}
            aria-label={app.menuOpen ? 'Close game menu' : 'Open game menu'}
            aria-expanded={app.menuOpen}
            aria-controls="ms-game-menu-panel"
            aria-haspopup="dialog"
          >
            <span />
            <span />
            <span />
          </button>
        </header>

        <Hud
          minesRemaining={app.mineCounter}
          elapsedSeconds={app.elapsedSeconds}
          status={app.game.status}
          stats={app.stats}
          difficultyLabel={app.difficultyLabel}
          hintLabel={app.doneFeedback ?? app.hintLabel}
        />

        <HamburgerMenu
          open={app.menuOpen}
          menuId="ms-game-menu-panel"
          firstActionRef={firstMenuActionRef}
          difficulty={app.difficulty}
          difficulties={DIFFICULTIES}
          onDifficultyChange={app.changeDifficulty}
          colorTheme={app.colorTheme}
          onColorThemeChange={app.setColorTheme}
          mode={app.mode}
          onModeChange={app.setMode}
          colorblind={app.colorblind}
          onColorblindChange={app.setColorblind}
          soundEnabled={app.soundEnabled}
          onToggleSound={app.toggleSound}
          onResetStats={app.resetStats}
          onNewGame={app.startGame}
          onHome={app.goHome}
          onViewScores={app.openScores}
          onHint={() => void app.requestHint()}
          onDone={app.doneCheck}
          onRules={() => app.setShowRulesModal(true)}
          onHelp={() => app.setShowHelpModal(true)}
          hintDisabled={app.hintPending || app.game.status === 'won' || app.game.status === 'lost'}
          doneDisabled={app.game.status === 'won' || app.game.status === 'lost'}
          stats={app.stats}
        />

        {app.menuOpen ? (
          <button
            type="button"
            className="ms-menu-backdrop"
            aria-label="Close game menu"
            onClick={() => app.setMenuOpen(false)}
          />
        ) : null}

        <RulesModal isOpen={app.showRulesModal} onClose={() => app.setShowRulesModal(false)} />
        <HelpModal isOpen={app.showHelpModal} onClose={() => app.setShowHelpModal(false)} />

        <section className="ms-board-shell">
          <GameBoard
            board={app.board}
            cols={app.game.cols}
            hint={app.hint}
            selected={app.selectedCell}
            disabled={app.game.status === 'won' || app.game.status === 'lost'}
            onReveal={app.onReveal}
            onToggleFlag={app.onToggleFlag}
            onChord={app.onChord}
          />
        </section>
      </div>
    </main>
  )
}
