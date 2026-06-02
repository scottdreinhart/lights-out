import { useCallback } from 'react'
import { useAudio } from './useAudio'
import type { AudioAsset } from '../domain/audioTypes'

/**
 * useMusic — Specialized hook for background music and intensity layers.
 */
export const useMusic = (musicAssets: AudioAsset[]) => {
  const { playMusic, stopMusic } = useAudio()

  const setIntensity = useCallback((level: number) => {
    const asset = musicAssets[Math.min(level, musicAssets.length - 1)]
    if (asset) {
      playMusic(asset)
    }
  }, [musicAssets, playMusic])

  return {
    setIntensity,
    stopMusic,
  }
}
