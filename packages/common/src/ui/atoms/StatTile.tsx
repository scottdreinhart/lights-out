interface StatTileProps {
  label: string
  value: number
}

export const StatTile = ({ label, value }: StatTileProps) => (
  <div>
    <dt>{label}</dt>
    <dd>{value}</dd>
  </div>
)
