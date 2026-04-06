import { SettingsModal as SharedSettingsModal, type SettingsSection } from '@games/bingo-ui-components/organisms'

export interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * SettingsModal — Sudoku Game Settings
 *
 * Displays game configuration and user preferences for Sudoku.
 * Adapted from the shared SettingsModal component with Sudoku-specific settings.
 */
export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const sections: SettingsSection[] = [
    {
      title: 'Gameplay',
      description: 'Configure puzzle difficulty and gameplay behavior',
      settings: [
        {
          label: 'Difficulty Level',
          hint: 'Easy, Medium, Hard, or Expert',
          type: 'select',
          value: 'medium',
          options: ['Easy', 'Medium', 'Hard', 'Expert'],
        },
        {
          label: 'Show Conflicts',
          hint: 'Highlight duplicate numbers in the same row, column, or box',
          type: 'toggle',
          value: true,
        },
        {
          label: 'Show Candidates',
          hint: 'Display possible numbers for each empty cell',
          type: 'toggle',
          value: false,
        },
      ],
    },
    {
      title: 'Display & Theme',
      description: 'Customize the look and feel of the game',
      settings: [
        {
          label: 'Color Theme',
          hint: 'Choose between light, dark, or high contrast',
          type: 'select',
          value: 'dark',
          options: ['Light', 'Dark', 'High Contrast'],
        },
        {
          label: 'Number Font Size',
          hint: 'Adjust the size of numbers on the grid',
          type: 'range',
          value: 16,
          min: 12,
          max: 24,
        },
        {
          label: 'Highlight Related Cells',
          hint: 'Highlight the row, column, and box for the selected cell',
          type: 'toggle',
          value: true,
        },
      ],
    },
    {
      title: 'Audio',
      description: 'Control sound effects and audio feedback',
      settings: [
        {
          label: 'Sound Effects',
          hint: 'Enable/disable move and placement sounds',
          type: 'toggle',
          value: true,
        },
        {
          label: 'Master Volume',
          hint: 'Adjust overall volume level',
          type: 'range',
          value: 80,
          min: 0,
          max: 100,
        },
      ],
    },
    {
      title: 'Accessibility',
      description: 'Optimize the game for your needs',
      settings: [
        {
          label: 'Keyboard Only Mode',
          hint: 'Use only keyboard for input; mouse support disabled',
          type: 'toggle',
          value: false,
        },
        {
          label: 'High Contrast Mode',
          hint: 'Increase contrast for better readability',
          type: 'toggle',
          value: false,
        },
        {
          label: 'Reduce Animations',
          hint: 'Minimize animated transitions for less distraction',
          type: 'toggle',
          value: false,
        },
      ],
    },
    {
      title: 'Data & Privacy',
      description: 'Manage your game data and privacy settings',
      settings: [
        {
          label: 'Save Game Progress',
          hint: 'Automatically save your current puzzle state',
          type: 'toggle',
          value: true,
        },
        {
          label: 'Clear Local Data',
          hint: 'Delete all saved puzzles and statistics (this cannot be undone)',
          type: 'button',
          btnLabel: 'Clear Data',
          action: 'clearLocalStorage',
        },
      ],
    },
  ]

  return <SharedSettingsModal isOpen={isOpen} onClose={onClose} sections={sections} />
}
