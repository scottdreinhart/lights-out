import type { AnimationState, EntityAnimation } from '@/domain'
import { Rectangle, Texture } from 'pixi.js'
import { SPRITE_ATLAS } from './sprites'
import { getTexture } from './texture-registry'

interface Props {
  atlasGroup: 'player' | 'barrel' | 'enemy' | 'collectible'
  animationState: AnimationState
  animation: EntityAnimation
  x: number
  y: number
  width: number
  height: number
}

export function AnimatedSpriteRenderer({
  atlasGroup,
  animationState,
  animation,
  x,
  y,
  width,
  height,
}: Props) {
  const group = SPRITE_ATLAS[atlasGroup] as Record<
    string,
    {
      textureId: string
      frames: ReadonlyArray<{ x: number; y: number; width: number; height: number }>
    }
  >
  const config = group[animationState]
  if (!config) {
    return null
  }

  const baseTexture = getTexture(config.textureId)
  if (!baseTexture) {
    return null
  }

  const frameCount = config.frames.length
  const safeFrameIndex = frameCount === 0 ? 0 : animation.frameIndex % frameCount
  const frame = config.frames[safeFrameIndex]
  const texture = new Texture({
    source: baseTexture.source,
    frame: new Rectangle(frame.x, frame.y, frame.width, frame.height),
  })

  return <pixiSprite texture={texture} x={x} y={y} width={width} height={height} />
}
