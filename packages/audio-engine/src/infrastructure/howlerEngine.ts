import { Howl } from 'howler'
import type { AudioAsset } from '../domain/audioTypes'

/**
 * Base Howler Engine
 * Responsible for asset loading and basic playback orchestration.
 */
class HowlerEngine {
  private instances: Map<string, Howl> = new Map()

  public load(asset: AudioAsset): Howl {
    if (this.instances.has(asset.id)) {
      return this.instances.get(asset.id)!
    }

    const howl = new Howl({
      src: asset.src,
      volume: asset.volume ?? 1.0,
      loop: asset.loop ?? false,
      sprite: asset.sprite,
      preload: true,
    })

    this.instances.set(asset.id, howl)
    return howl
  }

  public play(id: string, sprite?: string): number | null {
    const instance = this.instances.get(id)
    if (instance) {
      return instance.play(sprite)
    }
    return null
  }

  public stop(id: string): void {
    this.instances.get(id)?.stop()
  }

  public setVolume(id: string, volume: number): void {
    this.instances.get(id)?.volume(volume)
  }

  public fade(id: string, from: number, to: number, duration: number): void {
    this.instances.get(id)?.fade(from, to, duration)
  }

  public unload(id: string): void {
    this.instances.get(id)?.unload()
    this.instances.delete(id)
  }
}

export const howlerEngine = new HowlerEngine()
