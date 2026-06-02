/**
 * TODO: PURPOSE
 * TODO: Encapsulate Howler-based one-shot SFX triggers for game events.
 *
 * TODO: RESPONSIBILITY
 * TODO: Own sound asset registration and safe playback APIs.
 *
 * TODO: INPUTS
 * TODO: Event-specific play calls from runtime orchestration.
 *
 * TODO: OUTPUTS
 * TODO: Fire-and-forget audio playback side effects.
 *
 * TODO: DEPENDENCIES
 * TODO: howler only; no domain coupling.
 *
 * TODO: EDGE CASES
 * TODO: Missing assets or autoplay restrictions must fail gracefully.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Reuse Howl instances to avoid allocation churn during gameplay.
 */
import type { SoundEventType } from '@/domain'
import { Howl } from 'howler'

const sounds = {
  jump: new Howl({ src: ['/sounds/jump.mp3'], volume: 0.4 }),
  hit: new Howl({ src: ['/sounds/hit.mp3'], volume: 0.5 }),
  score: new Howl({ src: ['/sounds/score.mp3'], volume: 0.45 }),
}

const safePlay = (sound: Howl): void => {
  try {
    sound.play()
  } catch {
    // Ignore playback failures (missing asset, autoplay policies, etc.).
  }
}

export const audioManager = {
  playJump: () => safePlay(sounds.jump),
  playHit: () => safePlay(sounds.hit),
  playScore: () => safePlay(sounds.score),
  play: (type: SoundEventType) => {
    switch (type) {
      case 'jump':
        safePlay(sounds.jump)
        break
      case 'death':
        safePlay(sounds.hit)
        break
      case 'score':
      case 'levelComplete':
      case 'start':
        safePlay(sounds.score)
        break
      default:
        break
    }
  },
}
