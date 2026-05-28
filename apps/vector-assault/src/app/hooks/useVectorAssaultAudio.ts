import type { GameState } from '@/domain'
import { SOUND_PROFILE } from '@/domain'
import { useAudio, useSynth } from '@games/audio-engine'
import { useEffect, useRef } from 'react'

/**
 * useVectorAssaultAudio — Specialized audio orchestration hook for Arena Shooter.
 */
export function useVectorAssaultAudio(state: GameState) {
  const { playMusic, playSequence, stopMusic } = useAudio()
  const { playCustomNote } = useSynth()

  const lastWaveRef = useRef(state.wave)
  const lastProjectileCountRef = useRef(state.projectiles.length)
  const lastHazardCountRef = useRef(state.hazards.length)
  const isMusicStartedRef = useRef(false)

  // 1. Orchestrate Background Music
  useEffect(() => {
    if (state.phase === 'playing' && !isMusicStartedRef.current) {
      playMusic(SOUND_PROFILE.MUSIC.NORMAL)
      isMusicStartedRef.current = true
    }

    if (state.phase === 'gameOver') {
      stopMusic()
      playSequence(SOUND_PROFILE.MUSIC.GAME_OVER)
      isMusicStartedRef.current = false
    }
  }, [state.phase, playMusic, stopMusic, playSequence])

  // 2. Music Intensity Logic
  useEffect(() => {
    if (state.intensity > 50 && isMusicStartedRef.current) {
      playMusic(SOUND_PROFILE.MUSIC.TENSION)
    } else if (state.intensity <= 50 && isMusicStartedRef.current) {
      playMusic(SOUND_PROFILE.MUSIC.NORMAL)
    }
  }, [state.intensity, playMusic])

  // 3. One-shot SFX Triggers
  useEffect(() => {
    // Fire sound
    if (state.projectiles.length > lastProjectileCountRef.current) {
      playCustomNote(SOUND_PROFILE.ACTIONS.FIRE)
    }
    lastProjectileCountRef.current = state.projectiles.length

    // Hit sound
    if (state.hazards.length < lastHazardCountRef.current) {
      playCustomNote(SOUND_PROFILE.ACTIONS.HIT)
    }
    lastHazardCountRef.current = state.hazards.length

    // Wave Complete
    if (state.wave > lastWaveRef.current) {
      playSequence(SOUND_PROFILE.JINGLES.WAVE_COMPLETE)
    }
    lastWaveRef.current = state.wave
  }, [state.projectiles.length, state.hazards.length, state.wave, playCustomNote, playSequence])
}
