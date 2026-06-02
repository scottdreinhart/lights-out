import type { AudioPattern, SynthNote } from './audioTypes'

/**
 * Arcade Audio Pattern Library
 * Programmatic synth templates for loops and stingers.
 */

const createNote = (freq: number, dur = 0.15, wave: any = 'square'): SynthNote => ({
  frequency: freq,
  duration: dur,
  waveform: wave,
})

// Note frequencies
const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25

export const LOOPS: Record<string, AudioPattern> = {
  BASIC_PULSE: {
    id: 'BASIC_PULSE',
    bpm: 120,
    notes: [createNote(C4), createNote(C4), createNote(E4), createNote(G4)],
  },
  ARCADE_ADVENTURE: {
    id: 'ARCADE_ADVENTURE',
    bpm: 124,
    notes: [
      // Bar 1
      createNote(C4), createNote(G4), createNote(E4), createNote(G4),
      createNote(C4), createNote(G4), createNote(E4), createNote(G4),
      // Bar 2
      createNote(A4), createNote(C5), createNote(G4), createNote(C5),
      createNote(F4), createNote(A4), createNote(E4), createNote(G4),
      // Bar 3
      createNote(D4), createNote(A4), createNote(F4), createNote(A4),
      createNote(D4), createNote(A4), createNote(F4), createNote(A4),
      // Bar 4
      createNote(G4), createNote(B4), createNote(D4), createNote(B4),
      createNote(C5, 0.4, 'triangle') // Ending stinger for loop
    ]
  },
  ZEN_GARDEN: {
    id: 'ZEN_GARDEN',
    bpm: 90,
    notes: [
      createNote(E4, 0.3, 'sine'), createNote(A4, 0.3, 'sine'), 
      createNote(G4, 0.3, 'sine'), createNote(D4, 0.3, 'sine'),
      createNote(C4, 0.3, 'sine'), createNote(E4, 0.3, 'sine'),
      createNote(D4, 0.3, 'sine'), createNote(G4, 0.3, 'sine')
    ]
  },
  TENSION_RISER: {
    id: 'TENSION_RISER',
    bpm: 140,
    notes: [createNote(200, 0.05), createNote(210, 0.05), createNote(220, 0.05), createNote(230, 0.05)],
  },
  BOSS_DEPTH: {
    id: 'BOSS_DEPTH',
    bpm: 100,
    notes: [createNote(110, 0.2, 'sawtooth'), createNote(116, 0.2, 'sawtooth'), createNote(110, 0.2, 'sawtooth')],
  },
  CHIP_MELODY_1: {
    id: 'CHIP_MELODY_1',
    bpm: 130,
    notes: [createNote(440), createNote(493.88), createNote(523.25), createNote(587.33)],
  },
}

export const STINGERS: Record<string, AudioPattern> = {
  VICTORY_FANFARE: {
    id: 'VICTORY_FANFARE',
    bpm: 160,
    notes: [
      createNote(523.25, 0.1),
      createNote(523.25, 0.1),
      createNote(523.25, 0.1),
      createNote(659.25, 0.4, 'triangle'),
    ],
  },
  GAME_OVER_DIRGE: {
    id: 'GAME_OVER_DIRGE',
    bpm: 80,
    notes: [createNote(196.00, 0.5, 'sawtooth'), createNote(185.00, 0.5, 'sawtooth'), createNote(174.61, 0.8, 'sawtooth')],
  },
  POWER_UP: {
    id: 'POWER_UP',
    bpm: 200,
    notes: [createNote(261.63, 0.05), createNote(329.63, 0.05), createNote(392.00, 0.05), createNote(523.25, 0.1)],
  },
  COIN_COLLECT: {
    id: 'COIN_COLLECT',
    bpm: 300,
    notes: [createNote(987.77, 0.05), createNote(1318.51, 0.15)],
  },
}
