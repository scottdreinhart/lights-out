import type { Bounds, Position } from '../core/types'

export interface Collectible {
  id: string
  position: Position
  bounds: Bounds
  kind: 'bonus' | 'rare'
  value: number
  active: boolean
}
