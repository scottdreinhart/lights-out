import { useGame, useKeyboardControls, useSoundContext, useStats, useThemeContext } from '@/app'
import { COLOR_THEMES, initBoardWasm } from '@/domain'
import { SoundToggle } from '@/ui/atoms'
import { OfflineIndicator } from '@/ui/atoms'
import { GameBoard, HamburgerMenu, QuickThemePicker } from '@/ui/molecules'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import styles from './App.module.css'

export default function App() {
  const { board, moves, isSolved, handleCellClick, resetGame } = useGame()
  const { stats, recordWin, resetStats } = useStats()
  const { settings, setColorTheme } = useThemeContext()
  const { soundEnabled, setSoundEnabled } = useSoundContext()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 })
  const recordedWin = useRef(false)

  // Initialize WASM module for board optimization
  useEffect(() => {
    initBoardWasm().catch((err) => console.warn('WASM init failed:', err))
  }, [])

  // Loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isSolved && !recordedWin.current) {
      recordWin()
      recordedWin.current = true
    }
    if (!isSolved) {
      recordedWin.current = false
    }
  }, [isSolved, recordWin])

  const handleNewGame = useCallback(() => {
    resetGame()
  }, [resetGame])

  useEffect(() => {
    const rowCount = board.length
    const colCount = board[0]?.length ?? 0
    if (rowCount === 0 || colCount === 0) {
      return
    }

    setSelectedCell((prev) => ({
      row: Math.min(prev.row, rowCount - 1),
      col: Math.min(prev.col, colCount - 1),
    }))
  }, [board])

  const moveSelection = useCallback(
    (rowDelta: number, colDelta: number) => {
      const rowCount = board.length
      const colCount = board[0]?.length ?? 0
      if (rowCount === 0 || colCount === 0) {
        return
      }

      setSelectedCell((prev) => ({
        row: (prev.row + rowDelta + rowCount) % rowCount,
        col: (prev.col + colDelta + colCount) % colCount,
      }))
    },
    [board],
  )

  const activateSelectedCell = useCallback(() => {
    handleCellClick(selectedCell.row, selectedCell.col)
  }, [handleCellClick, selectedCell])

  const keyboardBindings = useMemo(
    () => [
      {
        action: 'moveUp',
        keys: ['KeyW', 'ArrowUp'],
        onTrigger: () => moveSelection(-1, 0),
        allowRepeat: true,
      },
      {
        action: 'moveDown',
        keys: ['KeyS', 'ArrowDown'],
        onTrigger: () => moveSelection(1, 0),
        allowRepeat: true,
      },
      {
        action: 'moveLeft',
        keys: ['KeyA', 'ArrowLeft'],
        onTrigger: () => moveSelection(0, -1),
        allowRepeat: true,
      },
      {
        action: 'moveRight',
        keys: ['KeyD', 'ArrowRight'],
        onTrigger: () => moveSelection(0, 1),
        allowRepeat: true,
      },
      {
        action: 'confirm',
        keys: ['Enter', 'NumpadEnter', 'Space'],
        onTrigger: activateSelectedCell,
      },
    ],
    [activateSelectedCell, moveSelection],
  )

  useKeyboardControls(keyboardBindings)

  if (isLoading) {
    return (
      <div className={styles.loSplash}>
        <div className={styles.loSplashOrb}></div>
        <div className={styles.loSplashGrid}></div>
        <div className={styles.loSplashContent}>
          <div className={styles.loSplashBadge}>
            <div className={styles.loSplashEmoji}>💡</div>
          </div>
          <div className={styles.loSplashEyebrow}>Click. Toggle. Solve.</div>
          <h1 className={styles.loSplashTitle}>Lights Out</h1>
          <p className={styles.loSplashSubtitle}>Turn off all lights to win!</p>
          <div className={styles.loSplashLoading}>
            <span className={styles.loSplashDot}></span>
            <span className={styles.loSplashDot}></span>
            <span className={styles.loSplashDot}></span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="game-platform-main-content" className={styles.appContainer}>
      <OfflineIndicator />

      <header className={styles.appHeader}>
        <h1 className={styles.headerTitle}>Lights Out</h1>

        <div className={styles.headerRight}>
          <HamburgerMenu>
            <div className={styles.hamburgerPanelContent}>
              <h3 className={styles.menuSectionTitle}>Theme</h3>
              <QuickThemePicker
                themes={COLOR_THEMES}
                activeThemeId={settings.colorTheme}
                onSelectTheme={(themeId) => {
                  setColorTheme(themeId)
                }}
              />

              <h3 className={styles.menuSectionTitle}>Game</h3>
              <button type="button" onClick={handleNewGame} className={styles.hamburgerMenuButton}>
                New Game
              </button>
              <button type="button" onClick={resetStats} className={styles.hamburgerMenuButton}>
                Reset Stats
              </button>

              <h3 className={styles.menuSectionTitle}>Accessibility</h3>
              <SoundToggle
                enabled={soundEnabled}
                onChange={setSoundEnabled}
                label="Sound Effects"
              />

              <h3 className={styles.menuSectionTitle}>About</h3>
              <p className={styles.menuHint}>Lights Out - A minimal puzzle game</p>
            </div>
          </HamburgerMenu>
        </div>
      </header>

      <main className={styles.appContent}>
        <GameBoard
          board={board}
          onCellClick={handleCellClick}
          selectedRow={selectedCell.row}
          selectedCol={selectedCell.col}
          headerContent={
            <div className={styles.gameStats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Moves</span>
                <span className={styles.statValue}>{moves}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Wins</span>
                <span className={styles.statValue}>{stats.wins}</span>
              </div>
              {isSolved && (
                <div className={styles.winMessage}>
                  <span className={styles.trophy}>🎉</span>
                  <span>Solved in {moves} moves!</span>
                  <span className={styles.trophy}>🎉</span>
                </div>
              )}
            </div>
          }
          footerContent={
            <>
              <button onClick={handleNewGame} className={styles.btnReset}>
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
  )
}
