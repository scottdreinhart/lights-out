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
  appId: 'tictactoe',
  title: 'Three in a Row',
  baseGenre: 'grid-strategy',
  arcadeType: 'grid-sprint',
  phase: 'scaffold-v1',
  targetMechanics: ['blitz-rounds', 'win-streaks', 'timer-bonus'],
}
