/**
 * TODO: PURPOSE
 * TODO: Compose shell overlays, HUD, and Pixi stage for Tower Rise.
 *
 * TODO: RESPONSIBILITY
 * TODO: Presentation orchestration only; no game logic.
 *
 * TODO: INPUTS
 * TODO: Runtime state/actions from app hooks and UI store.
 *
 * TODO: OUTPUTS
 * TODO: Fully composed application screen.
 *
 * TODO: DEPENDENCIES
 * TODO: app hooks/store + rendering and organism components.
 *
 * TODO: EDGE CASES
 * TODO: Overlays render based on screen state without unmounting stage state.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Stage remains mounted to avoid costly Pixi reinitialization.
 */
import { useGameRuntime, useUiStore } from '@/app'
import { PixiGameStage } from '@/infrastructure/rendering/PixiGameStage'
import { SplashScreen } from '@games/common'
import { useCallback, useState } from 'react'
import styles from './App.module.css'
import { GameHud } from './GameHud'
import { GameOverScreen } from './GameOverScreen'
import { PauseOverlay } from './PauseOverlay'
import { StartScreen } from './StartScreen'

export const App = () => {
  const [showSplash, setShowSplash] = useState(true)
  const { gameState, startGame, resetGame } = useGameRuntime()
  const screen = useUiStore((state) => state.screen)
  const handleSplashComplete = useCallback(() => {
    setShowSplash(false)
  }, [])

  if (showSplash) {
    return (
      <SplashScreen onComplete={handleSplashComplete} minimumDuration={2000} title="TOWER RISE" />
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.stageFrame}>
        <PixiGameStage gameState={gameState} />
        <GameHud gameState={gameState} />
        {screen === 'start' && <StartScreen onStart={startGame} />}
        {screen === 'paused' && <PauseOverlay />}
        {screen === 'gameOver' && <GameOverScreen onRestart={resetGame} />}
      </div>
    </div>
  )
}
