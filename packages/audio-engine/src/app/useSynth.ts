import { useCallback } from 'react'
import { useAudio } from './useAudio'

/**
 * useSynth — Specialized hook for programmatic chiptune synthesis.
 */
export const useSynth = () => {
  const { playSynth, playSequence } = useAudio()

  const playBleep = useCallback((freq = 440) => {
    playSynth({
      frequency: freq,
      duration: 0.1,
      waveform: 'square',
    })
  }, [playSynth])

  const playPowerUp = useCallback(() => {
    playSequence({
      id: 'powerup',
      bpm: 140,
      notes: [
        { frequency: 261.63, duration: 0.1, waveform: 'square' },
        { frequency: 329.63, duration: 0.1, waveform: 'square' },
        { frequency: 392.00, duration: 0.1, waveform: 'square' },
        { frequency: 523.25, duration: 0.2, waveform: 'square' },
      ]
    })
  }, [playSequence])

  return {
    playBleep,
    playPowerUp,
    playCustomNote: playSynth,
  }
}
