import { AUDIO_CATALOG, STINGERS } from '@games/audio-engine'

/**
 * Arc Spin Sound Profile
 */

export const SOUND_PROFILE = {
  MUSIC: {
    NORMAL: AUDIO_CATALOG.PUZZLE_UPBEAT,
    HIGH_SCORE: STINGERS.VICTORY_FANFARE,
    GAME_OVER: STINGERS.GAME_OVER_DIRGE,
  },

  ACTIONS: {
    PADDLE_HIT: { frequency: 440, duration: 0.1, waveform: 'triangle' as const },
    WALL_HIT: { frequency: 220, duration: 0.05, waveform: 'square' as const },
    BRICK_HIT: { frequency: 660, duration: 0.1, waveform: 'square' as const },
  },
}
