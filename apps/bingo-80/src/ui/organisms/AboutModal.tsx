/**
 * About Modal Adapter for Bingo-80 App
 * Wraps the shared AboutModal component with bingo-80-specific information.
 */

import { AboutModal as SharedAboutModal } from '@games/bingo-ui-components'

export interface AboutModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

// Accept shared content props and forward them to the shared AboutModal
export interface AboutModalExtraProps {
  readonly aboutText?: any
  readonly technology?: any
}

/**
 * About modal adapter displaying game information for Swedish 80-ball Bingo.
 */
export function AboutModal({
  isOpen,
  onClose,
  aboutText,
  technology,
}: AboutModalProps & AboutModalExtraProps) {
  const ABOUT_TEXT = (
    <div>
      <p>
        Swedish 80-ball Bingo brings the classic game experience to your device. Mark numbers on
        your cards and be the first to complete a winning pattern. Play multiple cards
        simultaneously for more excitement!
      </p>
      <p>
        Enjoy responsive gameplay optimized for all devices with a smooth, accessible gaming
        experience.
      </p>
    </div>
  )

  const TECHNOLOGY_CONTENT = (
    <p>
      Built with <strong>React</strong>, <strong>TypeScript</strong>, and <strong>Vite</strong>.
      Designed for performance, accessibility, and responsive gameplay across all devices.
    </p>
  )

  return (
    <SharedAboutModal
      isOpen={isOpen}
      onClose={onClose}
      title="About Bingo 80"
      aboutText={aboutText ?? ABOUT_TEXT}
      technology={technology ?? TECHNOLOGY_CONTENT}
    />
  )
}
