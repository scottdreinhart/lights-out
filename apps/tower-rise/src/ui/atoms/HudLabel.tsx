/**
 * TODO: PURPOSE
 * TODO: Render a consistent small HUD label/value pair.
 *
 * TODO: RESPONSIBILITY
 * TODO: Presentation-only atom for HUD metadata display.
 *
 * TODO: INPUTS
 * TODO: `label` string and `value` renderable primitive.
 *
 * TODO: OUTPUTS
 * TODO: Semantic HUD block element.
 *
 * TODO: DEPENDENCIES
 * TODO: React only.
 *
 * TODO: EDGE CASES
 * TODO: Supports numeric and string values without formatting side effects.
 *
 * TODO: PERFORMANCE NOTES
 * TODO: Small pure atom minimizes rerender cost.
 */
interface HudLabelProps {
  label: string
  value: number | string
}

export const HudLabel = ({ label, value }: HudLabelProps) => (
  <div>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
)
