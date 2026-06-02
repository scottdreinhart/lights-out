import { howlerEngine } from './howlerEngine'
import type { AudioAsset } from '../domain/audioTypes'

/**
 * Music Engine
 * Handles looping, fades, and tension layer transitions.
 */
class MusicEngine {
  private activeTrackId: string | null = null

  public playTrack(asset: AudioAsset): void {
    if (this.activeTrackId === asset.id) return

    if (this.activeTrackId) {
      howlerEngine.fade(this.activeTrackId, 1.0, 0, 1000)
      const oldId = this.activeTrackId
      setTimeout(() => howlerEngine.stop(oldId), 1000)
    }

    howlerEngine.load({ ...asset, loop: true })
    howlerEngine.play(asset.id)
    howlerEngine.fade(asset.id, 0, asset.volume ?? 0.6, 1000)
    this.activeTrackId = asset.id
  }

  public stopAll(): void {
    if (this.activeTrackId) {
      howlerEngine.stop(this.activeTrackId)
      this.activeTrackId = null
    }
  }

  public setIntensity(level: number, assets: AudioAsset[]): void {
    // Logic for switching between layers based on level
    const targetAsset = assets[Math.min(level, assets.length - 1)]
    if (targetAsset) {
      this.playTrack(targetAsset)
    }
  }
}

export const musicEngine = new MusicEngine()
