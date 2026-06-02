import { useCallback, useMemo } from 'react'
import { howlerEngine } from '../infrastructure/howlerEngine'
import { musicEngine } from '../infrastructure/musicEngine'
import { synthEngine } from '../infrastructure/synthEngine'
import type { AudioAsset, SynthNote, AudioPattern } from '../domain/audioTypes'

/**
 * useAudio — General purpose audio orchestration hook.
 */
export const useAudio = () => {
  const playSfx = useCallback((asset: AudioAsset, sprite?: string) => {
    howlerEngine.load(asset)
    howlerEngine.play(asset.id, sprite)
  }, [])

  const playMusic = useCallback((asset: AudioAsset) => {
    musicEngine.playTrack(asset)
  }, [])

  const playSynth = useCallback((note: SynthNote) => {
    synthEngine.playNote(note)
  }, [])

  const playSequence = useCallback((pattern: AudioPattern) => {
    synthEngine.playPattern(pattern)
  }, [])

  return useMemo(() => ({
    playSfx,
    playMusic,
    playSynth,
    playSequence,
    stopMusic: musicEngine.stopAll.bind(musicEngine),
  }), [playSfx, playMusic, playSynth, playSequence])
}
