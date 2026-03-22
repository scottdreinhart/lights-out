interface DifficultyOption {
  id: string
  label: string
}

interface DifficultySelectProps {
  value: string
  onChange: (value: string) => void
  options: DifficultyOption[]
  label?: string
}

export function DifficultySelect({
  value,
  onChange,
  options,
  label = 'Difficulty',
}: DifficultySelectProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label htmlFor="difficulty-select" style={{ fontWeight: 500 }}>
        {label}
      </label>
      <select
        id="difficulty-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid var(--theme-accent, #667eea)',
          backgroundColor: 'var(--theme-card, #1f1f2e)',
          color: 'var(--theme-fg, #e0e0e0)',
          cursor: 'pointer',
          minHeight: '44px',
        }}
      >
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
