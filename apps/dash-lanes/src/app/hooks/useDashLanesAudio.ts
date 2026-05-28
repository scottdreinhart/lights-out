import type { GameState } from '@/domain'
import { SOUND_PROFILE } from '@/domain'
import { useAudio, useSynth } from '@games/audio-engine'
import { useEffect, useRef } from 'react'

/**
 * useDashLanesAudio — Specialized audio orchestration hook for Endless Runner.
 */
export function useDashLanesAudio(state: GameState) {
  const { playMusic, playSequence, stopMusic } = useAudio()
  const { playCustomNote } = useSynth()

  const lastLaneRef = useRef(state.runner.lane)
  const lastLivesRef = useRef(state.lives)
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
    if (state.intensity > 40 && isMusicStartedRef.current) {
      playMusic(SOUND_PROFILE.MUSIC.ACTION)
    } else if (state.intensity <= 40 && isMusicStartedRef.current) {
      playMusic(SOUND_PROFILE.MUSIC.NORMAL)
    }
  }, [state.intensity, playMusic])

  // 3. SFX Triggers
  useEffect(() => {
    // Lane Shift
    if (state.runner.lane !== lastLaneRef.current) {
      playCustomNote(SOUND_PROFILE.ACTIONS.LANE_SHIFT)
    }
    lastLaneRef.current = state.runner.lane

    // Collision (Lives decreased)
    if (state.lives < lastLivesRef.current) {
      playCustomNote(SOUND_PROFILE.ACTIONS.COLLISION)
    }
    lastLivesRef.current = state.lives
  }, [state.runner.lane, state.lives, playCustomNote])
}
