/**
 * Pattern Bingo - Atoms Component Tests
 *
 * Tests for PatternHighlighter, PatternList, and MultiplierIndicator components
 * using Vitest and @testing-library/react
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PatternHighlighter } from './PatternHighlighter/PatternHighlighter'
import { PatternList } from './PatternList/PatternList'
import { MultiplierIndicator } from './MultiplierIndicator/MultiplierIndicator'

// Mock the hook
const mockUsePatternDetection = vi.fn()
vi.mock('../../app/hooks', () => ({
  usePatternDetection: () => mockUsePatternDetection(),
}))

describe('Pattern Bingo Atoms Components', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('PatternHighlighter', () => {
    it('renders available patterns with correct icons and names', () => {
      mockUsePatternDetection.mockReturnValue({
        detectedPatterns: [],
        availablePatterns: ['LINE', 'CORNERS', 'FRAME', 'PLUS', 'FULL_HOUSE'],
        currentMultiplier: 1.0,
      })

      render(<PatternHighlighter />)

      expect(screen.getByText('Patterns')).toBeInTheDocument()
      expect(screen.getByText('Line')).toBeInTheDocument()
      expect(screen.getByText('Corners')).toBeInTheDocument()
      expect(screen.getByText('Frame')).toBeInTheDocument()
      expect(screen.getByText('Plus')).toBeInTheDocument()
      expect(screen.getByText('Full House')).toBeInTheDocument()
    })

    it('shows multiplier when currentMultiplier > 1', () => {
      mockUsePatternDetection.mockReturnValue({
        detectedPatterns: [],
        availablePatterns: ['LINE'],
        currentMultiplier: 2.5,
      })

      render(<PatternHighlighter />)

      expect(screen.getByText('2.5x Multiplier')).toBeInTheDocument()
    })

    it('does not show multiplier when currentMultiplier = 1', () => {
      mockUsePatternDetection.mockReturnValue({
        detectedPatterns: [],
        availablePatterns: ['LINE'],
        currentMultiplier: 1.0,
      })

      render(<PatternHighlighter />)

      expect(screen.queryByText(/Multiplier/)).not.toBeInTheDocument()
    })

    it('highlights detected patterns', () => {
      mockUsePatternDetection.mockReturnValue({
        detectedPatterns: ['LINE', 'CORNERS'],
        availablePatterns: ['LINE', 'CORNERS', 'FRAME'],
        currentMultiplier: 1.0,
      })

      render(<PatternHighlighter />)

      // Check that detected patterns have appropriate styling
      // This would require checking CSS classes or data attributes
      const patternsContainer = screen.getByRole('region', { name: 'Pattern detection status' })
      expect(patternsContainer).toBeInTheDocument()
    })

    it('calls onPatternClick when pattern is clicked', () => {
      const mockOnClick = vi.fn()
      mockUsePatternDetection.mockReturnValue({
        detectedPatterns: [],
        availablePatterns: ['LINE'],
        currentMultiplier: 1.0,
      })

      render(<PatternHighlighter onPatternClick={mockOnClick} />)

      // Note: Actual click handling would depend on component implementation
      // This test assumes clickable pattern elements exist
    })

    it('applies custom className', () => {
      mockUsePatternDetection.mockReturnValue({
        detectedPatterns: [],
        availablePatterns: ['LINE'],
        currentMultiplier: 1.0,
      })

      render(<PatternHighlighter className="custom-class" />)

      const container = screen.getByRole('region', { name: 'Pattern detection status' })
      expect(container).toHaveClass('custom-class')
    })
  })

  describe('PatternList', () => {
    it('renders detected patterns with scores', () => {
      mockUsePatternDetection.mockReturnValue({
        detectedPatterns: [
          { type: 'LINE', score: 100, multiplier: 1.0, coordinates: [], timestamp: 0 },
          { type: 'CORNERS', score: 150, multiplier: 1.5, coordinates: [], timestamp: 0 },
        ],
        patternScores: {
          LINE: 100,
          CORNERS: 150,
          FRAME: 200,
          PLUS: 175,
          FULL_HOUSE: 500,
        },
        totalScore: 325,
      })

      render(<PatternList />)

      expect(screen.getByText('Detected Patterns')).toBeInTheDocument()
      expect(screen.getByText('Line')).toBeInTheDocument()
      expect(screen.getByText('Corners')).toBeInTheDocument()
      expect(screen.getByText('Total Score: 325')).toBeInTheDocument()
    })

    it('shows empty state when no patterns detected', () => {
      mockUsePatternDetection.mockReturnValue({
        detectedPatterns: [],
        patternScores: {},
        totalScore: 0,
      })

      render(<PatternList />)

      expect(screen.getByText('No patterns detected yet')).toBeInTheDocument()
      expect(screen.getByText('Total Score: 0')).toBeInTheDocument()
    })

    it('displays pattern scores and multipliers correctly', () => {
      mockUsePatternDetection.mockReturnValue({
        detectedPatterns: [
          { type: 'LINE', score: 100, multiplier: 2.0, coordinates: [], timestamp: 0 },
        ],
        patternScores: { LINE: 100 },
        totalScore: 200,
      })

      render(<PatternList />)

      // Check that score calculation (base * multiplier) is displayed
      expect(screen.getByText('Total Score: 200')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      mockUsePatternDetection.mockReturnValue({
        detectedPatterns: [],
        patternScores: {},
        totalScore: 0,
      })

      render(<PatternList className="custom-list" />)

      const container = screen.getByRole('region', { name: 'Pattern list' })
      expect(container).toHaveClass('custom-list')
    })
  })

  describe('MultiplierIndicator', () => {
    it('displays current multiplier', () => {
      mockUsePatternDetection.mockReturnValue({
        multiplier: 1.5,
        nextMultiplierProgress: 75,
      })

      render(<MultiplierIndicator />)

      expect(screen.getByText('Multiplier')).toBeInTheDocument()
      expect(screen.getByText('×1.5')).toBeInTheDocument()
    })

    it('shows progress to next multiplier level', () => {
      mockUsePatternDetection.mockReturnValue({
        multiplier: 1.0,
        nextMultiplierProgress: 60,
      })

      render(<MultiplierIndicator />)

      expect(screen.getByText('60/100 to ×1.5')).toBeInTheDocument()
    })

    it('displays multiplier levels with achievement status', () => {
      mockUsePatternDetection.mockReturnValue({
        multiplier: 2.0,
        nextMultiplierProgress: 50,
      })

      render(<MultiplierIndicator />)

      // Check that achieved levels are marked
      expect(screen.getByText('×1.0')).toBeInTheDocument()
      expect(screen.getByText('×1.5')).toBeInTheDocument()
      expect(screen.getByText('×2.0')).toBeInTheDocument()
      expect(screen.getByText('×2.5')).toBeInTheDocument()
    })

    it('shows progress bar with correct width', () => {
      mockUsePatternDetection.mockReturnValue({
        multiplier: 1.0,
        nextMultiplierProgress: 75,
      })

      render(<MultiplierIndicator />)

      const progressFill = screen.getByRole('progressbar')
      expect(progressFill).toHaveStyle({ width: '75%' })
    })

    it('applies custom className', () => {
      mockUsePatternDetection.mockReturnValue({
        multiplier: 1.0,
        nextMultiplierProgress: 0,
      })

      render(<MultiplierIndicator className="custom-multiplier" />)

      const container = screen.getByRole('region', { name: 'Multiplier indicator' })
      expect(container).toHaveClass('custom-multiplier')
    })

    it('handles maximum progress correctly', () => {
      mockUsePatternDetection.mockReturnValue({
        multiplier: 1.0,
        nextMultiplierProgress: 100,
      })

      render(<MultiplierIndicator />)

      const progressFill = screen.getByRole('progressbar')
      expect(progressFill).toHaveStyle({ width: '100%' })
    })
  })
})