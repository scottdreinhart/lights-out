/**
 * Sounds service factory — Web Audio API synthesis
 */
export function createSoundsService() {
  type OscillatorType = 'sine' | 'square' | 'triangle' | 'sawtooth'

  interface AudioContext {
    destination: any
    createOscillator: () => any
    createGain: () => any
    currentTime: number
  }

  let audioContext: AudioContext | null = null

  const getAudioContext = (): AudioContext | null => {
    if (typeof window === 'undefined') return null

    if (!audioContext) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        audioContext = ctx
      } catch (error) {
        console.warn('AudioContext not supported:', error)
        return null
      }
    }

    return audioContext
  }

  interface PlayToneConfig {
    frequency: number
    duration: number
    type?: OscillatorType
    volume?: number
  }

  const playTone = ({ frequency, duration, type = 'sine', volume = 0.3 }: PlayToneConfig): void => {
    const ctx = getAudioContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.frequency.value = frequency
      osc.type = type as any
      gain.gain.setValueAtTime(volume, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + duration)
    } catch (error) {
      console.warn('Sound playback failed:', error)
    }
  }

  return {
    move: () => playTone({ frequency: 400, duration: 0.1, type: 'square' }),
    nav: () => playTone({ frequency: 350, duration: 0.08, type: 'sine' }),
    win: () => {
      playTone({ frequency: 523, duration: 0.15, type: 'sine' })
      setTimeout(() => playTone({ frequency: 659, duration: 0.15, type: 'sine' }), 100)
      setTimeout(() => playTone({ frequency: 789, duration: 0.3, type: 'sine' }), 200)
    },
    loss: () => playTone({ frequency: 200, duration: 0.5, type: 'triangle' }),
    draw: () => {
      playTone({ frequency: 440, duration: 0.1, type: 'sine' })
      setTimeout(() => playTone({ frequency: 440, duration: 0.1, type: 'sine' }), 120)
    },
  }
}
