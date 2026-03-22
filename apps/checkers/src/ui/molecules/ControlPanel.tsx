import type { ResponsiveContentDensity, ResponsiveNavMode } from '@/app'
import type { ColorblindMode, ColorTheme, GameStats, Mode, OpponentMode, Player } from '@/domain'

import styles from './ControlPanel.module.css'

interface ControlPanelProps {
  status: string
  winner: Player | null
  redPieces: number
  blackPieces: number
  stats: GameStats
  history: readonly string[]
  soundEnabled: boolean
  colorTheme: ColorTheme
  mode: Mode
  colorblind: ColorblindMode
  opponentMode: OpponentMode
  colorThemes: readonly ColorTheme[]
  modes: readonly Mode[]
  colorblindModes: readonly ColorblindMode[]
  compactViewport: boolean
  shortViewport: boolean
  touchOptimized: boolean
  supportsHover: boolean
  contentDensity: ResponsiveContentDensity
  navMode: ResponsiveNavMode
  onNewGame: () => void
  onResetStats: () => void
  onToggleSound: () => void
  onOpponentModeChange: (mode: OpponentMode) => void
  onThemeChange: (theme: ColorTheme) => void
  onModeChange: (mode: Mode) => void
  onColorblindChange: (mode: ColorblindMode) => void
}

const titleCase = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1)

export function ControlPanel({
  status,
  winner,
  redPieces,
  blackPieces,
  stats,
  history,
  soundEnabled,
  colorTheme,
  mode,
  colorblind,
  opponentMode,
  colorThemes,
  modes,
  colorblindModes,
  compactViewport,
  shortViewport,
  touchOptimized,
  supportsHover,
  contentDensity,
  navMode,
  onNewGame,
  onResetStats,
  onToggleSound,
  onOpponentModeChange,
  onThemeChange,
  onModeChange,
  onColorblindChange,
}: ControlPanelProps) {
  const collapseSecondarySections = compactViewport || shortViewport
  const interactionLabel = touchOptimized ? 'Touch-first layout' : 'Precision pointer layout'
  const redLabel = opponentMode === 'cpu' ? 'You' : 'Red'
  const blackLabel = opponentMode === 'cpu' ? 'CPU' : 'Black'
  const modeLabel = opponentMode === 'cpu' ? 'Single-player' : 'Local two-player'

  return (
    <aside
      className={[
        styles.panel,
        compactViewport ? styles.compact : '',
        shortViewport ? styles.short : '',
        touchOptimized ? styles.touchOptimized : '',
        contentDensity === 'compact' ? styles.dense : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Game controls"
    >
      <section className={styles.card}>
        <div className={styles.eyebrow}>Match Status</div>
        <div className={styles.status} role="status" aria-live="polite">
          {status}
        </div>
        <div className={styles.meta}>
          <span className={styles.pill}>
            {redLabel}: {redPieces}
          </span>
          <span className={styles.pill}>
            {blackLabel}: {blackPieces}
          </span>
          <span className={styles.pill}>{winner ? `${titleCase(winner)} won` : modeLabel}</span>
          <span className={styles.pill}>{interactionLabel}</span>
          <span className={styles.pill}>Layout: {titleCase(navMode)}</span>
        </div>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label htmlFor="opponent-mode-select">Mode</label>
            <select
              id="opponent-mode-select"
              value={opponentMode}
              onChange={(event) => onOpponentModeChange(event.target.value as OpponentMode)}
            >
              <option value="cpu">Single-player vs CPU</option>
              <option value="local">Local two-player</option>
            </select>
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.primaryAction} onClick={onNewGame}>
            New game
          </button>
          <button type="button" className={styles.secondaryAction} onClick={onResetStats}>
            Reset stats
          </button>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.eyebrow}>Record</div>
        <div className={styles.helperText}>
          {opponentMode === 'cpu'
            ? 'Wins and losses track CPU matches.'
            : 'Stats stay unchanged in local two-player mode.'}
        </div>
        <div className={styles.scoreGrid}>
          <div className={styles.statBlock}>
            <div className={styles.statLabel}>Wins</div>
            <div className={styles.statValue}>{stats.wins}</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statLabel}>Losses</div>
            <div className={styles.statValue}>{stats.losses}</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statLabel}>Current streak</div>
            <div className={styles.statValue}>{stats.streak}</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statLabel}>Best streak</div>
            <div className={styles.statValue}>{stats.bestStreak}</div>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.eyebrow}>Atmosphere</div>
        <div className={styles.helperText}>
          {supportsHover
            ? 'Hover-capable devices keep denser controls visible.'
            : 'Non-hover layouts keep controls larger and simpler.'}
        </div>
        <div className={styles.fieldGrid}>
          <button type="button" className={styles.toggle} onClick={onToggleSound}>
            Sound effects: {soundEnabled ? 'On' : 'Off'}
          </button>

          <div className={styles.field}>
            <label htmlFor="theme-select">Palette</label>
            <select
              id="theme-select"
              value={colorTheme}
              onChange={(event) => onThemeChange(event.target.value as ColorTheme)}
            >
              {colorThemes.map((theme) => (
                <option key={theme} value={theme}>
                  {titleCase(theme)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="mode-select">Display mode</label>
            <select
              id="mode-select"
              value={mode}
              onChange={(event) => onModeChange(event.target.value as Mode)}
            >
              {modes.map((modeOption) => (
                <option key={modeOption} value={modeOption}>
                  {titleCase(modeOption)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="colorblind-select">Color assist</label>
            <select
              id="colorblind-select"
              value={colorblind}
              onChange={(event) => onColorblindChange(event.target.value as ColorblindMode)}
            >
              {colorblindModes.map((modeOption) => (
                <option key={modeOption} value={modeOption}>
                  {titleCase(modeOption)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {collapseSecondarySections ? (
        <details className={[styles.card, styles.collapsible].join(' ')} open={winner !== null}>
          <summary className={styles.summary}>
            <span className={styles.eyebrow}>Recent Moves</span>
            <span className={styles.summaryMeta}>
              {history.length === 0 ? 'Opening' : `${history.length} turns`}
            </span>
          </summary>
          <div className={styles.history}>
            {history.length === 0 ? (
              <div className={styles.historyItem}>
                <strong>Opening</strong>
                <span>Make the first move from the red side.</span>
              </div>
            ) : (
              history.map((entry, index) => (
                <div key={`${entry}-${index}`} className={styles.historyItem}>
                  <strong>{String(history.length - index).padStart(2, '0')}</strong>
                  <span>{entry}</span>
                </div>
              ))
            )}
          </div>
        </details>
      ) : (
        <section className={styles.card}>
          <div className={styles.eyebrow}>Recent Moves</div>
          <div className={styles.history}>
            {history.length === 0 ? (
              <div className={styles.historyItem}>
                <strong>Opening</strong>
                <span>Make the first move from the red side.</span>
              </div>
            ) : (
              history.map((entry, index) => (
                <div key={`${entry}-${index}`} className={styles.historyItem}>
                  <strong>{String(history.length - index).padStart(2, '0')}</strong>
                  <span>{entry}</span>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </aside>
  )
}
