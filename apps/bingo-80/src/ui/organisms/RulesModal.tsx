/**
 * Rules Modal Adapter for Bingo-80 App
 * Wraps the shared RulesModal component with bingo-80-specific game rules and instructions.
 */

import { RulesModal as SharedRulesModal } from '@games/bingo-ui-components'

export interface RulesModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly title?: string
  readonly sections?: any[]
}

export function RulesModal({ isOpen, onClose, title, sections }: RulesModalProps) {
  const RULES_SECTIONS = [
    {
      heading: 'Objective',
      content: (
        <p>
          Mark numbers on your Bingo card as they are drawn. Be the first to complete a winning
          pattern and call out "Bingo!" to win.
        </p>
      ),
    },
    {
      heading: 'How to Play',
      content: (
        <ol style={{ marginLeft: '1.5rem' }}>
          <li>
            <strong>Generate a Card</strong> — Click &quot;New Card&quot; to generate a randomized
            Bingo card with numbers 1-80
          </li>
          <li>
            <strong>Draw Numbers</strong> — Click &quot;Draw&quot; to randomly select the next
            number
          </li>
          <li>
            <strong>Mark Your Card</strong> — Click on numbers on your card as they&apos;re drawn
          </li>
          <li>
            <strong>Complete a Pattern</strong> — Form a winning pattern on your card
          </li>
          <li>
            <strong>Win</strong> — Call &quot;Bingo!&quot; when you complete a pattern
          </li>
        </ol>
      ),
    },
    {
      heading: 'Swedish 80-Ball Format',
      content: (
        <p>
          This variant uses numbers 1-80 and classic winning patterns. Play multiple cards
          simultaneously to increase your chances of winning!
        </p>
      ),
    },
    {
      heading: 'Tips',
      content: (
        <ul style={{ marginLeft: '1.5rem' }}>
          <li>Watch the drawn numbers area to track which numbers have been called</li>
          <li>Click numbers on your card to mark them (they&apos;ll turn a different color)</li>
          <li>Use the Hints feature to highlight potential winning patterns</li>
          <li>Play at your own pace — there&apos;s no time limit</li>
          <li>Try multiple cards for more excitement</li>
        </ul>
      ),
    },
  ]

  return (
    <SharedRulesModal
      isOpen={isOpen}
      onClose={onClose}
      title={title ?? 'How to Play Bingo 80'}
      sections={sections ?? RULES_SECTIONS}
    />
  )
}
