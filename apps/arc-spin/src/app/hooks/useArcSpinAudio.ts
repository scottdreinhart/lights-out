import type { GameState } from '@/domain'
import { SOUND_PROFILE } from '@/domain'
import { useAudio, useSynth } from '@games/audio-engine'
import { useEffect, useRef } from 'react'

/**
 * useArcSpinAudio — Specialized audio orchestration hook for Paddle/Rotary game.
 */
export function useArcSpinAudio(state: GameState) {
  const { playMusic, playSequence, stopMusic } = useAudio()
  const { playCustomNote } = useSynth()

  const lastScoreRef = useRef(state.score)
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

  // 2. Score SFX Triggers
  useEffect(() => {
    if (state.score > lastScoreRef.current) {
      // For Arc Spin, any score increase is a brick hit
      playCustomNote(SOUND_PROFILE.ACTIONS.BRICK_HIT)
    }
    lastScoreRef.current = state.score
  }, [state.score, playCustomNote])
}
