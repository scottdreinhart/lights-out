export type ArcadeConversionPhase = 'scaffold-v1' | 'input-wired-v1'

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
  appId: 'snake',
  title: 'Snake',
  baseGenre: 'trail-navigation',
  arcadeType: 'light-cycle-survival',
  phase: 'input-wired-v1',
  targetMechanics: ['speed-ramp', 'arena-pressure', 'survival-chain-score'],
}
