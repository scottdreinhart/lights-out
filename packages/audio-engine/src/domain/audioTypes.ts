/**
 * Audio Engine Domain Types
 */

export type AudioCategory = 'music' | 'sfx' | 'ambient' | 'ui' | 'synth'

export type SynthWaveform = 'sine' | 'square' | 'sawtooth' | 'triangle'

export interface AudioAsset {
  id: string
  src: string[]
  category: AudioCategory
  volume?: number
  loop?: boolean
  sprite?: Record<string, [number, number]>
}

export interface SynthNote {
  frequency: number
  duration: number
  waveform: SynthWaveform
  volume?: number
}

export interface AudioPattern {
  id: string
  notes: SynthNote[]
  bpm: number
}

export interface AudioState {
  masterVolume: number
  musicVolume: number
  sfxVolume: number
  muted: boolean
  activeMusicId: string | null
}

export type IntensityLevel = 0 | 1 | 2 | 3 | 4 | 5
