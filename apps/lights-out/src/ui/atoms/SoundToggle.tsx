interface SoundToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
}

export function SoundToggle({ enabled, onChange, label = 'Sound Effects' }: SoundToggleProps) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        cursor: 'pointer',
        padding: '0.5rem',
      }}
    >
      <input
        id="sound-toggle"
        type="checkbox"
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        style={{ cursor: 'pointer', width: '20px', height: '20px' }}
      />
      <span>{label}</span>
    </label>
  )
}
