interface ActionButtonProps {
  label: string
  onClick: () => void
}

export const ActionButton = ({ label, onClick }: ActionButtonProps) => (
  <button onClick={onClick} type="button">
    {label}
  </button>
)
