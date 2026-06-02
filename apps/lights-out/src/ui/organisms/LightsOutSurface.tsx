import type { UseLightsOutAppReturn } from '@/app'
import { COLOR_THEMES } from '@/domain'
import { GameBoard, HamburgerMenu, QuickThemePicker } from '@/ui/molecules'
import { OfflineIndicator, SoundToggle, SplashScreen } from '@games/common'

import styles from './App.module.css'

export function LightsOutSurface({ app }: { app: UseLightsOutAppReturn }) {
  return (
    <div id="lights-out-main-content" className={styles.appContainer}>
      <div
        style={{
          opacity: app.boardVisible ? 1 : 0,
          pointerEvents: app.boardVisible ? 'auto' : 'none',
          transition: 'opacity 15s ease',
        }}
      >
        <OfflineIndicator />

        <header className={styles.appHeader}>
          <h1 className={styles.headerTitle}>{app.title}</h1>

          <div className={styles.headerRight}>
            <HamburgerMenu>
              <div className={styles.hamburgerPanelContent}>
                <h3 className={styles.menuSectionTitle}>Theme</h3>
                <QuickThemePicker
                  themes={COLOR_THEMES}
                  activeThemeId={app.activeThemeId}
                  onSelectTheme={app.onSelectTheme}
                />

                <h3 className={styles.menuSectionTitle}>Game</h3>
                <button
                  type="button"
                  onClick={app.handleNewGame}
                  className={styles.hamburgerMenuButton}
                >
                  New Game
                </button>
                <button
                  type="button"
                  onClick={app.onResetStats}
                  className={styles.hamburgerMenuButton}
                >
                  Reset Stats
                </button>

                <h3 className={styles.menuSectionTitle}>Accessibility</h3>
                <SoundToggle soundEnabled={app.soundEnabled} onToggle={app.onToggleSound} />

                <h3 className={styles.menuSectionTitle}>About</h3>
                <p className={styles.menuHint}>Lights Out - A minimal puzzle game</p>
              </div>
            </HamburgerMenu>
          </div>
        </header>

        <main className={styles.appContent}>
          <GameBoard
            board={app.board}
            onCellClick={app.handleCellClick}
            selectedRow={app.selectedCell.row}
            selectedCol={app.selectedCell.col}
            headerContent={
              <div className={styles.gameStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Moves</span>
                  <span className={styles.statValue}>{app.moves}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Wins</span>
                  <span className={styles.statValue}>{app.statsWins}</span>
                </div>
                {app.winMessage ? (
                  <div className={styles.winMessage}>
                    <span className={styles.trophy}>🎉</span>
                    <span>{app.winMessage}</span>
                    <span className={styles.trophy}>🎉</span>
                  </div>
                ) : null}
              </div>
            }
            footerContent={
              <>
                <button onClick={app.handleNewGame} className={styles.btnReset}>
                  New Game
                </button>
                <p className={styles.boardRules}>
                  Rules: Click a light to toggle it and its 4 neighbors (up, down, left, right).
                </p>
              </>
            }
          />
        </main>
      </div>

      {app.showSplash ? (
        <SplashScreen
          onFadeStart={() => app.setBoardVisible(true)}
          onComplete={app.handleSplashComplete}
          title="LIGHTS OUT"
        >
          <div className={styles.loSplashBadge}>
            <div className={styles.loSplashEmoji}>💡</div>
          </div>
        </SplashScreen>
      ) : null}
    </div>
  )
}
