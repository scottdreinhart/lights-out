export type SoundEventType = 'start' | 'jump' | 'score' | 'death' | 'levelComplete'

export interface SoundEvent {
  id: number
  type: SoundEventType
}
