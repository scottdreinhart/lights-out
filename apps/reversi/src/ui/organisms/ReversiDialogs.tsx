import { type ChangeEvent } from 'react'

import type { UseReversiAppReturn } from '@/app'

import styles from './App.module.css'

export interface ReversiDialogsProps {
  game: UseReversiAppReturn
}

export function ReversiDialogs({ game }: ReversiDialogsProps) {
  return (
    <>
      {game.showRulesModal && (
        <>
          <button
            type="button"
            className={styles.modalOverlay}
            aria-label="Close rules dialog"
            onClick={() => game.setShowRulesModal(false)}
          />
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label="How to Play Reversi"
          >
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => game.setShowRulesModal(false)}
            >
              ✕
            </button>
            <h2>How to Play Reversi</h2>
            <p>Place your disc so one or more opponent discs are sandwiched in a straight line.</p>
            <h3>Game Rules</h3>
            <ul>
              <li>Black moves first.</li>
              <li>Every move must flip at least one opponent disc.</li>
              <li>If you have no valid moves, your turn is automatically passed.</li>
              <li>The game ends when neither player can move.</li>
              <li>Most discs on board wins. Equal discs is a draw.</li>
            </ul>
          </section>
        </>
      )}

      {game.showSettingsModal && (
        <>
          <button
            type="button"
            className={styles.modalOverlay}
            aria-label="Close settings dialog"
            onClick={() => game.setShowSettingsModal(false)}
          />
          <section className={styles.modal} role="dialog" aria-modal="true" aria-label="Settings">
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => game.setShowSettingsModal(false)}
            >
              ✕
            </button>
            <h2>Settings</h2>
            <div className={styles.settingsGroup}>
              <h3>Game Mode</h3>
              <div className={styles.inlineButtons}>
                <button
                  type="button"
                  className={game.mode === 'pvc' ? styles.activeButton : styles.modalButton}
                  onClick={() => {
                    game.handleModeChange('pvc')
                  }}
                >
                  Player vs CPU
                </button>
                <button
                  type="button"
                  className={game.mode === 'pvp' ? styles.activeButton : styles.modalButton}
                  onClick={() => {
                    game.handleModeChange('pvp')
                  }}
                >
                  Player vs Player
                </button>
              </div>
            </div>

            <div className={styles.settingsGroup}>
              <h3>Difficulty</h3>
              <div className={styles.inlineButtons}>
                {(['easy', 'medium', 'hard'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={game.difficulty === item ? styles.activeButton : styles.modalButton}
                    onClick={() => {
                      game.handleDifficultyChange(item)
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.settingsGroup}>
              <h3>Theme</h3>
              <select
                value={game.settings.colorTheme}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  game.handleColorThemeChange(event.target.value)
                }
              >
                {[
                  'chiba-city',
                  'classic',
                  'neon-arcade',
                  'night-district',
                  'gridline',
                  'vaporwave',
                  'synthwave',
                  'high-contrast',
                ].map((themeId) => (
                  <option key={themeId} value={themeId}>
                    {themeId}
                  </option>
                ))}
              </select>
              <select
                value={game.settings.mode}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  game.handleThemeModeChange(event.target.value)
                }
              >
                <option value="system">system</option>
                <option value="light">light</option>
                <option value="dark">dark</option>
              </select>
              <select
                value={game.settings.colorblind}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  game.handleColorblindChange(event.target.value)
                }
              >
                <option value="none">none</option>
                <option value="protanopia">protanopia</option>
                <option value="deuteranopia">deuteranopia</option>
                <option value="tritanopia">tritanopia</option>
                <option value="achromatopsia">achromatopsia</option>
              </select>
            </div>

            <div className={styles.settingsGroup}>
              <h3>Sound</h3>
              <button type="button" className={styles.modalButton} onClick={game.handleToggleSound}>
                {game.soundEnabled ? 'Disable sound' : 'Enable sound'}
              </button>
            </div>
          </section>
        </>
      )}

      {game.showAboutModal && (
        <>
          <button
            type="button"
            className={styles.modalOverlay}
            aria-label="Close about dialog"
            onClick={() => game.setShowAboutModal(false)}
          />
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label="About Reversi"
          >
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => game.setShowAboutModal(false)}
            >
              ✕
            </button>
            <h2>About Reversi</h2>
            <p>
              Reversi (Othello) is a classic abstract strategy game. This implementation includes
              full move validation, pass logic, CPU difficulty levels, keyboard controls, and
              persistent stats.
            </p>
          </section>
        </>
      )}
    </>
  )
}
