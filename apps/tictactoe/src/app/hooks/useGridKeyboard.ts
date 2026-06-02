import { useGridNavigationInput } from '@games/app-hook-utils'
import { BOARD_SIZE } from '@/domain'

const useGridKeyboard = (
  focusedIndex: number,
  onFocusChange: (index: number) => void,
  onSelect: (index: number) => void,
  onNav?: () => void,
): void => {
  const row = Math.floor(focusedIndex / BOARD_SIZE)
  const col = focusedIndex % BOARD_SIZE

  useGridNavigationInput(
    {
      onMove: (direction) => {
        let newRow = row
        let newCol = col

        switch (direction) {
          case 'up':
            if (row > 0) {newRow = row - 1}
            break
          case 'down':
            if (row < BOARD_SIZE - 1) {newRow = row + 1}
            break
          case 'left':
            if (col > 0) {newCol = col - 1}
            break
          case 'right':
            if (col < BOARD_SIZE - 1) {newCol = col + 1}
            break
        }

        const newIndex = newRow * BOARD_SIZE + newCol
        if (newIndex !== focusedIndex) {
          onFocusChange(newIndex)
          onNav?.()
        }
      },
      onSelect: () => onSelect(focusedIndex),
    },
    { enabled: true, includeWasd: true, allowRepeat: false },
  )
}

export default useGridKeyboard
