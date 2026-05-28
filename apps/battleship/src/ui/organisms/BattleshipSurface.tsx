import type { UseBattleshipAppReturn } from '@/app'
import type { GamePhase, Orientation } from '@/domain'
import {
  AboutModal,
  GameBoard,
  HamburgerMenu,
  Landing,
  RulesModal,
  SettingsModal,
  ShipList,
  Splash,
  StatusBar,
} from '@/ui/molecules'
import { ActionBar, Button } from '@games/assets-shared'
import { useEffect, useRef } from 'react'

import { cx } from '@/ui/utils/cssModules'
import styles from './App.module.css'

function PlacementControls({
  phase,
  orientation,
  shipIndex,
  onRotate,
}: {
  phase: GamePhase
  orientation: Orientation
  shipIndex: number
  onRotate: () => void
}) {
  if (phase !== 'placement') {
    return null
  }

  return (
    <ActionBar className={styles.controls}>
      <Button type="button" className={styles.btn} variant="secondary" onClick={onRotate}>
        Rotate ({orientation === 'horizontal' ? 'H' : 'V'})
      </Button>
      <span className={styles.shipName}>Ship {shipIndex + 1}</span>
    </ActionBar>
  )
}

function GameOverAction({ phase, onNewGame }: { phase: GamePhase; onNewGame: () => void }) {
  if (phase !== 'gameOver') {
    return null
  }

  return (
    <Button type="button" className={styles.newGameBtn} variant="primary" onClick={onNewGame}>
      New Game
    </Button>
  )
}

export function BattleshipSurface({ game }: { game: UseBattleshipAppReturn }) {
  const gameShellRef = useRef<HTMLDivElement>(null)
  const appClassName = cx(
    styles.app,
    game.responsive.compactViewport && styles.compact,
    game.responsive.touchOptimized && styles.touch,
  )

  useEffect(() => {
    if (game.screen !== 'game' || game.showAbout || game.showRules || game.showSettings) {
      return
    }

    gameShellRef.current?.focus()
  }, [game.screen, game.showAbout, game.showRules, game.showSettings, game.phase])

  if (game.screen === 'splash') {
    return <Splash onComplete={game.handleSplashComplete} />
  }

  if (game.screen === 'landing') {
    return <Landing onStart={game.handleDifficultySelect} />
  }

  return (
    <div
      ref={gameShellRef}
      className={appClassName}
      tabIndex={-1}
      aria-label="Battleship game surface"
    >
      <div className={styles.header}>
        <HamburgerMenu
          onSettings={game.onOpenSettings}
          onNewGame={game.handleNewGame}
          onAbout={game.onOpenAbout}
          onRules={game.onOpenRules}
        />
      </div>

      <StatusBar message={game.state.message} phase={game.state.phase} />

      <PlacementControls
        phase={game.phase}
        orientation={game.placementOrientation}
        shipIndex={game.placementShipIndex}
        onRotate={game.handleRotate}
      />

      <div className={styles.scoreboardContainer}>
        <ShipList board={game.state.board} label="Your Ships" owner="player" />
        <ShipList board={game.state.board} label="Enemy Ships" owner="cpu" />
      </div>

      <div className={styles.boards}>
        <div className={styles.boardColumn}>
          <GameBoard
            board={game.boardView}
            showShips={true}
            onCellClick={game.handleCellClick}
            disabled={game.boardDisabled}
            label={game.boardLabel}
            blinkingCells={game.blinkingCells}
            keyboardFocus={game.keyboardFocus}
          />
        </div>
      </div>

      <GameOverAction phase={game.phase} onNewGame={game.handleNewGame} />

      <SettingsModal isOpen={game.showSettings} onClose={game.onCloseSettings} />
      <AboutModal isOpen={game.showAbout} onClose={game.onCloseAbout} />
      <RulesModal isOpen={game.showRules} onClose={game.onCloseRules} />
    </div>
  )
}
