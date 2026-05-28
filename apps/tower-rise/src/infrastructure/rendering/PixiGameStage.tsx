/**
 * TODO: PURPOSE
 * TODO: Provide Pixi application root configured for Tower Rise dimensions.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own renderer bootstrap and scene composition only.
 *
 * TODO: INPUTS
 * TODO: Immutable gameState prop.
 *
 * TODO: OUTPUTS
 * TODO: Configured Pixi Application with a rendered tower scene.
 *
 * TODO: DEPENDENCIES
 * TODO: @pixi/react, domain constants, and scene renderer.
 *
 * TODO: EDGE CASES
 * TODO: Renderer stays mounted across screen overlays for consistent state view.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Stage dimensions are constant, avoiding resize thrash during gameplay.
 */
import type { GameState } from '@/domain'
import { GAME_HEIGHT, GAME_WIDTH } from '@/domain'
import styles from '@/ui/organisms/App.module.css'
import { Application, useExtend } from '@pixi/react'
import { Container, Graphics, Sprite, Text } from 'pixi.js'
import { useEffect, useState } from 'react'
import { PixiTowerScene } from './PixiTowerScene'
import { SPRITE_COLORS } from './sprites'
import { hasAllTextures, loadTextureRegistry } from './texture-registry'

interface PixiGameStageProps {
  gameState: GameState
}

export const PixiGameStage = ({ gameState }: PixiGameStageProps) => (
  <PixiStage gameState={gameState} />
)

const PixiStage = ({ gameState }: PixiGameStageProps) => {
  // Register PIXI display objects for intrinsic tags used by scene renderers.
  useExtend({ Container, Graphics, Sprite, Text })
  const [texturesReady, setTexturesReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadTextureRegistry()
      .then(() => {
        if (!cancelled) {
          // Only switch off vector fallbacks when every required sprite is loaded.
          setTexturesReady(hasAllTextures())
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTexturesReady(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Application
      className={styles.stageCanvas}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      background={SPRITE_COLORS.background}
    >
      <PixiTowerScene gameState={gameState} texturesReady={texturesReady} />
    </Application>
  )
}
