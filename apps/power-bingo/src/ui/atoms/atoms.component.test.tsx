/**
 * Component tests for Power Bingo UI atoms
 * Tests PowerUpSlot, PowerUpInventory, and ProgressToNextPowerUp components
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PowerUpInventory } from './PowerUpInventory/PowerUpInventory'
import { PowerUpSlot } from './PowerUpSlot/PowerUpSlot'
import { ProgressToNextPowerUp } from './ProgressToNextPowerUp/ProgressToNextPowerUp'

// Mock the usePowerUpManager hook
const mockUsePowerUpManager = vi.fn()
vi.mock('../../app/hooks', () => ({
  usePowerUpManager: mockUsePowerUpManager,
}))

describe('PowerUpSlot', () => {
  it('renders power-up with correct icon and count', () => {
    const mockPowerUp = {
      type: 'AUTO_MARK' as const,
      usageCount: 2,
      maxUsages: 3,
      isActive: false,
    }

    mockUsePowerUpManager.mockReturnValue({
      inventory: [mockPowerUp],
      activatePowerUp: vi.fn(),
      deactivatePowerUp: vi.fn(),
      getRemainingUses: vi.fn(() => 2),
      progressToNextPowerUp: 0.5,
      nextPowerUpType: 'AUTO_MARK',
    })

    render(<PowerUpSlot powerUp={mockPowerUp} />)

    expect(screen.getByText('AUTO_MARK')).toBeInTheDocument()
    expect(screen.getByText('2/3')).toBeInTheDocument()
  })

  it('shows active state when power-up is active', () => {
    const mockPowerUp = {
      type: 'DOUBLE_POINTS' as const,
      usageCount: 1,
      maxUsages: 1,
      isActive: true,
    }

    mockUsePowerUpManager.mockReturnValue({
      inventory: [mockPowerUp],
      activatePowerUp: vi.fn(),
      deactivatePowerUp: vi.fn(),
      getRemainingUses: vi.fn(() => 1),
      progressToNextPowerUp: 0.3,
      nextPowerUpType: 'DOUBLE_POINTS',
    })

    render(<PowerUpSlot powerUp={mockPowerUp} />)

    // Check for active state styling (implementation dependent)
    const slot = screen.getByText('DOUBLE_POINTS').closest('div')
    expect(slot).toHaveClass('active') // Assuming CSS class for active state
  })

  it('calls activatePowerUp when clicked and has uses remaining', () => {
    const mockActivate = vi.fn()
    const mockPowerUp = {
      type: 'SHIELD' as const,
      usageCount: 1,
      maxUsages: 1,
      isActive: false,
    }

    mockUsePowerUpManager.mockReturnValue({
      inventory: [mockPowerUp],
      activatePowerUp: mockActivate,
      deactivatePowerUp: vi.fn(),
      getRemainingUses: vi.fn(() => 1),
      progressToNextPowerUp: 0.8,
      nextPowerUpType: 'SHIELD',
    })

    render(<PowerUpSlot powerUp={mockPowerUp} />)

    const slot = screen.getByText('SHIELD')
    slot.click()

    expect(mockActivate).toHaveBeenCalledWith('SHIELD')
  })
})

describe('PowerUpInventory', () => {
  it('renders all power-ups in inventory', () => {
    const mockInventory = [
      { type: 'AUTO_MARK' as const, usageCount: 2, maxUsages: 3, isActive: false },
      { type: 'INSTANT_PATTERN' as const, usageCount: 0, maxUsages: 1, isActive: false },
      { type: 'DOUBLE_POINTS' as const, usageCount: 1, maxUsages: 1, isActive: true },
      { type: 'SHIELD' as const, usageCount: 0, maxUsages: 1, isActive: false },
      { type: 'TIME_EXTEND' as const, usageCount: 0, maxUsages: 30, isActive: false },
    ]

    mockUsePowerUpManager.mockReturnValue({
      inventory: mockInventory,
      activatePowerUp: vi.fn(),
      deactivatePowerUp: vi.fn(),
      getRemainingUses: vi.fn(),
      progressToNextPowerUp: 0.2,
      nextPowerUpType: 'AUTO_MARK',
    })

    render(<PowerUpInventory />)

    expect(screen.getByText('AUTO_MARK')).toBeInTheDocument()
    expect(screen.getByText('INSTANT_PATTERN')).toBeInTheDocument()
    expect(screen.getByText('DOUBLE_POINTS')).toBeInTheDocument()
    expect(screen.getByText('SHIELD')).toBeInTheDocument()
    expect(screen.getByText('TIME_EXTEND')).toBeInTheDocument()
  })

  it('shows inventory grid layout', () => {
    const mockInventory = [
      { type: 'AUTO_MARK' as const, usageCount: 1, maxUsages: 3, isActive: false },
      { type: 'DOUBLE_POINTS' as const, usageCount: 1, maxUsages: 1, isActive: false },
    ]

    mockUsePowerUpManager.mockReturnValue({
      inventory: mockInventory,
      activatePowerUp: vi.fn(),
      deactivatePowerUp: vi.fn(),
      getRemainingUses: vi.fn(),
      progressToNextPowerUp: 0.6,
      nextPowerUpType: 'DOUBLE_POINTS',
    })

    render(<PowerUpInventory />)

    // Check for grid layout (implementation dependent)
    const inventory = screen.getByText('AUTO_MARK').closest('div')
    expect(inventory).toHaveClass('inventory-grid') // Assuming CSS class for grid
  })
})

describe('ProgressToNextPowerUp', () => {
  it('shows progress to next power-up', () => {
    mockUsePowerUpManager.mockReturnValue({
      inventory: [],
      progressToNextPowerUp: 0.5,
      nextPowerUpType: 'AUTO_MARK',
      getProgressToNextPowerUp: () => ({
        patternsNeeded: 2,
        patternsCompleted: 1,
        isNextAvailable: false,
      }),
    })

    render(<ProgressToNextPowerUp />)

    expect(screen.getByText(/2 patterns needed/)).toBeInTheDocument()
    expect(screen.getByText(/1 completed/)).toBeInTheDocument()
  })

  it('shows when next power-up is available', () => {
    mockUsePowerUpManager.mockReturnValue({
      inventory: [],
      progressToNextPowerUp: 1.0,
      nextPowerUpType: 'AUTO_MARK',
      getProgressToNextPowerUp: () => ({
        patternsNeeded: 0,
        patternsCompleted: 3,
        isNextAvailable: true,
      }),
    })

    render(<ProgressToNextPowerUp />)

    expect(screen.getByText(/Ready!/)).toBeInTheDocument()
  })

  it('displays progress bar with correct percentage', () => {
    mockUsePowerUpManager.mockReturnValue({
      inventory: [],
      progressToNextPowerUp: 0.67,
      nextPowerUpType: 'AUTO_MARK',
      getProgressToNextPowerUp: () => ({
        patternsNeeded: 1,
        patternsCompleted: 2,
        isNextAvailable: false,
      }),
    })

    render(<ProgressToNextPowerUp />)

    // Check for progress bar with 67% completion (2/3)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '67')
  })
})
