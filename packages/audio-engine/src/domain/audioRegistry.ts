import type { AudioAsset } from './audioTypes'

/**
 * Audio Asset Registry
 * 
 * Curated high-quality loops and stingers from OpenGameArt.
 * These are categorized and mapped for use in arcade applications.
 * 
 * NOTE: Assets should be downloaded and placed in /assets/audio/
 * for local production use.
 */

export const ARCADE_LOOPS: Record<string, AudioAsset> = {
  PUZZLE_UPBEAT: {
    id: 'PUZZLE_UPBEAT',
    src: ['/audio/music/four_loop.mp3'],
    category: 'music',
    loop: true,
    volume: 0.5,
  },
  ACTION_CHASE: {
    id: 'ACTION_CHASE',
    src: ['/audio/music/fast_background.mp3'],
    category: 'music',
    loop: true,
    volume: 0.6,
  },
  TECHNO_LEVEL: {
    id: 'TECHNO_LEVEL',
    src: ['/audio/music/Just Saying Tho.ogg'],
    category: 'music',
    loop: true,
    volume: 0.5,
  },
  WINTER_ICE: {
    id: 'WINTER_ICE',
    src: ['/audio/music/Winter Dust.ogg'],
    category: 'music',
    loop: true,
    volume: 0.4,
  },
}

export const CHIPTUNE_PACK: Record<string, AudioAsset> = {
  BOSS_BATTLE: {
    id: 'BOSS_BATTLE',
    src: ['/audio/music/surpass_your_limits.mp3'],
    category: 'music',
    loop: true,
    volume: 0.7,
  },
  DANGER_LEVEL: {
    id: 'DANGER_LEVEL',
    src: ['/audio/music/danger.mp3'],
    category: 'music',
    loop: true,
    volume: 0.6,
  },
  SPEEDRUN_TIMER: {
    id: 'SPEEDRUN_TIMER',
    src: ['/audio/music/time_is_ticking.mp3'],
    category: 'music',
    loop: true,
    volume: 0.6,
  },
  HOME_MENU: {
    id: 'HOME_MENU',
    src: ['/audio/music/home_menu.mp3'],
    category: 'music',
    loop: true,
    volume: 0.4,
  },
}

export const AUDIO_CATALOG = {
  ...ARCADE_LOOPS,
  ...CHIPTUNE_PACK,
}

/**
 * License Metadata & Attribution
 * 
 * | ID | Author | License | Source |
 * | -- | ------ | ------- | ------ |
 * | PUZZLE_UPBEAT | Various | CC0 | https://opengameart.org/content/music-loops |
 * | BOSS_BATTLE | Preston Peak | CC-BY 4.0 | https://opengameart.org/content/free-action-chiptune-music-pack |
 * | TECHNO_LEVEL | various | CC0 | https://opengameart.org/content/short-loops-background-music-pack |
 */
