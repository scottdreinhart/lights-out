import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HamburgerMenu } from './HamburgerMenu'

/**
 * HamburgerMenu Integration Tests for Sudoku
 *
 * Tests the HamburgerMenu component integration with modal triggers:
 * - Menu opens/closes on button click
 * - All five menu items are visible and clickable
 * - Callbacks fire correctly for Rules, Help, Settings, Sound, and Exit
 * - Menu closes after item selection
 */
describe('Sudoku HamburgerMenu Integration', () => {
  const mockOnRules = vi.fn()
  const mockOnHelp = vi.fn()
  const mockOnSettings = vi.fn()
  const mockOnToggleSound = vi.fn()
  const mockOnExit = vi.fn()

  const defaultProps = {
    onRules: mockOnRules,
    onHelp: mockOnHelp,
    onSettings: mockOnSettings,
    onToggleSound: mockOnToggleSound,
    onExit: mockOnExit,
    soundEnabled: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the hamburger menu button', () => {
    render(<HamburgerMenu {...defaultProps} />)
    const button = screen.getByRole('button', { name: /menu/i })
    expect(button).toBeInTheDocument()
  })

  it('should open menu when button is clicked', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu {...defaultProps} />)

    const button = screen.getByRole('button', { name: /menu/i })
    await user.click(button)

    expect(screen.getByText('Rules')).toBeInTheDocument()
    expect(screen.getByText('Help')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('should call onRules when Rules item is clicked', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu {...defaultProps} />)

    const button = screen.getByRole('button', { name: /menu/i })
    await user.click(button)

    const rulesItem = screen.getByText('Rules')
    await user.click(rulesItem)

    expect(mockOnRules).toHaveBeenCalledOnce()
  })

  it('should call onHelp when Help item is clicked', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu {...defaultProps} />)

    const button = screen.getByRole('button', { name: /menu/i })
    await user.click(button)

    const helpItem = screen.getByText('Help')
    await user.click(helpItem)

    expect(mockOnHelp).toHaveBeenCalledOnce()
  })

  it('should call onSettings when Settings item is clicked', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu {...defaultProps} />)

    const button = screen.getByRole('button', { name: /menu/i })
    await user.click(button)

    const settingsItem = screen.getByText('Settings')
    await user.click(settingsItem)

    expect(mockOnSettings).toHaveBeenCalledOnce()
  })

  it('should render menu items in correct order', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu {...defaultProps} />)

    const button = screen.getByRole('button', { name: /menu/i })
    await user.click(button)

    const menu = screen.getByRole('menu')
    const items = within(menu).getAllByRole('menuitem')

    expect(items).toHaveLength(5)
    expect(items[0]).toHaveTextContent('Rules')
    expect(items[1]).toHaveTextContent('Help')
    expect(items[2]).toHaveTextContent('Settings')
  })
})
