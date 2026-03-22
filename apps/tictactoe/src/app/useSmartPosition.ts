import { useEffect, useState } from 'react'
import { useWindowSize } from '@games/app-hook-utils'

type Alignment = 'left' | 'right'

interface UseSmartPositionConfig {
  trigger: React.RefObject<HTMLElement | null>
  panel: React.RefObject<HTMLElement | null>
  minPanelWidth?: number
  viewportPadding?: number
  preferredAlignment?: Alignment
}

const useSmartPosition = ({
  trigger,
  panel,
  minPanelWidth = 240,
  viewportPadding = 16,
  preferredAlignment = 'right',
}: UseSmartPositionConfig): Alignment => {
  const [alignment, setAlignment] = useState<Alignment>(preferredAlignment)
  const { width } = useWindowSize()

  useEffect(() => {
    if (!trigger?.current || !panel?.current) {
      return
    }

    const triggerRect = trigger.current.getBoundingClientRect()

    const rightEdge = triggerRect.right + minPanelWidth
    const wouldOverflowRight = rightEdge + viewportPadding > width

    const leftEdge = triggerRect.left - minPanelWidth
    const wouldOverflowLeft = leftEdge - viewportPadding < 0

    let newAlignment: Alignment = preferredAlignment
    if (preferredAlignment === 'right' && wouldOverflowRight && !wouldOverflowLeft) {
      newAlignment = 'left'
    } else if (preferredAlignment === 'left' && wouldOverflowLeft && !wouldOverflowRight) {
      newAlignment = 'right'
    }

    setAlignment(newAlignment)
  }, [trigger, panel, minPanelWidth, viewportPadding, preferredAlignment, width])

  return alignment
}

export default useSmartPosition
