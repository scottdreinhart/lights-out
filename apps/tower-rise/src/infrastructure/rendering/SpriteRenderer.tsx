import { getTexture } from './texture-registry'

interface Props {
  textureId: string
  x: number
  y: number
  width: number
  height: number
}

export function SpriteRenderer({ textureId, x, y, width, height }: Props) {
  const texture = getTexture(textureId)
  if (!texture) {
    return null
  }

  return <pixiSprite texture={texture} x={x} y={y} width={width} height={height} />
}
