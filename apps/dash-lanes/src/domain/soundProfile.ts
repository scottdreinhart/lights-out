import { AUDIO_CATALOG, STINGERS } from '@games/audio-engine'

/**
 * Dash Lanes Sound Profile
 */

export const SOUND_PROFILE = {
  MUSIC: {
    NORMAL: AUDIO_CATALOG.PUZZLE_UPBEAT,
    ACTION: AUDIO_CATALOG.ACTION_CHASE,
    GAME_OVER: STINGERS.GAME_OVER_DIRGE,
  },

  ACTIONS: {
    LANE_SHIFT: { frequency: 523, duration: 0.05, waveform: 'triangle' as const },
    DASH: { frequency: 880, duration: 0.2, waveform: 'sawtooth' as const },
    COLLISION: { frequency: 110, duration: 0.3, waveform: 'square' as const },
  },

  VOICE: {
    READY: 'VOICE_READY',
    GO: 'VOICE_GO',
  },
}
