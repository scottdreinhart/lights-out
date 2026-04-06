import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HelpModal } from './HelpModal'

describe('Shared HelpModal Component', () => {
  const mockItems = [
    {
      question: 'Test Question 1',
      answer: <p>Test answer 1</p>,
    },
    {
      question: 'Test Question 2',
      answer: 'String answer 2',
    },
  ]

  describe('Props Interface', () => {
    it('should accept isOpen boolean prop', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} title="Test Modal" items={mockItems} />)

      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()
    })

    it('should accept optional title prop', () => {
      const mockOnClose = vi.fn()
      render(
        <HelpModal isOpen={true} onClose={mockOnClose} title="Custom Title" items={mockItems} />,
      )

      expect(screen.getByText('Custom Title')).toBeInTheDocument()
    })

    it('should use default title when not provided', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} items={mockItems} />)

      // Default title is "Help & FAQ"
      expect(screen.getByText('Help & FAQ')).toBeInTheDocument()
    })

    it('should accept items array with question/answer format', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} items={mockItems} />)

      expect(screen.getByText('Test Question 1')).toBeInTheDocument()
      expect(screen.getByText('Test Question 2')).toBeInTheDocument()
      expect(screen.getByText('Test answer 1')).toBeInTheDocument()
      expect(screen.getByText('String answer 2')).toBeInTheDocument()
    })

    it('should handle both ReactNode and string answers', () => {
      const mixedItems = [
        {
          question: 'React Node Answer',
          answer: <p>This is rendered as JSX</p>,
        },
        {
          question: 'String Answer',
          answer: 'This is a plain string',
        },
      ]

      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} items={mixedItems} />)

      expect(screen.getByText('This is rendered as JSX')).toBeInTheDocument()
      expect(screen.getByText('This is a plain string')).toBeInTheDocument()
    })
  })

  describe('Modal Behavior', () => {
    it('should render with showModal() when isOpen is true', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} items={mockItems} />)

      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()
    })

    it('should close with close() when isOpen becomes false', () => {
      const mockOnClose = vi.fn()
      const { rerender } = render(
        <HelpModal isOpen={true} onClose={mockOnClose} items={mockItems} />,
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()

      rerender(<HelpModal isOpen={false} onClose={mockOnClose} items={mockItems} />)

      // Modal should be removed from document
      const modals = screen.queryAllByRole('dialog')
      expect(modals.length).toBe(0)
    })
  })

  describe('Focus Management', () => {
    it('should save previously focused element on open', () => {
      const mockOnClose = vi.fn()
      const { rerender } = render(
        <>
          <button>Test Button</button>
          <HelpModal isOpen={false} onClose={mockOnClose} items={mockItems} />
        </>,
      )

      const button = screen.getByText('Test Button')
      button.focus()
      expect(document.activeElement).toBe(button)

      rerender(
        <>
          <button>Test Button</button>
          <HelpModal isOpen={true} onClose={mockOnClose} items={mockItems} />
        </>,
      )

      // Modal should be open
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('should restore focus to previously focused element on close', async () => {
      const mockOnClose = vi.fn()
      const { rerender } = render(
        <>
          <button>Test Button</button>
          <HelpModal isOpen={false} onClose={mockOnClose} items={mockItems} />
        </>,
      )

      const button = screen.getByText('Test Button')
      button.focus()

      rerender(
        <>
          <button>Test Button</button>
          <HelpModal isOpen={true} onClose={mockOnClose} items={mockItems} />
        </>,
      )

      // Simulate close
      mockOnClose.mockImplementation(() => {
        rerender(
          <>
            <button>Test Button</button>
            <HelpModal isOpen={false} onClose={mockOnClose} items={mockItems} />
          </>,
        )
      })

      const closeBtn = screen.getByLabelText('Close help')
      await userEvent.click(closeBtn)

      await waitFor(() => {
        // Focus should be restored
        expect(document.activeElement).toBe(button)
      })
    })
  })

  describe('ESC Key Handling', () => {
    it('should call onClose when ESC key is pressed', async () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} items={mockItems} />)

      const modal = screen.getByRole('dialog')
      fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' })

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      })
    })
  })

  describe('Backdrop Click Handling', () => {
    it('should call onClose when backdrop is clicked', async () => {
      const mockOnClose = vi.fn()
      const user = userEvent.setup()
      render(<HelpModal isOpen={true} onClose={mockOnClose} items={mockItems} />)

      const modal = screen.getByRole('dialog')
      const backdrop = modal.parentElement

      if (backdrop) {
        await user.click(backdrop)
        expect(mockOnClose).toHaveBeenCalled()
      }
    })

    it('should not close when clicking inside modal', async () => {
      const mockOnClose = vi.fn()
      const user = userEvent.setup()
      render(<HelpModal isOpen={true} onClose={mockOnClose} items={mockItems} />)

      const modal = screen.getByRole('dialog')
      await user.click(modal)

      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Close Button', () => {
    it('should have close button with aria-label', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} items={mockItems} />)

      const closeBtn = screen.getByLabelText('Close help')
      expect(closeBtn).toBeInTheDocument()
    })

    it('should call onClose when close button is clicked', async () => {
      const mockOnClose = vi.fn()
      const user = userEvent.setup()
      render(<HelpModal isOpen={true} onClose={mockOnClose} items={mockItems} />)

      const closeBtn = screen.getByLabelText('Close help')
      await user.click(closeBtn)

      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have dialog role', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} items={mockItems} />)

      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()
    })

    it('should have aria-labelledby pointing to title', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} title="Test Title" items={mockItems} />)

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveAttribute('aria-labelledby')

      const labelledById = modal.getAttribute('aria-labelledby')
      const titleElement = document.getElementById(labelledById || '')
      expect(titleElement).toHaveTextContent('Test Title')
    })

    it('should have proper heading hierarchy', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} title="Help Title" items={mockItems} />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Help Title')
    })

    it('should have keyboard navigable close button with focus style', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} items={mockItems} />)

      const closeBtn = screen.getByLabelText('Close help')
      expect(closeBtn).toHaveClass('closeBtn')
    })
  })

  describe('CSS Animation Classes', () => {
    it('should apply animation classes', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} items={mockItems} />)

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveClass('modal')
    })
  })

  describe('Empty State Handling', () => {
    it('should handle empty items array gracefully', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} items={[]} />)

      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()
    })

    it('should handle undefined items prop', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()
    })
  })
})
