import './Cell.css'

interface CellProps {
  isLit: boolean
  onClick: () => void
  row: number
  col: number
  isSelected?: boolean
}

export function Cell({ isLit, onClick, row, col, isSelected = false }: CellProps) {
  return (
    <button
      className={`cell ${isLit ? 'lit' : 'unlit'} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      aria-label={`Cell ${row + 1}, ${col + 1} - ${isLit ? 'on' : 'off'}${isSelected ? ', selected' : ''}`}
      title={`Row ${row + 1}, Col ${col + 1}`}
    />
  )
}
