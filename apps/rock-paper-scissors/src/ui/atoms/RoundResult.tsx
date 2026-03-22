import type { RoundResult } from '@/domain'
import { useEffect, useState } from 'react'
import './RoundResult.css'

interface RoundResultProps {
  playerMove: string
  cpuMove: string
  cpuDisplayMove: string
  result: RoundResult | null
  isLoading?: boolean
}

const RANDOM_MOVES = ['✊', '✋', '✌️']

const MOVE_EMOJI: Record<string, string> = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️',
}

function getMoveEmoji(move: string): string {
  return MOVE_EMOJI[move] || '—'
}

export function RoundResultDisplay({
  playerMove,
  cpuMove,
  cpuDisplayMove,
  result,
  isLoading = false,
}: RoundResultProps) {
  const [countdown, setCountdown] = useState<number | null>(null)
  const [randomCpuMove, setRandomCpuMove] = useState<string>('✊')
  const [isRevealed, setIsRevealed] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)

  // Show result when loading ends
  useEffect(() => {
    if (!isLoading && result && countdown === null) {
      setIsRevealed(true)
    }
  }, [isLoading, result, countdown])

  // Clear result immediately when user clicks a move (isLoading becomes true)
  useEffect(() => {
    if (isLoading) {
      setIsRevealed(false)
      setIsFadingOut(false)
    }
  }, [isLoading])

  // Auto-hide result overlay after 8 seconds, then start countdown
  useEffect(() => {
    if (isRevealed) {
      // Start fade out at 7.5s (0.5s before it disappears)
      const fadeTimer = setTimeout(() => setIsFadingOut(true), 7500)
      // Hide at 8s and start countdown
      const hideTimer = setTimeout(() => {
        setIsRevealed(false)
        setIsFadingOut(false)
        // Start countdown after result hides
        setCountdown(3)
      }, 8000)
      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(hideTimer)
      }
    }
  }, [isRevealed])

  // Start countdown 3-2-1 after result disappears
  useEffect(() => {
    if (countdown !== null) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownInterval)
            return null
          }
          return prev - 1
        })
      }, 600) // 0.6s per count

      return () => clearInterval(countdownInterval)
    }
  }, [countdown])

  // Animate random CPU moves during countdown (only if no move has been played yet)
  useEffect(() => {
    if (countdown !== null && !cpuMove) {
      const moveInterval = setInterval(() => {
        setRandomCpuMove(RANDOM_MOVES[Math.floor(Math.random() * RANDOM_MOVES.length)])
      }, 100) // Change move every 100ms

      return () => clearInterval(moveInterval)
    }
  }, [countdown, cpuMove])

  // Continue randomizing CPU moves after round ends (ready for next round)
  useEffect(() => {
    if (!isLoading && !cpuMove && countdown === null) {
      const moveInterval = setInterval(() => {
        setRandomCpuMove(RANDOM_MOVES[Math.floor(Math.random() * RANDOM_MOVES.length)])
      }, 100)

      return () => clearInterval(moveInterval)
    }
  }, [isLoading, cpuMove, countdown])

  const displayCpuMove = countdown !== null ? randomCpuMove : getMoveEmoji(cpuDisplayMove)

  return (
    <div className="round-result">
      <div className="moves-display">
        <div className="move-item player">
          <p className="move-label">👤</p>
          <span className="move-display">{playerMove ? getMoveEmoji(playerMove) : '—'}</span>
        </div>

        {countdown !== null && <div className="countdown">{countdown}</div>}

        <div className="vs">vs</div>

        <div className="move-item cpu">
          <p className="move-label">🤖</p>
          <span className={`move-display ${countdown !== null ? 'animating' : ''}`}>
            {displayCpuMove || '—'}
          </span>
        </div>
      </div>

      {result && isRevealed && (
        <div className={`result-overlay ${result} ${isFadingOut ? 'fade-out' : ''}`}>
          <div className="result-content">
            {result === 'win' && '🎉 You Win!'}
            {result === 'loss' && '😢 You Lose'}
            {result === 'draw' && '🤝 Draw'}
          </div>
        </div>
      )}

      {countdown !== null && <div className="countdown-label">Revealing...</div>}
    </div>
  )
}
