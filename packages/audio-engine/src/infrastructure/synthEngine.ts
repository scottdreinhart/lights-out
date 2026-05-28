import type { SynthNote, AudioPattern } from '../domain/audioTypes'

/**
 * Web Audio Synth Engine
 * Responsible for procedural sound generation and arpeggio sequencing.
 */
class SynthEngine {
  private ctx: AudioContext | null = null

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.ctx
  }

  public playNote(note: SynthNote): void {
    const context = this.getContext()
    const osc = context.createOscillator()
    const gain = context.createGain()

    osc.type = note.waveform
    osc.frequency.setValueAtTime(note.frequency, context.currentTime)
    
    gain.gain.setValueAtTime(note.volume ?? 0.1, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + note.duration)

    osc.connect(gain)
    gain.connect(context.destination)

    osc.start()
    osc.stop(context.currentTime + note.duration)
  }

  public playPattern(pattern: AudioPattern): void {
    const stepTime = 60 / pattern.bpm / 2 // 8th notes
    pattern.notes.forEach((note, i) => {
      setTimeout(() => this.playNote(note), i * stepTime * 1000)
    })
  }
}

export const synthEngine = new SynthEngine()
