import { SplashScreen } from '@/ui'
import { OfflineIndicator } from '@/ui/atoms'
import { BoardView, ControlPanel, HamburgerMenu } from '@/ui/molecules'
import { HelpModal, RulesModal, SettingsModal } from '@/ui/organisms/modals'
import { useEffect, useState } from 'react'

import type { UseCheckersGameResult } from '@/app'

import styles from './App.module.css'

interface CheckersSurfaceProps {
  game: UseCheckersGameResult
}

export function CheckersSurface({ game }: CheckersSurfaceProps) {
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (game.lastMove) {
      const from = game.lastMove.from
      const to = game.lastMove.to
      const capture = game.lastMove.captures && game.lastMove.captures.length > 0
      setAnnouncement(
        `${game.currentPlayerLabel} moved from row ${from.row + 1}, column ${from.col + 1} to row ${to.row + 1}, column ${to.col + 1}${capture ? ', captured piece' : ''}`,
      )
      return
    }

    if (game.winner) {
      setAnnouncement(`${game.winnerLabel} wins`)
      return
    }

    // Fallback announce status changes
    setAnnouncement(game.status)
  }, [game.lastMove, game.winner, game.status, game.currentPlayerLabel, game.winnerLabel])

  if (game.showSplash) {
    return <SplashScreen onComplete={game.handleSplashComplete} />
  }

  return (
    <div
      className={[
        styles.app,
        game.responsive.compactViewport ? styles.compact : '',
        game.responsive.shortViewport ? styles.short : '',
        game.responsive.touchOptimized ? styles.touchOptimized : '',
        game.responsive.ultrawideViewport ? styles.ultrawide : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <OfflineIndicator />
      <main className={styles.frame}>
        <header className={styles.header}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>Checkers</h1>
            {game.instructions && <p className={styles.instructions}>{game.instructions}</p>}
          </div>
          <HamburgerMenu
            onRules={() => game.setShowRulesModal(true)}
            onHelp={() => game.setShowHelpModal(true)}
            onSettings={() => game.setShowSettingsModal(true)}
            onToggleSound={game.onToggleSound}
            onExit={game.handleNewGame}
            soundEnabled={game.soundEnabled}
          />
        </header>

        <div
          className={[
            styles.layout,
            game.responsive.gridColumns === 1 ? styles.layoutStacked : styles.layoutSplit,
            game.responsive.navMode === 'sidebar' ? styles.layoutSidebar : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <section className={styles.boardColumn}>
            <BoardView
              board={game.board}
              legalMoves={game.legalMoves}
              selected={game.selected}
              lastMove={game.lastMove}
              keyboardFocus={game.keyboardFocus}
              disabled={game.thinking}
              compactViewport={game.responsive.compactViewport}
              shortViewport={game.responsive.shortViewport}
              touchOptimized={game.responsive.touchOptimized}
              supportsHover={game.responsive.supportsHover}
              prefersReducedMotion={game.responsive.prefersReducedMotion}
              contentDensity={game.responsive.contentDensity}
              onSquarePress={game.handleSquarePress}
            />
          </section>

          <ControlPanel
            status={game.status}
            winner={game.winner}
            redPieces={game.redPieces}
            blackPieces={game.blackPieces}
            stats={game.stats}
            history={game.history}
            soundEnabled={game.soundEnabled}
            colorTheme={game.colorTheme}
            mode={game.mode}
            colorblind={game.colorblind}
            opponentMode={game.opponentMode}
            colorThemes={game.colorThemes}
            modes={game.modes}
            colorblindModes={game.colorblindModes}
            compactViewport={game.responsive.compactViewport}
            shortViewport={game.responsive.shortViewport}
            touchOptimized={game.responsive.touchOptimized}
            supportsHover={game.responsive.supportsHover}
            contentDensity={game.responsive.contentDensity}
            navMode={game.responsive.navMode}
            onNewGame={game.handleNewGame}
            onResetStats={game.resetStats}
            onToggleSound={game.toggleSound}
            onOpponentModeChange={game.handleOpponentModeChange}
            onThemeChange={game.onThemeChange}
            onModeChange={game.onModeChange}
            onColorblindChange={game.onColorblindChange}
          />
        </div>
      </main>

      <RulesModal isOpen={game.showRulesModal} onClose={() => game.setShowRulesModal(false)} />
      <HelpModal isOpen={game.showHelpModal} onClose={() => game.setShowHelpModal(false)} />
      <SettingsModal
        isOpen={game.showSettingsModal}
        onClose={() => game.setShowSettingsModal(false)}
      />

      {/* Screen-reader announcements for moves and game state */}
      <div
        aria-live="polite"
        role="status"
        style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}
      >
        {announcement}
      </div>
    </div>
  )
}
