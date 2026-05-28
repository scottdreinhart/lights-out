/**
 * TODO: PURPOSE
 * TODO: Show score and bonus values in a compact HUD section.
 *
 * TODO: RESPONSIBILITY
 * TODO: Present score-only values; no game-state mutation.
 *
 * TODO: INPUTS
 * TODO: `score` and `bonusTimer` numeric props.
 *
 * TODO: OUTPUTS
 * TODO: HUD markup composed from atom labels.
 *
 * TODO: DEPENDENCIES
 * TODO: Depends only on HudLabel atom.
 *
 * TODO: EDGE CASES
 * TODO: Supports zero values without special formatting.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Stateless component with shallow prop surface.
 */
import { HudLabel } from '../atoms'

interface ScorePanelProps {
  score: number
  bonusTimer: number
}

export const ScorePanel = ({ score, bonusTimer }: ScorePanelProps) => (
  <>
    <HudLabel label="Score" value={score} />
    <HudLabel label="Bonus" value={bonusTimer} />
  </>
)
