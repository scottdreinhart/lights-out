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
  appId: 'connect-four',
  title: 'Column Drop',
  baseGenre: 'grid-strategy',
  arcadeType: 'drop-rush',
  phase: 'scaffold-v1',
  targetMechanics: ['shot-clock', 'combo-lines', 'streak-wins'],
}
