import { useCallback, useEffect, memo, useMemo, useState } from 'react'

import { getThemeColorPalette, useI18nContext, useTheme } from '@/app'
import { useKeyboardControls, useResponsiveState } from '@games/app-hook-utils'
import type { GameState, GameStats, Opponent } from '@/domain'
import { cx, PileToggle, StarExplosion } from '@/ui'

import styles from './GameBoard.module.css'

type TakeLockVariant = 'soft' | 'strong'

const TAKE_LOCK_VARIANT: TakeLockVariant = 'soft'

interface GameBoardProps {
  state: GameState
  selectedPileId: number | null
  selectedCount: number
  opponent: Opponent
  cpuThinking: boolean
  isMobile: boolean
  onObjectClick: (pileId: number, index: number) => void
  onConfirm: () => void
  readonlyView?: boolean
  menuStats?: GameStats
  onStartVsAi?: () => void
  onStartLocal?: () => void
  onGameOverAutoReset?: () => void
}

function getWinnerLabel(
  opponent: Opponent,
  winner: 'human' | 'cpu' | null,
  t: (key: 'game.player1Wins' | 'game.player2Wins' | 'game.youWon' | 'game.youLost') => string,
): string {
  if (!winner) {
    return ''
  }
  if (opponent === 'local') {
    return winner === 'human' ? t('game.player1Wins') : t('game.player2Wins')
  }
  return winner === 'human' ? t('game.youWon') : t('game.youLost')
}

function GameBoardRaw({
  state,
  selectedPileId,
  selectedCount,
  opponent,
  cpuThinking,
  isMobile,
  onObjectClick,
  onConfirm,
  readonlyView = false,
  menuStats,
  onStartVsAi,
  onStartLocal,
  onGameOverAutoReset,
}: GameBoardProps) {
  const responsive = useResponsiveState()
  const { t } = useI18nContext()
  const { settings: themeSettings } = useTheme()
  const [showTurnNotification, setShowTurnNotification] = useState(false)

  const explosionPalette = useMemo(
    () => getThemeColorPalette(themeSettings.colorTheme),
    [themeSettings.colorTheme],
  )

  // Auto-reset game 3 seconds after game over
  useEffect(() => {
    if (!state.isGameOver || !onGameOverAutoReset) {
      return
    }

    const timer = setTimeout(() => {
      onGameOverAutoReset()
    }, 3000)

    return () => clearTimeout(timer)
  }, [state.isGameOver, onGameOverAutoReset])

  // Declare variables early for use in effects
  const canConfirm = selectedPileId !== null && selectedCount > 0
  const isHumanTurn = state.currentPlayer === 'human'
  const canInteract = !readonlyView && (opponent === 'local' || isHumanTurn)
  const playerWon = opponent === 'local' ? true : state.winner === 'human'
  const takeLockClass =
    TAKE_LOCK_VARIANT === 'strong' ? styles.takeAllBtnLockedStrong : styles.takeAllBtnLockedSoft
  const currentLocalPlayer = opponent === 'local' ? (isHumanTurn ? 1 : 2) : null

  // Show turn notification when a player's turn starts
  useEffect(() => {
    // In local/PvP mode, show notification for both players
    // In vs AI mode, show only for human player
    const shouldShowTurn = opponent === 'local' ? !state.isGameOver : !state.isGameOver && isHumanTurn

    if (!shouldShowTurn) {
      setShowTurnNotification(false)
      return
    }

    setShowTurnNotification(true)
    const timer = setTimeout(() => {
      setShowTurnNotification(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [opponent, isHumanTurn, state.isGameOver])

  const selectAdjacentPile = useCallback(
    (direction: 'left' | 'right') => {
      if (state.isGameOver || !canInteract) {
        return
      }

      const nonEmpty = state.piles.filter((p) => p.count > 0)
      if (nonEmpty.length === 0) {
        return
      }

      const currentIdx = nonEmpty.findIndex((p) => p.id === selectedPileId)
      const nextIdx =
        direction === 'right'
          ? currentIdx < 0
            ? 0
            : (currentIdx + 1) % nonEmpty.length
          : currentIdx <= 0
            ? nonEmpty.length - 1
            : currentIdx - 1

      onObjectClick(nonEmpty[nextIdx].id, 0)
    },
    [state, canInteract, selectedPileId, onObjectClick],
  )

  const increaseSelection = useCallback(() => {
    if (state.isGameOver || !canInteract || selectedPileId === null) {
      return
    }
    const pile = state.piles.find((p) => p.id === selectedPileId)
    if (pile && selectedCount < pile.count) {
      onObjectClick(selectedPileId, selectedCount)
    }
  }, [state, canInteract, selectedPileId, selectedCount, onObjectClick])

  const decreaseSelection = useCallback(() => {
    if (state.isGameOver || !canInteract || selectedPileId === null) {
      return
    }
    if (selectedCount > 1) {
      onObjectClick(selectedPileId, selectedCount - 2)
    }
  }, [state, canInteract, selectedPileId, selectedCount, onObjectClick])

  const confirmSelection = useCallback(() => {
    if (canConfirm) {
      onConfirm()
    }
  }, [canConfirm, onConfirm])

  useKeyboardControls(
    [
      {
        action: 'moveLeft',
        keys: ['ArrowLeft', 'KeyA'],
        onTrigger: () => selectAdjacentPile('left'),
      },
      {
        action: 'moveRight',
        keys: ['ArrowRight', 'KeyD'],
        onTrigger: () => selectAdjacentPile('right'),
      },
      {
        action: 'moveUp',
        keys: ['ArrowUp', 'KeyW'],
        onTrigger: increaseSelection,
      },
      {
        action: 'moveDown',
        keys: ['ArrowDown', 'KeyS'],
        onTrigger: decreaseSelection,
      },
      {
        action: 'confirm',
        keys: ['Enter', 'NumpadEnter', 'Space'],
        onTrigger: confirmSelection,
      },
    ],
    {
      enabled: !state.isGameOver,
      ignoreInputs: true,
    },
  )

  return (
    <div
      className={cx(styles.root, isMobile && styles.rootMobile, state.isGameOver && styles.rootGameOver)}
      data-content-density={responsive.contentDensity}
    >
      {menuStats && (
        <div className={styles.menuScoreboard}>
          {opponent === 'local' ? (
            <>
              <div className={styles.menuScoreColumn}>
                <span className={styles.menuScoreCoin} role="img" aria-label="Player 1">
                  👤
                </span>
                <span className={styles.menuScoreValue}>{menuStats.pvp1Wins}</span>
                <span className={styles.menuScoreLabel}>PLAYER 1</span>
              </div>
              <div className={styles.menuScoreColumn}>
                <span className={styles.menuScoreCoin} role="img" aria-label="Player 2">
                  👤
                </span>
                <span className={styles.menuScoreValue}>{menuStats.pvp2Wins}</span>
                <span className={styles.menuScoreLabel}>PLAYER 2</span>
              </div>
              <div className={styles.menuScoreColumn}>
                <span className={styles.menuScoreCoin} role="img" aria-label="Best Streak">
                  🏆
                </span>
                <span className={styles.menuScoreValue}>{menuStats.bestStreakCount}</span>
                <span className={styles.menuScoreLabel}>
                  {menuStats.bestStreakWinner === 'player1' ? 'PLAYER 1 STREAK' : 'PLAYER 2 STREAK'}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className={styles.menuScoreColumn}>
                <span className={styles.menuScoreCoin} role="img" aria-label="Player wins">
                  👤
                </span>
                <span className={styles.menuScoreValue}>{menuStats.wins}</span>
                <span className={styles.menuScoreLabel}>{t('mainMenu.wins')}</span>
              </div>
              <div className={styles.menuScoreColumn}>
                <span className={styles.menuScoreCoin} role="img" aria-label="Robot losses">
                  🤖
                </span>
                <span className={styles.menuScoreValue}>{menuStats.losses}</span>
                <span className={styles.menuScoreLabel}>{t('mainMenu.losses')}</span>
              </div>
              <div className={styles.menuScoreColumn}>
                <span className={styles.menuScoreCoin} role="img" aria-label="Best streak">
                  🏆
                </span>
                <span className={styles.menuScoreValue}>{menuStats.bestStreak}</span>
                <span className={styles.menuScoreLabel}>{t('mainMenu.bestStreak')}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Piles */}
      <div className={styles.pilesArea}>
        {state.piles.map((pile) => {
          const isTakeDisabled = !canInteract || state.isGameOver || pile.count <= 0

          return (
            <div
              key={pile.id}
              className={cx(
                styles.pileColumn,
                state.lastMove?.pileId === pile.id && styles.lastMovePile,
              )}
            >
              <div
                className={styles.pileWrapper}
              >
                <PileToggle
                  id={pile.id}
                  count={pile.count}
                  selectedCount={selectedPileId === pile.id ? selectedCount : 0}
                  onObjectClick={onObjectClick}
                  disabled={!canInteract || state.isGameOver}
                />
              </div>
              {!readonlyView && (
                <button
                  className={cx(styles.takeAllBtn, isTakeDisabled && takeLockClass)}
                  onClick={() => {
                    if (isTakeDisabled) {
                      return
                    }
                    onObjectClick(pile.id, pile.count - 1)
                    onConfirm()
                  }}
                  aria-label={t('game.takeAllFromPile', { pile: pile.id + 1 })}
                  aria-disabled={isTakeDisabled}
                  tabIndex={isTakeDisabled ? -1 : 0}
                  disabled={isTakeDisabled}
                >
                  {selectedPileId === pile.id ? 'TAKE' : 'PICK'}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom */}
      {readonlyView && onStartVsAi && onStartLocal && (
        <div className={styles.menuStartActions}>
          <button
            type="button"
            className={styles.menuPrimaryBtn}
            onClick={onStartVsAi}
            aria-label={t('mainMenu.playVsAi')}
            title={t('mainMenu.playVsAi')}
          >
            <span className={styles.menuModeIconPair} aria-hidden="true">
              <span className={styles.menuModeIcon}>👤</span>
              <span className={styles.menuModeVs}>vs</span>
              <span className={styles.menuModeIcon}>🤖</span>
            </span>
          </button>
          <button
            type="button"
            className={styles.menuSecondaryBtn}
            onClick={onStartLocal}
            aria-label={t('mainMenu.twoPlayer')}
            title={t('mainMenu.twoPlayer')}
          >
            <span className={styles.menuModeIconPair} aria-hidden="true">
              <span className={styles.menuModeIcon}>👤</span>
              <span className={styles.menuModeVs}>vs</span>
              <span className={styles.menuModeIcon}>👤</span>
            </span>
          </button>
        </div>
      )}

      {!readonlyView && (
        <>
          {state.isGameOver ? (
            <>
              <StarExplosion isActive={state.isGameOver} palette={explosionPalette}>
                <div className={styles.winOverlay}>
                  <h2
                    className={cx(styles.winTitle, playerWon ? styles.winTitleWin : styles.winTitleLose)}
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {getWinnerLabel(opponent, state.winner, t)}
                  </h2>
                </div>
              </StarExplosion>
            </>
          ) : (
            <>
              {showTurnNotification && (
                <div className={styles.turnNotificationOverlay}>
                  <div className={styles.turnNotificationContent}>
                    <h2 className={styles.turnNotificationText}>
                      {opponent === 'local' ? `PLAYER ${currentLocalPlayer}` : "IT'S YOUR TURN"}
                    </h2>
                  </div>
                </div>
              )}
              {cpuThinking && (
                <div
                  className={styles.cpuThinkingLabel}
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <div className={styles.cpuThinkingIcons}>
                    <span className={styles.cpuThinkingIcon}>🤖</span>
                    <span className={styles.cpuThinkingIcon}>⏳</span>
                    <span className={styles.cpuThinkingIcon}>🧠</span>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

/**
 * GameBoard memoized to prevent unnecessary re-renders when parent context updates.
 * Props are compared shallowly via React.memo() — as long as prop identity doesn't change,
 * the component will skip re-rendering.
 *
 * See § 14 Performance Optimization Governance for rationale.
 */
export const GameBoard = memo(GameBoardRaw)
