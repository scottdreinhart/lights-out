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
  appId: 'simon',
  title: 'Simon',
  baseGenre: 'memory-rhythm',
  arcadeType: 'survival-rhythm',
  phase: 'scaffold-v1',
  targetMechanics: ['tempo-ramp', 'mistake-budget', 'combo-chain'],
}
