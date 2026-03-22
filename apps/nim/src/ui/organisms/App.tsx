/**
 * App — Phase-based navigation wrapper for the Nim game.
 *
 * Manages game phases:
 * - loading: Splash screen (1.2s + instant gradient background)
 * - menu: Main menu with stats
 * - playing: Active game board
 * - help: Help overlay (future)
 * - stats: Stats overlay (future)
 *
 * Responsive: Uses useResponsiveState for semantic breakpoints.
 * Board scaling: Dynamic sizing using CSS custom properties + clamp().
 */

import { useCallback, useEffect, useRef, useState } from 'react'

import { App as CapacitorApp } from '@capacitor/app'
import type { PluginListenerHandle } from '@capacitor/core'

import {
  useGame,
  useI18nContext,
  useIonicToast,
  useResponsiveState,
  useSoundEffects,
  useStats,
  useThemeContext,
} from '@/app'
import { GAME_PRESETS } from '@/domain'
import { haptics } from '@/infrastructure/haptics'
import {
  COLOR_THEMES,
  HamburgerLanguageSection,
  HamburgerMenu,
  HamburgerPilesSection,
  IonicAlertDialog,
  OfflineIndicator,
  QuickGameSettings,
  QuickThemePicker,
  SplashScreen,
  StarExplosion,
} from '@/ui'

import styles from './App.module.css'
import { GameBoard } from './GameBoard'
import { DeviceInfoScreen } from './DeviceInfoScreen'

type AppPhase = 'loading' | 'menu' | 'playing' | 'device-info'

export default function App() {
  const responsive = useResponsiveState()
  const game = useGame()
  const { stats, recordWin, recordLoss, recordPvpWin } = useStats()
  const sfx = useSoundEffects()
  const toast = useIonicToast()
  const { settings, setColorTheme } = useThemeContext()
  const { locale, setLocale, t } = useI18nContext()
  const [phase, setPhase] = useState<AppPhase>('loading')
  const [testStars, setTestStars] = useState(false)
  const [setup, setSetup] = useState<number[]>(game.setup)
  const prevGameOver = useRef(false)
  const leaveGameAlertRef = useRef<{
    present: () => Promise<void>
    dismiss: () => Promise<void>
  } | null>(null)
  const deviceInfoAlertRef = useRef<{
    present: () => Promise<void>
    dismiss: () => Promise<void>
  } | null>(null)

  // Loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => setPhase('menu'), 1200)
    return () => clearTimeout(timer)
  }, [])

  // Sound + haptic + stats on game over
  useEffect(() => {
    if (game.state.isGameOver && !prevGameOver.current) {
      if (game.opponent === 'cpu') {
        if (game.state.winner === 'human') {
          sfx.onWin()
          haptics.success()
          recordWin()
        } else {
          sfx.onLose()
          haptics.error()
          recordLoss()
        }
      } else if (game.opponent === 'local') {
        // PvP mode: record stats for winner
        if (game.state.winner === 'human') {
          recordPvpWin('player1')
          sfx.onWin()
          haptics.success()
        } else {
          recordPvpWin('player2')
          sfx.onWin()
          haptics.success()
        }
      }
    }
    prevGameOver.current = game.state.isGameOver
  }, [game.state.isGameOver, game.state.winner, game.opponent, sfx, recordWin, recordLoss, recordPvpWin])

  // Sound on CPU move
  useEffect(() => {
    if (game.state.lastMove?.player === 'cpu') {
      sfx.onCpuMove()
      haptics.light()
    }
  }, [game.state.lastMove, sfx])

  // Sync setup state with game setup
  useEffect(() => {
    setSetup(game.setup)
  }, [game.setup])

  // ─── Setup Handlers ───
  const handlePileChange = useCallback((index: number, value: string) => {
    const parsed = Number.parseInt(value, 10)
    const nextValue = Number.isNaN(parsed) ? 1 : Math.max(1, Math.min(parsed, 15))
    const nextSetup = [...setup]
    nextSetup[index] = nextValue
    setSetup(nextSetup)
    game.updateSetup(nextSetup)
  }, [setup, game])

  const handleApplyPreset = useCallback((counts: number[]) => {
    setSetup([...counts])
    game.updateSetup([...counts])
  }, [game])

  const isPresetActive = (counts: readonly number[]) =>
    counts.length === setup.length && counts.every((count, index) => count === setup[index])

  // ─── Navigation Handlers ───
  const handlePlayVsCpu = useCallback(() => {
    game.setOpponent('cpu')
    game.resetGame()
    sfx.onClick()
    setPhase('playing')
  }, [game, sfx])

  const handlePlayLocal = useCallback(() => {
    game.setOpponent('local')
    game.resetGame()
    sfx.onClick()
    setPhase('playing')
  }, [game, sfx])

  const handleAutoResetGame = useCallback(() => {
    game.resetGame()
  }, [game])

  const handleShowDeviceInfo = useCallback(() => {
    if (phase === 'playing' && !game.state.isGameOver) {
      void deviceInfoAlertRef.current?.present()
      return
    }

    sfx.onClick()
    setPhase('device-info')
    void toast.text(t('app.toast.openedDeviceInfo'))
  }, [phase, game.state.isGameOver, sfx, toast, t])

  const handleCloseDeviceInfo = useCallback(() => {
    sfx.onClick()
    setPhase('menu')
  }, [sfx])

  const isMainMenuPhase = phase === 'menu'
  const isBackNavigationPhase = phase === 'device-info'
  const headerBackIcon = isBackNavigationPhase ? '←' : '✕'
  const headerBackAriaLabel = isBackNavigationPhase ? t('app.backToMenu') : t('app.closeGame')
  const headerBackTitle = isBackNavigationPhase
    ? t('app.backButtonTitle')
    : t('app.closeGameButtonTitle')

  const handleBackToMenu = useCallback(() => {
    if (phase === 'playing' && !game.state.isGameOver) {
      void leaveGameAlertRef.current?.present()
      return
    }

    sfx.onClick()
    setPhase('menu')
  }, [phase, game.state.isGameOver, sfx])

  const handleHeaderBack = useCallback(() => {
    if (phase === 'device-info') {
      handleCloseDeviceInfo()
      return
    }

    handleBackToMenu()
  }, [phase, handleCloseDeviceInfo, handleBackToMenu])

  const handleObjectClick = useCallback(
    (pileId: number, index: number) => {
      sfx.onSelect()
      haptics.light()
      game.handleObjectClick(pileId, index)
    },
    [game, sfx],
  )

  const handleConfirm = useCallback(() => {
    try {
      sfx.onConfirm()
      haptics.light()
      game.confirmMove()
    } catch {
      void toast.error(t('error.unexpected'))
    }
  }, [game, sfx, toast, t])

  const handleLeaveGameDismiss = useCallback(
    (data: { role?: string }) => {
      if (data?.role === 'default' || data?.role === 'confirm') {
        sfx.onClick()
        setPhase('menu')
      }
    },
    [sfx],
  )

  const handleDeviceInfoDismiss = useCallback(
    (data: { role?: string }) => {
      if (data?.role === 'default' || data?.role === 'confirm') {
        sfx.onClick()
        setPhase('device-info')
        void toast.text(t('app.toast.openedDeviceInfo'))
      }
    },
    [sfx, toast, t],
  )

  // Capacitor lifecycle: pause, resume, hardwareBackPress
  useEffect(() => {
    const unlisteners: PluginListenerHandle[] = []

    // Setup listeners asynchronously
    const setupListeners = async () => {
      // Handle app pause (native app suspension on iOS/Android)
      const pauseListener = await CapacitorApp.addListener('pause', () => {
        // Game state is already persisted via hooks (useGame, useStats, etc.)
        // No additional action needed here
      })
      unlisteners.push(pauseListener)

      // Handle app resume (app returned to foreground)
      const resumeListener = await CapacitorApp.addListener('resume', () => {
        // Could re-initialize if needed (e.g., analytics tracking, sound context)
      })
      unlisteners.push(resumeListener)

      // Handle Android hardware back button
      const backListener = await CapacitorApp.addListener(
        'backButton',
        async () => {
          // Navigate based on current phase
          if (phase === 'playing') {
            handleBackToMenu()
          } else if (phase === 'menu' || phase === 'loading') {
            // Allow OS to handle (app exit)
            // Optional: show exit confirmation
          }
        },
      )
      unlisteners.push(backListener)
    }

    setupListeners().catch(err => console.error('[Capacitor] Setup failed:', err))

    return () => {
      unlisteners.forEach(listener => listener.remove())
    }
  }, [phase, handleBackToMenu])

  // ─── Show Splash ───
  if (phase === 'loading') {
    return <SplashScreen />
  }

  // ─── Show Menu / Device Info Surface ───
  if (phase === 'menu' || phase === 'device-info') {
    return (
      <div id="nim-main-content" className={styles.appContainer}>
        <StarExplosion isActive={testStars} palette={['#fbbf24', '#ef4444', '#667eea']}>
          <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 50 }}>
            <button onClick={() => setTestStars(!testStars)} style={{ padding: '8px 12px' }}>
              {testStars ? '★ Stars ON' : '★ Stars OFF'}
            </button>
          </div>
        </StarExplosion>
        <OfflineIndicator />
        <header className={styles.appHeader}>
          <div className={styles.headerLeft}>
            <button
              type="button"
              className={`${styles.backBtn} ${isMainMenuPhase ? styles.backBtnHidden : ''}`}
              onClick={handleHeaderBack}
              disabled={isMainMenuPhase}
              tabIndex={isMainMenuPhase ? -1 : 0}
              aria-hidden={isMainMenuPhase}
              aria-label={headerBackAriaLabel}
              title={headerBackTitle}
            >
              {headerBackIcon}
            </button>
          </div>

          <h1 className={styles.headerTitle}>{t('app.headerTitle')}</h1>

          <div className={styles.headerRight}>
            <HamburgerMenu>
              <div className={styles.hamburgerPanelContent}>
                <QuickThemePicker
                  themes={COLOR_THEMES}
                  activeThemeId={settings.colorTheme}
                  onSelectTheme={(themeId) => {
                    sfx.onClick()
                    setColorTheme(themeId)
                  }}
                />

                <QuickGameSettings
                  difficulty={game.difficulty}
                  mode={game.state.mode}
                  onSelectDifficulty={(difficulty) => {
                    sfx.onClick()
                    game.setDifficulty(difficulty)
                  }}
                  onSelectMode={(mode) => {
                    sfx.onClick()
                    game.setMode(mode)
                  }}
                />

                <HamburgerPilesSection
                  setup={setup}
                  presets={GAME_PRESETS}
                  onPileChange={handlePileChange}
                  onApplyPreset={handleApplyPreset}
                  isPresetActive={isPresetActive}
                />

                <HamburgerLanguageSection
                  locale={locale}
                  onSelectLocale={(newLocale) => {
                    sfx.onClick()
                    setLocale(newLocale)
                  }}
                />

                <button
                  type="button"
                  onClick={() => {
                    sfx.onClick()
                    handleShowDeviceInfo()
                  }}
                  className={styles.hamburgerMenuButton}
                >
                  📱 Device Info
                </button>
              </div>
            </HamburgerMenu>
          </div>
        </header>

        <div className={styles.appContent}>
          {phase === 'device-info' ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '1rem',
                minHeight: '100%',
                width: '100%',
              }}
            >
              <DeviceInfoScreen />
            </div>
          ) : (
            <>
              <div className={styles.menuTableLayout}>
                <GameBoard
                  state={game.state}
                  selectedPileId={game.selectedPileId}
                  selectedCount={game.selectedCount}
                  opponent={game.opponent}
                  cpuThinking={false}
                  isMobile={responsive.isMobile}
                  onObjectClick={handleObjectClick}
                  onConfirm={handleConfirm}
                  readonlyView
                  menuStats={stats}
                  onStartVsAi={handlePlayVsCpu}
                  onStartLocal={handlePlayLocal}
                />

                <p className={styles.menuHint}>
                  {t('mainMenu.hintLine1')}
                  <br />
                  {t('mainMenu.hintLine2')}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // ─── Show Game Board with Persistent Header ───
  return (
    <div id="nim-main-content" className={styles.appContainer}>
      <StarExplosion isActive={testStars} palette={['#fbbf24', '#ef4444', '#667eea']}>
        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 50 }}>
          <button onClick={() => setTestStars(!testStars)} style={{ padding: '8px 12px' }}>
            {testStars ? '★ Stars ON' : '★ Stars OFF'}
          </button>
        </div>
      </StarExplosion>
      <OfflineIndicator />

      {/* Persistent App Header */}
      <header className={styles.appHeader}>
        <div className={styles.headerLeft}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={handleBackToMenu}
            aria-label={t('app.backToMenu')}
            title={t('app.backButtonTitle')}
          >
            ✕
          </button>
        </div>

        <h1 className={styles.headerTitle}>{t('app.headerTitle')}</h1>

        <div className={styles.headerRight}>
          <HamburgerMenu>
            <div className={styles.hamburgerPanelContent}>
              <QuickThemePicker
                themes={COLOR_THEMES}
                activeThemeId={settings.colorTheme}
                onSelectTheme={(themeId) => {
                  sfx.onClick()
                  setColorTheme(themeId)
                }}
              />

              <QuickGameSettings
                difficulty={game.difficulty}
                mode={game.state.mode}
                onSelectDifficulty={(difficulty) => {
                  sfx.onClick()
                  game.setDifficulty(difficulty)
                }}
                onSelectMode={(mode) => {
                  sfx.onClick()
                  game.setMode(mode)
                }}
              />

              <HamburgerPilesSection
                setup={setup}
                presets={GAME_PRESETS}
                onPileChange={handlePileChange}
                onApplyPreset={handleApplyPreset}
                isPresetActive={isPresetActive}
              />

              <HamburgerLanguageSection
                locale={locale}
                onSelectLocale={(newLocale) => {
                  sfx.onClick()
                  setLocale(newLocale)
                }}
              />

              <button
                type="button"
                onClick={() => {
                  sfx.onClick()
                  handleShowDeviceInfo()
                }}
                className={styles.hamburgerMenuButton}
              >
                📱 Device Info
              </button>
            </div>
          </HamburgerMenu>
        </div>
      </header>

      {/* Game Content Area */}
      <div className={styles.appContent}>
        <GameBoard
          state={game.state}
          selectedPileId={game.selectedPileId}
          selectedCount={game.selectedCount}
          opponent={game.opponent}
          cpuThinking={game.cpuThinking}
          isMobile={responsive.isMobile}
          onObjectClick={handleObjectClick}
          onConfirm={handleConfirm}
          menuStats={stats}
          onGameOverAutoReset={handleAutoResetGame}
        />
      </div>

      <IonicAlertDialog
        ref={leaveGameAlertRef}
        title={t('app.dialog.leaveGameTitle')}
        message={t('app.dialog.leaveGameMessage')}
        okText={t('settings.confirm')}
        cancelText={t('settings.cancel')}
        onDismiss={handleLeaveGameDismiss}
      />

      <IonicAlertDialog
        ref={deviceInfoAlertRef}
        title={t('app.dialog.deviceInfoTitle')}
        message={t('app.dialog.deviceInfoMessage')}
        okText={t('settings.confirm')}
        cancelText={t('settings.cancel')}
        onDismiss={handleDeviceInfoDismiss}
      />
    </div>
  )
}
