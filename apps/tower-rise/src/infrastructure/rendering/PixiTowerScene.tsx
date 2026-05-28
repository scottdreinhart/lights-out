import type { GameState } from '@/domain'
import type { Graphics } from 'pixi.js'
import { AnimatedSpriteRenderer } from './AnimatedSpriteRenderer'
import { SpriteRenderer } from './SpriteRenderer'

interface Props {
  gameState: GameState
  texturesReady: boolean
}

export function PixiTowerScene({ gameState, texturesReady }: Props) {
  return (
    <pixiContainer>
      {gameState.platforms.map((platform) =>
        texturesReady ? (
          <SpriteRenderer
            key={platform.id}
            textureId="platform"
            x={platform.position.x}
            y={platform.position.y}
            width={platform.bounds.width}
            height={platform.bounds.height}
          />
        ) : (
          <pixiGraphics
            key={platform.id}
            draw={(g: Graphics) => {
              g.clear()
              g.rect(
                platform.position.x,
                platform.position.y,
                platform.bounds.width,
                platform.bounds.height,
              )
              g.fill(0x884422)
            }}
          />
        ),
      )}

      {gameState.ladders.map((ladder) =>
        texturesReady ? (
          <SpriteRenderer
            key={ladder.id}
            textureId="ladder"
            x={ladder.position.x}
            y={ladder.position.y}
            width={ladder.bounds.width}
            height={ladder.bounds.height}
          />
        ) : (
          <pixiGraphics
            key={ladder.id}
            draw={(g: Graphics) => {
              g.clear()
              g.rect(
                ladder.position.x,
                ladder.position.y,
                ladder.bounds.width,
                ladder.bounds.height,
              )
              g.fill(ladder.broken ? 0x777744 : 0xcccc66)
            }}
          />
        ),
      )}

      {gameState.collectibles.map((collectible) =>
        texturesReady ? (
          <AnimatedSpriteRenderer
            key={collectible.id}
            atlasGroup="collectible"
            animationState="idle"
            animation={{ state: 'idle', frameIndex: 0, frameTimer: 0 }}
            x={collectible.position.x}
            y={collectible.position.y}
            width={collectible.bounds.width}
            height={collectible.bounds.height}
          />
        ) : (
          <pixiGraphics
            key={collectible.id}
            draw={(g: Graphics) => {
              g.clear()
              g.rect(
                collectible.position.x,
                collectible.position.y,
                collectible.bounds.width,
                collectible.bounds.height,
              )
              g.fill(collectible.kind === 'rare' ? 0xff00ff : 0xffff00)
            }}
          />
        ),
      )}

      {gameState.barrels.map((barrel) =>
        texturesReady ? (
          <AnimatedSpriteRenderer
            key={barrel.id}
            atlasGroup="barrel"
            animationState="barrelRoll"
            animation={{ state: 'barrelRoll', frameIndex: 0, frameTimer: 0 }}
            x={barrel.position.x}
            y={barrel.position.y}
            width={barrel.bounds.width}
            height={barrel.bounds.height}
          />
        ) : (
          <pixiGraphics
            key={barrel.id}
            draw={(g: Graphics) => {
              g.clear()
              g.circle(barrel.position.x + 10, barrel.position.y + 10, 10)
              g.fill(0xaa5522)
            }}
          />
        ),
      )}

      {gameState.enemies.map((enemy) =>
        texturesReady ? (
          <AnimatedSpriteRenderer
            key={enemy.id}
            atlasGroup="enemy"
            animationState={enemy.mode === 'climb' ? 'enemyClimb' : 'enemyPatrol'}
            animation={{
              state: enemy.mode === 'climb' ? 'enemyClimb' : 'enemyPatrol',
              frameIndex: 0,
              frameTimer: 0,
            }}
            x={enemy.position.x}
            y={enemy.position.y}
            width={enemy.bounds.width}
            height={enemy.bounds.height}
          />
        ) : (
          <pixiGraphics
            key={enemy.id}
            draw={(g: Graphics) => {
              g.clear()
              g.rect(enemy.position.x, enemy.position.y, enemy.bounds.width, enemy.bounds.height)
              g.fill(0xff7733)
            }}
          />
        ),
      )}

      {texturesReady ? (
        <SpriteRenderer
          textureId="goal"
          x={gameState.goal.position.x}
          y={gameState.goal.position.y}
          width={gameState.goal.bounds.width}
          height={gameState.goal.bounds.height}
        />
      ) : (
        <pixiGraphics
          draw={(g: Graphics) => {
            g.clear()
            g.rect(
              gameState.goal.position.x,
              gameState.goal.position.y,
              gameState.goal.bounds.width,
              gameState.goal.bounds.height,
            )
            g.fill(0x00ff66)
          }}
        />
      )}

      {texturesReady ? (
        <AnimatedSpriteRenderer
          atlasGroup="player"
          animationState={gameState.playerAnimation.state}
          animation={gameState.playerAnimation}
          x={gameState.player.position.x}
          y={gameState.player.position.y}
          width={gameState.player.bounds.width}
          height={gameState.player.bounds.height}
        />
      ) : (
        <pixiGraphics
          draw={(g: Graphics) => {
            g.clear()
            g.rect(
              gameState.player.position.x,
              gameState.player.position.y,
              gameState.player.bounds.width,
              gameState.player.bounds.height,
            )
            g.fill(0x44aaff)
          }}
        />
      )}

      <pixiGraphics
        draw={(g: Graphics) => {
          g.clear()
          g.roundRect(
            gameState.goal.position.x - 8,
            gameState.goal.position.y - 24,
            gameState.goal.bounds.width + 16,
            16,
            4,
          )
          g.fill(0xffffff)
        }}
      />
    </pixiContainer>
  )
}
