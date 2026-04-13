/**
 * Component tests for Bingo Rush UI atoms
 * Tests ExtensionCounter and TimerWithExtensions components
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import * as hooksModule from '../../app/hooks'
import { ExtensionCounter } from './ExtensionCounter'
import { TimerWithExtensions } from './TimerWithExtensions'

// Mock the hooks module
vi.mock('../../app/hooks')

const mockUseGlobalTimer = vi.mocked(hooksModule.useGlobalTimer)

beforeEach(() => {
  mockUseGlobalTimer.mockClear()
})

describe('ExtensionCounter', () => {
  it('renders extension count and remaining', () => {
    mockUseGlobalTimer.mockReturnValue({
      extensionsGranted: 2,
      extensionsRemaining: 1,
      maxExtensions: 3,
    })

    render(<ExtensionCounter />)

    expect(screen.getByText('Extensions')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // granted
    expect(screen.getByText('/')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument() // max
    expect(screen.getByText('1 remaining')).toBeInTheDocument()
  })

  it('shows zero extensions when none granted', () => {
    mockUseGlobalTimer.mockReturnValue({
      extensionsGranted: 0,
      extensionsRemaining: 3,
      maxExtensions: 3,
    })

    render(<ExtensionCounter />)

    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('3 remaining')).toBeInTheDocument()
  })

  it('shows maxed out when all extensions used', () => {
    mockUseGlobalTimer.mockReturnValue({
      extensionsGranted: 3,
      extensionsRemaining: 0,
      maxExtensions: 3,
    })

    render(<ExtensionCounter />)

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('0 remaining')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    mockUseGlobalTimer.mockReturnValue({
      extensionsGranted: 1,
      extensionsRemaining: 2,
      maxExtensions: 3,
    })

    render(<ExtensionCounter className="custom-counter" />)

    const counter = screen.getByRole('status')
    expect(counter).toHaveClass('custom-counter')
  })

  it('has proper accessibility attributes', () => {
    mockUseGlobalTimer.mockReturnValue({
      extensionsGranted: 1,
      extensionsRemaining: 2,
      maxExtensions: 3,
    })

    render(<ExtensionCounter />)

    const counter = screen.getByRole('status')
    expect(counter).toHaveAttribute('aria-label', 'Time extensions')
  })
})

describe('TimerWithExtensions', () => {
  it('renders time remaining and status', () => {
    mockUseGlobalTimer.mockReturnValue({
      timeRemaining: 125, // 2:05
      isRunning: true,
      canExtend: true,
      extensionsRemaining: 2,
    })

    render(<TimerWithExtensions />)

    expect(screen.getByText('2:05')).toBeInTheDocument()
    expect(screen.getByText('Running')).toBeInTheDocument()
  })

  it('shows paused status when not running', () => {
    mockUseGlobalTimer.mockReturnValue({
      timeRemaining: 300,
      isRunning: false,
      canExtend: false,
      extensionsRemaining: 0,
    })

    render(<TimerWithExtensions />)

    expect(screen.getByText('Paused')).toBeInTheDocument()
  })

  it('displays extension dots for remaining extensions', () => {
    mockUseGlobalTimer.mockReturnValue({
      timeRemaining: 180,
      isRunning: true,
      canExtend: true,
      extensionsRemaining: 3,
    })

    render(<TimerWithExtensions />)

    const dots = screen.getAllByLabelText(/Extension \d+ available/)
    expect(dots).toHaveLength(3)
  })

  it('shows extension hint when extensions available and can extend', () => {
    mockUseGlobalTimer.mockReturnValue({
      timeRemaining: 90,
      isRunning: true,
      canExtend: true,
      extensionsRemaining: 2,
    })

    render(<TimerWithExtensions />)

    expect(screen.getByText('Press SPACE to extend')).toBeInTheDocument()
  })

  it('hides extension hint when no extensions remaining', () => {
    mockUseGlobalTimer.mockReturnValue({
      timeRemaining: 60,
      isRunning: true,
      canExtend: false,
      extensionsRemaining: 0,
    })

    render(<TimerWithExtensions />)

    expect(screen.queryByText('Press SPACE to extend')).not.toBeInTheDocument()
  })

  it('applies urgency classes based on time remaining', () => {
    mockUseGlobalTimer.mockReturnValue({
      timeRemaining: 5, // Critical (≤10)
      isRunning: true,
      canExtend: true,
      extensionsRemaining: 1,
    })

    render(<TimerWithExtensions />)

    const timeElement = screen.getByText('0:05')
    expect(timeElement).toHaveClass('critical')
  })

  it('applies warning class for medium urgency', () => {
    mockUseGlobalTimer.mockReturnValue({
      timeRemaining: 25, // Warning (≤30)
      isRunning: true,
      canExtend: true,
      extensionsRemaining: 1,
    })

    render(<TimerWithExtensions />)

    const timeElement = screen.getByText('0:25')
    expect(timeElement).toHaveClass('warning')
  })

  it('applies normal class for safe time', () => {
    mockUseGlobalTimer.mockReturnValue({
      timeRemaining: 120, // Normal (>30)
      isRunning: true,
      canExtend: true,
      extensionsRemaining: 1,
    })

    render(<TimerWithExtensions />)

    const timeElement = screen.getByText('2:00')
    expect(timeElement).toHaveClass('normal')
  })

  it('applies custom className', () => {
    mockUseGlobalTimer.mockReturnValue({
      timeRemaining: 180,
      isRunning: true,
      canExtend: true,
      extensionsRemaining: 1,
    })

    render(<TimerWithExtensions className="custom-timer" />)

    const timer = screen.getByRole('timer')
    expect(timer).toHaveClass('custom-timer')
  })

  it('has proper accessibility attributes', () => {
    mockUseGlobalTimer.mockReturnValue({
      timeRemaining: 180,
      isRunning: true,
      canExtend: true,
      extensionsRemaining: 1,
    })

    render(<TimerWithExtensions />)

    const timer = screen.getByRole('timer')
    expect(timer).toHaveAttribute('aria-label', 'Game timer with extensions')
  })
})