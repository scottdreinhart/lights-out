interface WebkitWindow extends Window {
  webkitAudioContext?: typeof AudioContext
}

let audioCtx: AudioContext | null = null

const getContext = (): AudioContext => {
  if (!audioCtx) {
    const W = window as WebkitWindow
    const Ctor = window.AudioContext || W.webkitAudioContext
    if (!Ctor) {
      throw new Error('AudioContext not supported')
    }
    audioCtx = new Ctor()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

const playTone = (
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.15,
): void => {
  const ctx = getContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(frequency, ctx.currentTime)

  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

export const playMoveSound = (): void => {
  playTone(600, 0.08, 'sine', 0.12)
}

export const playNavSound = (): void => {
  playTone(800, 0.05, 'sine', 0.08)
}

export const playTapSound = (): void => {
  playTone(650, 0.07, 'sine', 0.1)
}

export const playWinMusic = (): void => {
  const ctx = getContext()
  const t = ctx.currentTime

  const melody = [
    { freq: 261.63, start: 0, dur: 0.25 },
    { freq: 329.63, start: 0.2, dur: 0.25 },
    { freq: 392.0, start: 0.4, dur: 0.25 },
    { freq: 523.25, start: 0.6, dur: 0.6 },
  ]

  const chord = [
    { freq: 523.25, start: 0.9, dur: 0.9 },
    { freq: 659.25, start: 0.9, dur: 0.9 },
    { freq: 783.99, start: 0.9, dur: 0.9 },
  ]

  melody.forEach(({ freq, start, dur }) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(freq, t + start)
    gain.gain.setValueAtTime(0.1, t + start)
    gain.gain.exponentialRampToValueAtTime(0.001, t + start + dur)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t + start)
    osc.stop(t + start + dur)
  })

  chord.forEach(({ freq, start, dur }) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, t + start)
    gain.gain.setValueAtTime(0.12, t + start)
    gain.gain.linearRampToValueAtTime(0.08, t + start + dur * 0.6)
    gain.gain.exponentialRampToValueAtTime(0.001, t + start + dur)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t + start)
    osc.stop(t + start + dur)
  })
}

export const playLossMusic = (): void => {
  const ctx = getContext()
  const t = ctx.currentTime

  const notes = [
    { freq: 329.63, start: 0, dur: 0.35 },
    { freq: 293.66, start: 0.3, dur: 0.35 },
    { freq: 261.63, start: 0.6, dur: 0.35 },
    { freq: 246.94, start: 0.9, dur: 0.35 },
    { freq: 196.0, start: 1.2, dur: 0.8 },
  ]

  notes.forEach(({ freq, start, dur }) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t + start)
    gain.gain.setValueAtTime(0.14, t + start)
    gain.gain.linearRampToValueAtTime(0.06, t + start + dur * 0.5)
    gain.gain.exponentialRampToValueAtTime(0.001, t + start + dur)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t + start)
    osc.stop(t + start + dur)
  })

  const drone = ctx.createOscillator()
  const droneGain = ctx.createGain()
  drone.type = 'triangle'
  drone.frequency.setValueAtTime(233.08, t + 1.2)
  droneGain.gain.setValueAtTime(0.06, t + 1.2)
  droneGain.gain.exponentialRampToValueAtTime(0.001, t + 2.0)
  drone.connect(droneGain)
  droneGain.connect(ctx.destination)
  drone.start(t + 1.2)
  drone.stop(t + 2.0)
}

export const playDrawSound = (): void => {
  const ctx = getContext()
  const notes = [440, 349.23]
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15)

    gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.15)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime + i * 0.15)
    osc.stop(ctx.currentTime + i * 0.15 + 0.25)
  })
}
