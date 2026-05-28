import { Assets, Texture } from 'pixi.js'
import { SPRITE_MANIFEST } from './sprites'

const registry = new Map<string, Texture>()

export async function loadTextureRegistry(): Promise<void> {
  await Promise.all(
    SPRITE_MANIFEST.map(async (entry) => {
      try {
        const texture = await Assets.load(entry.src)
        registry.set(entry.id, texture)
      } catch {
        // Keep fallbacks active when texture assets are missing.
      }
    }),
  )
}

export function hasAllTextures(): boolean {
  return SPRITE_MANIFEST.every((entry) => registry.has(entry.id))
}

export function getTexture(id: string): Texture | null {
  return registry.get(id) ?? null
}
