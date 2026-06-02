/**
 * TODO: PURPOSE
 * TODO: Show lives and level metadata in a compact HUD section.
 *
 * TODO: RESPONSIBILITY
 * TODO: Presentation-only molecule for life/level values.
 *
 * TODO: INPUTS
 * TODO: `lives` and `level` numeric props.
 *
 * TODO: OUTPUTS
 * TODO: HUD label blocks.
 *
 * TODO: DEPENDENCIES
 * TODO: Depends only on HudLabel atom.
 *
 * TODO: EDGE CASES
 * TODO: Handles zero-lives display without additional branching.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Pure molecule with minimal render surface.
 */
import { HudLabel } from '../atoms'

interface LivesPanelProps {
  lives: number
  level: number
}

export const LivesPanel = ({ lives, level }: LivesPanelProps) => (
  <>
    <HudLabel label="Lives" value={lives} />
    <HudLabel label="Level" value={level} />
  </>
)
