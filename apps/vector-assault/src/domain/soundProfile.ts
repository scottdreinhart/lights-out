import { AUDIO_CATALOG, STINGERS } from '@games/audio-engine'

/**
 * Vector Assault Sound Profile
 * Maps internal game events to global audio engine assets and patterns.
 */

export const SOUND_PROFILE = {
  // Background Music
  MUSIC: {
    NORMAL: AUDIO_CATALOG.ACTION_CHASE,
    TENSION: AUDIO_CATALOG.BOSS_BATTLE,
    GAME_OVER: STINGERS.GAME_OVER_DIRGE,
  },

  // Game Actions (Programmatic Synth)
  ACTIONS: {
    FIRE: { frequency: 880, duration: 0.05, waveform: 'square' as const },
    HIT: { frequency: 110, duration: 0.2, waveform: 'sawtooth' as const },
    BURST: { frequency: 440, duration: 0.3, waveform: 'triangle' as const },
  },

  // Jingles & Stingers
  JINGLES: {
    WAVE_START: STINGERS.POWER_UP,
    WAVE_COMPLETE: STINGERS.VICTORY_FANFARE,
    COIN_COLLECT: STINGERS.COIN_COLLECT,
  },

  // Voice (Assets)
  VOICE: {
    READY: 'VOICE_READY',
    GO: 'VOICE_GO',
    WIN: 'VOICE_YOU_WIN',
    LOSS: 'VOICE_GAME_OVER',
  },
}
