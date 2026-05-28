/**
 * Component tests for Bingo Survival UI atoms.
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LevelDisplay } from './LevelDisplay/LevelDisplay'
import { ProgressBar } from './ProgressBar/ProgressBar'

const { mockUseLevelProgression } = vi.hoisted(() => ({
  mockUseLevelProgression: vi.fn(),
}))

vi.mock('@/app', () => ({
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

    expect(screen.getByText('3')).toBeTruthy()
    expect(screen.getByText('/10')).toBeTruthy()
  })

  it('shows phase label by default', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 5,
      totalLevels: 10,
      phaseLabel: 'Acceleration',
      progressPercentage: 50,
    })

    render(<LevelDisplay />)
    expect(screen.getByText('Acceleration')).toBeTruthy()
  })

  it('hides phase label when showPhase is false', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 7,
      totalLevels: 10,
      phaseLabel: 'Intense',
      progressPercentage: 70,
    })

    render(<LevelDisplay showPhase={false} />)
    expect(screen.queryByText('Intense')).toBeNull()
  })

  it('applies custom className', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 1,
      totalLevels: 10,
      phaseLabel: 'Calm',
      progressPercentage: 10,
    })

    const { container } = render(<LevelDisplay className="custom-class" />)
    const root = container.firstElementChild as HTMLElement | null
    expect(root?.className.includes('custom-class')).toBe(true)
  })
})

describe('ProgressBar', () => {
  it('renders fill width from progressPercentage', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 3,
      totalLevels: 10,
      phaseLabel: 'Calm',
      progressPercentage: 30,
    })

    const { container } = render(<ProgressBar />)
    const root = container.firstElementChild as HTMLElement | null
    const fill = root?.firstElementChild as HTMLElement | null
    expect(fill?.style.width).toBe('30%')
  })

  it('shows percentage text by default', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 5,
      totalLevels: 10,
      phaseLabel: 'Acceleration',
      progressPercentage: 50,
    })

    render(<ProgressBar />)
    expect(screen.getByText('50%')).toBeTruthy()
  })

  it('hides percentage text when showPercentage is false', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 7,
      totalLevels: 10,
      phaseLabel: 'Intense',
      progressPercentage: 70,
    })

    render(<ProgressBar showPercentage={false} />)
    expect(screen.queryByText('70%')).toBeNull()
  })

  it('applies custom height scaling', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 2,
      totalLevels: 10,
      phaseLabel: 'Calm',
      progressPercentage: 20,
    })

    const { container } = render(<ProgressBar height={12} />)
    const root = container.firstElementChild as HTMLElement | null
    expect(root?.style.height).toBeTruthy()
  })

  it('applies custom className', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 4,
      totalLevels: 10,
      phaseLabel: 'Acceleration',
      progressPercentage: 40,
    })

    const { container } = render(<ProgressBar className="custom-progress" />)
    const root = container.firstElementChild as HTMLElement | null
    expect(root?.className.includes('custom-progress')).toBe(true)
  })

  it('clamps progress width between 0 and 100', () => {
    mockUseLevelProgression.mockReturnValue({
      currentLevel: 11,
      totalLevels: 10,
      phaseLabel: 'Expert',
      progressPercentage: 110,
    })

    const { container } = render(<ProgressBar />)
    const root = container.firstElementChild as HTMLElement | null
    const fill = root?.firstElementChild as HTMLElement | null
    expect(fill?.style.width).toBe('100%')
  })
})
