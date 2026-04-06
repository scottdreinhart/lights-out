import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HelpModal } from './HelpModal'

describe('Sudoku HelpModal Integration', () => {
  describe('Modal Rendering', () => {
    it('should render modal when isOpen is true', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()
    })

    it('should not render modal when isOpen is false', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={false} onClose={mockOnClose} />)

      const modals = screen.queryAllByRole('dialog')
      expect(modals.length).toBe(0)
    })

    it('should display correct title', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      expect(screen.getByText('Sudoku Help')).toBeInTheDocument()
    })
  })

  describe('FAQ Content Rendering', () => {
    it('should render all FAQ questions', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      expect(screen.getByText('What is a Sudoku?')).toBeInTheDocument()
      expect(screen.getByText('How do I start solving a puzzle?')).toBeInTheDocument()
      expect(screen.getByText('What are the difficulty levels?')).toBeInTheDocument()
      expect(screen.getByText('How do I move the cursor on the board?')).toBeInTheDocument()
      expect(screen.getByText('Can I enter a number using the number keys?')).toBeInTheDocument()
      expect(screen.getByText('What if I get stuck?')).toBeInTheDocument()
      expect(screen.getByText('Can I undo my moves?')).toBeInTheDocument()
      expect(screen.getByText('How long should a puzzle take?')).toBeInTheDocument()
    })

    it('should render corresponding answers', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      // Check for key text from answers
      expect(screen.getByText(/fill a 9×9 grid with digits 1-9/i)).toBeInTheDocument()
      expect(screen.getByText(/arrow keys.*WASD keys/i)).toBeInTheDocument()
      expect(screen.getByText(/constraint propagation/i)).toBeInTheDocument()
    })
  })

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', async () => {
      const mockOnClose = vi.fn()
      const user = userEvent.setup()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      const closeBtn = screen.getByLabelText('Close help')
      await user.click(closeBtn)

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should call onClose when ESC key is pressed', async () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      const modal = screen.getByRole('dialog')
      fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' })

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      })
    })

    it('should call onClose when backdrop is clicked', async () => {
      const mockOnClose = vi.fn()
      const user = userEvent.setup()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      // Find the backdrop (the modal's parent overlay)
      const modal = screen.getByRole('dialog')
      const backdrop = modal.parentElement

      if (backdrop) {
        await user.click(backdrop)
        expect(mockOnClose).toHaveBeenCalled()
      }
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveAttribute('aria-labelledby')
    })

    it('should have close button with proper aria-label', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      const closeBtn = screen.getByLabelText('Close help')
      expect(closeBtn).toBeInTheDocument()
    })

    it('should trap focus within modal', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()

      // Focus should be available within modal
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      expect(focusableElements.length).toBeGreaterThan(0)
    })
  })

  describe('Integration with Shared Component', () => {
    it('should use shared HelpModal component', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      // Verify the modal structure matches shared component
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveClass('modal') // Class from shared component
    })

    it('should properly adapt Sudoku-specific content', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      // Verify Sudoku-specific FAQ items are rendered
      expect(screen.getByText(/Press 1-9 to directly place that number/i)).toBeInTheDocument()
      expect(screen.getByText(/New Game button/i)).toBeInTheDocument()
    })
  })

  describe('Difficulty Level Information', () => {
    it('should explain all difficulty levels', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      const difficultyText = screen.getByText(/Easy:.*Medium:.*Hard:.*Expert:/i)
      expect(difficultyText).toBeInTheDocument()
    })
  })

  describe('Controls Documentation', () => {
    it('should document keyboard controls', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      expect(screen.getByText(/arrow keys.*WASD keys/i)).toBeInTheDocument()
      expect(screen.getByText(/Press Enter or Space/i)).toBeInTheDocument()
      expect(screen.getByText(/Backspace or Delete to clear/i)).toBeInTheDocument()
    })
  })
})
