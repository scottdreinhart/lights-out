/**
 * Component tests for Bingo Survival UI atoms
 * Tests LevelDisplay and ProgressBar components
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LevelDisplay } from './LevelDisplay/LevelDisplay'
import { ProgressBar } from './ProgressBar/ProgressBar'

// Mock the useLevelProgression hook
const mockUseLevelProgression = vi.fn()
vi.mock('../hooks', () => ({
  useLevelProgression: mockUseLevelProgression,
}))

describe('LevelDisplay', () => {
  it('renders current level and total levels', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 3,
      totalLevels: 10,
      phaseLabel: 'Calm',
      progressPercentage: 30,
    })

    render(<LevelDisplay />)

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('/10')).toBeInTheDocument()
  })

  it('shows phase label when showPhase is true (default)', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 5,
      totalLevels: 10,
      phaseLabel: 'Acceleration',
      progressPercentage: 50,
    })

    render(<LevelDisplay />)

    expect(screen.getByText('Acceleration')).toBeInTheDocument()
  })

  it('hides phase label when showPhase is false', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 7,
      totalLevels: 10,
      phaseLabel: 'Intense',
      progressPercentage: 70,
    })

    render(<LevelDisplay showPhase={false} />)

    expect(screen.queryByText('Intense')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 1,
      totalLevels: 10,
      phaseLabel: 'Calm',
      progressPercentage: 10,
    })

    render(<LevelDisplay className="custom-class" />)

    const display = screen.getByText('1').closest('div')
    expect(display).toHaveClass('custom-class')
  })
})

describe('ProgressBar', () => {
  it('renders progress bar with correct width', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 3,
      totalLevels: 10,
      phaseLabel: 'Calm',
      progressPercentage: 30,
    })

    render(<ProgressBar />)

    const fill = screen.getByRole('progressbar')
    expect(fill).toHaveStyle({ width: '30%' })
  })

  it('shows percentage text by default', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 5,
      totalLevels: 10,
      phaseLabel: 'Acceleration',
      progressPercentage: 50,
    })

    render(<ProgressBar />)

    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('hides percentage text when showPercentage is false', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 7,
      totalLevels: 10,
      phaseLabel: 'Intense',
      progressPercentage: 70,
    })

    render(<ProgressBar showPercentage={false} />)

    expect(screen.queryByText('70%')).not.toBeInTheDocument()
  })

  it('applies custom height', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 2,
      totalLevels: 10,
      phaseLabel: 'Calm',
      progressPercentage: 20,
    })

    render(<ProgressBar height={12} />)

    const progressBar = screen.getByText('20%').closest('div')
    expect(progressBar).toHaveStyle({ height: '12px' })
  })

  it('applies custom className', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 4,
      totalLevels: 10,
      phaseLabel: 'Acceleration',
      progressPercentage: 40,
    })

    render(<ProgressBar className="custom-progress" />)

    const progressBar = screen.getByText('40%').closest('div')
    expect(progressBar).toHaveClass('custom-progress')
  })

  it('clamps progress percentage between 0 and 100', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 11,
      totalLevels: 10,
      phaseLabel: 'Expert',
      progressPercentage: 110, // Over 100%
    })

    render(<ProgressBar />)

    const fill = screen.getByRole('progressbar')
    expect(fill).toHaveStyle({ width: '100%' })
  })
})</content>
<parameter name="filePath">c:\Users\scott\game-platform\apps\bingo-survival\src\ui\atoms\atoms.component.test.tsx