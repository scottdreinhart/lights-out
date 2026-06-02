import { AboutModal as SharedAboutModal } from '@games/bingo-ui-components/organisms'

export interface AboutModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

/**
 * About modal adapter displaying game information, features, variants, technology, and platform info.
 * Consolidated UX: Focuses on game overview, variants, features, author, and related games.
 * Visual pattern examples have been moved to RulesModal (How to Play) for better context.
 */
export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const FEATURES = [
    { emoji: '🎰', title: 'Classic Bingo', description: 'Authentic 75/80-ball game experience' },
    { emoji: '📊', title: 'Pattern Recognition', description: 'Multiple winning patterns to play' },
    {
      emoji: '🚀',
      title: 'Progressive Play',
      description: 'Increasing difficulty levels and jackpots',
    },
    {
      emoji: '🎨',
      title: 'Themed Variants',
      description: 'Mini 30-ball and Swedish 80-ball versions',
    },
    { emoji: '⚡', title: 'Instant Feedback', description: 'Real-time validation and marking' },
    { emoji: '🎵', title: 'Sound Effects', description: 'Immersive audio experience' },
  ]

  const ABOUT_TEXT = (
    <div>
      <p>
        Bingo is a classic game of chance combined with strategy. Mark numbers on your card as they
        are drawn, and be the first to complete a winning pattern. Whether you prefer the
        traditional 75-ball American format, the 80-ball Swedish version, or fast-paced 30-ball Mini
        Bingo, you will find the perfect variation here.
      </p>
      <p>
        Enjoy responsive gameplay optimized for all devices while enjoying a smooth, accessible
        gaming experience across all platforms.
      </p>
    </div>
  )

  const TECHNOLOGY_CONTENT = (
    <p>
      Built with <strong>React</strong>, <strong>TypeScript</strong>, and <strong>Vite</strong>.
      Designed for performance, accessibility, and responsive gameplay across desktop, tablet, and
      mobile devices.
    </p>
  )

  const AUTHOR_CONTENT = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Created by Scott Reinhart</div>
        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
          Independent game developer focused on accessible, cross-platform puzzle and strategy
          experiences.
        </p>
      </div>
    </div>
  )

  const MORE_GAMES_CONTENT = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
        Explore more games from the Game Platform:
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: 'var(--surface, rgba(0, 0, 0, 0.02))',
            borderRadius: '6px',
            color: 'var(--primary)',
            fontWeight: 500,
            fontSize: '0.9rem',
            textAlign: 'center',
            border: '1px solid var(--border, #ddd)',
          }}
        >
          ⭕ Tic-Tac-Toe
        </div>
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: 'var(--surface, rgba(0, 0, 0, 0.02))',
            borderRadius: '6px',
            color: 'var(--primary)',
            fontWeight: 500,
            fontSize: '0.9rem',
            textAlign: 'center',
            border: '1px solid var(--border, #ddd)',
          }}
        >
          💣 Minesweeper
        </div>
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: 'var(--surface, rgba(0, 0, 0, 0.02))',
            borderRadius: '6px',
            color: 'var(--primary)',
            fontWeight: 500,
            fontSize: '0.9rem',
            textAlign: 'center',
            border: '1px solid var(--border, #ddd)',
          }}
        >
          🔢 Sudoku
        </div>
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: 'var(--surface, rgba(0, 0, 0, 0.02))',
            borderRadius: '6px',
            color: 'var(--primary)',
            fontWeight: 500,
            fontSize: '0.9rem',
            textAlign: 'center',
            border: '1px solid var(--border, #ddd)',
          }}
        >
          ⚫ Checkers
        </div>
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: 'var(--surface, rgba(0, 0, 0, 0.02))',
            borderRadius: '6px',
            color: 'var(--primary)',
            fontWeight: 500,
            fontSize: '0.9rem',
            textAlign: 'center',
            border: '1px solid var(--border, #ddd)',
          }}
        >
          🎮 All Games
        </div>
      </div>
    </div>
  )

  const VARIANTS = [
    {
      name: 'Classic (75-ball)',
      description: 'Traditional American Bingo with 5×5 grid',
    },
    {
      name: 'Swedish (80-ball)',
      description: 'European format with 4×4 grid',
    },
    {
      name: 'Mini (30-ball)',
      description: 'Quick 3×3 games for fast-paced play',
    },
    {
      name: 'Progressive',
      description: 'Advance through difficulty levels with increasing jackpots',
    },
    {
      name: 'Pattern',
      description: 'Win with special patterns (X, T, corners, frames, and more)',
    },
  ]

  return (
    <SharedAboutModal
      isOpen={isOpen}
      onClose={onClose}
      title="About Bingo"
      aboutText={ABOUT_TEXT}
      features={FEATURES}
      variants={VARIANTS}
      technology={TECHNOLOGY_CONTENT}
      author={AUTHOR_CONTENT}
      moreGames={MORE_GAMES_CONTENT}
    />
  )
}
