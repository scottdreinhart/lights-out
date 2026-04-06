/**
 * About Modal Adapter for Battleship App
 * Wraps the shared AboutModal component from @games/bingo-ui-components
 * with Battleship-specific game information and features.
 */

import { AboutModal as SharedAboutModal, type Feature } from '@games/bingo-ui-components/organisms'

export interface AboutModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

/**
 * About modal — Battleship game information and credits.
 * Displays game description, features, and technology stack.
 */
export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const features: Feature[] = [
    {
      emoji: '⚓',
      title: 'Strategic Placement',
      description: 'Position your fleet strategically before battle begins',
    },
    {
      emoji: '🤖',
      title: 'Intelligent AI',
      description: 'AI opponent uses probability density targeting algorithm',
    },
    {
      emoji: '⚡',
      title: 'Multiple Difficulties',
      description: 'Play against Easy, Medium, Hard, or Expert AI',
    },
    {
      emoji: '🎨',
      title: 'Custom Themes',
      description: 'Choose from multiple color themes and visual styles',
    },
    {
      emoji: '🔊',
      title: 'Sound & Music',
      description: 'Full audio control with effects and background music',
    },
    {
      emoji: '📱',
      title: 'Responsive Design',
      description: 'Play seamlessly on desktop, tablet, and mobile devices',
    },
  ]

  const aboutText = (
    <div>
      <p>
        A digital implementation of the classic naval strategy game. Place your fleet strategically
        and engage in tactical combat against an intelligent AI opponent.
      </p>
      <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', opacity: 0.8 }}>
        Test your tactical thinking and prediction skills in this timeless game of strategy and
        chance.
      </p>
    </div>
  )

  const technology = (
    <ul style={{ listStyle: 'none', padding: 0, gap: '0.5rem' }}>
      <li>✓ React 19 with TypeScript</li>
      <li>✓ AssemblyScript WASM AI engine</li>
      <li>✓ Web Workers for background processing</li>
      <li>✓ Vite build tool</li>
      <li>✓ CSS Modules with responsive design</li>
      <li>✓ WCAG 2.1 AA accessibility compliance</li>
    </ul>
  )

  return (
    <SharedAboutModal
      isOpen={isOpen}
      onClose={onClose}
      title="Battleship"
      aboutText={aboutText}
      features={features}
      technology={technology}
    />
  )
}
