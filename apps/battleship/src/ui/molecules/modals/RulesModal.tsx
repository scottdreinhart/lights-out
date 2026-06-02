/**
 * Rules Modal Adapter for Battleship App
 * Wraps the shared RulesModal component from @games/bingo-ui-components
 * with Battleship-specific instructions and controls.
 */

import { RulesModal as SharedRulesModal } from '@games/bingo-ui-components/organisms'

export interface RulesModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  return (
    <SharedRulesModal
      isOpen={isOpen}
      onClose={onClose}
      title="How to Play Battleship"
      sections={[
        {
          heading: 'Objective',
          content: (
            <p>Place your fleet, then sink the enemy ships before your own fleet is destroyed.</p>
          ),
        },
        {
          heading: 'Getting Started',
          content: (
            <ol>
              <li>Select a difficulty on the landing screen.</li>
              <li>Place all ships on your board before the battle begins.</li>
              <li>Use the rotate control to switch ship orientation during placement.</li>
              <li>Attack enemy squares by clicking cells on the battle board.</li>
              <li>Win by destroying every enemy ship.</li>
            </ol>
          ),
        },
        {
          heading: 'Controls',
          content: (
            <ul>
              <li>New Game: restart the current match.</li>
              <li>Settings: adjust theme and other preferences.</li>
              <li>About: view game information and platform details.</li>
            </ul>
          ),
        },
        {
          heading: 'Tips',
          content: (
            <ul>
              <li>Use placement strategy to avoid clustering your ships.</li>
              <li>Track hits and misses to infer the enemy fleet layout.</li>
              <li>Try harder difficulties once you are comfortable with the basics.</li>
            </ul>
          ),
        },
      ]}
    />
  )
}
