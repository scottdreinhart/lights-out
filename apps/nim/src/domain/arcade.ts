export type ArcadeConversionPhase = 'scaffold-v1'

export interface ArcadeConversionProfile {
  readonly appId: string
  readonly title: string
  readonly baseGenre: string
  readonly arcadeType: string
  readonly phase: ArcadeConversionPhase
  readonly targetMechanics: readonly string[]
}

export const ARCADE_MODE_ENABLED = true
export const ARCADE_CONVERSION_PROFILE: ArcadeConversionProfile = {
  appId: 'nim',
  title: 'Nim',
  baseGenre: 'abstract-strategy',
  arcadeType: 'blitz-duel',
  phase: 'scaffold-v1',
  targetMechanics: ['turn-timer', 'quick-match-loop', 'streak-scoring'],
}
