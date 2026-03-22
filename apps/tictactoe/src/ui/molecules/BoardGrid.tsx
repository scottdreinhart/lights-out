import React, { useCallback, useEffect, useRef, useState } from 'react'

import { tap } from '../../app/haptics.ts'
import useGridKeyboard from '../../app/useGridKeyboard.ts'
import usePrevious from '../../app/usePrevious.ts'
// TODO: Fix useSwipe import - hook not found in app directory
// import { useSwipe } from '../../app/useSwipe.ts'
import { BOARD_SIZE } from '@/domain'
import type { Board, CellValue, SwipeDirection } from '@/domain'
import CellButton from '../atoms/CellButton.tsx'
import WinLine from '../atoms/WinLine.tsx'
import { cx } from '../utils/cssModules.ts'
import styles from './BoardGrid.module.css'

interface BoardGridProps {
  board: Board
  focusedIndex: number
  onFocusChange: (index: number) => void
  onSelect: (index: number) => void
  isGameOver: boolean
  winLine: number[] | null
  onNav?: () => void
  onTap?: () => void
  id?: string
  children?: React.ReactNode
}

const BoardGrid: React.FC<BoardGridProps> = ({
  board,
  focusedIndex,
  onFocusChange,
  onSelect,
  isGameOver,
  winLine,
  onNav,
  onTap,
  id,
  children,
}) => {
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([])
  const gridRef = useRef<HTMLDivElement>(null)
  const [isResetting, setIsResetting] = useState(false)
  const [focusDirection, setFocusDirection] = useState<SwipeDirection | null>(null)
  const prevBoard = usePrevious(board)
  const prevFocused = usePrevious(focusedIndex)

  useGridKeyboard(focusedIndex, onFocusChange, onSelect, onNav)

  useEffect(() => {
    if (prevFocused !== undefined && focusedIndex !== prevFocused) {
      const prevRow = Math.floor(prevFocused / BOARD_SIZE)
      const prevCol = prevFocused % BOARD_SIZE
      const currRow = Math.floor(focusedIndex / BOARD_SIZE)
      const currCol = focusedIndex % BOARD_SIZE

      let direction: SwipeDirection | null = null
      if (currRow < prevRow) {
        direction = 'up'
      } else if (currRow > prevRow) {
        direction = 'down'
      } else if (currCol < prevCol) {
        direction = 'left'
      } else if (currCol > prevCol) {
        direction = 'right'
      }

      setFocusDirection(direction)
    }
  }, [focusedIndex, prevFocused])

  // TODO: Re-enable useSwipe call once hook is properly defined
  // const handleSwipe = useCallback(
  //   (direction: SwipeDirection) => {
  //     ...
  //   },
  //   [focusedIndex, onFocusChange, onNav],
  // )
  // TODO: Re-enable useSwipe call once hook is properly defined
  // useSwipe(gridRef, handleSwipe)

  const handleSelect = useCallback(
    (index: number) => {
      onTap?.()
      tap()
      onSelect(index)
    },
    [onSelect, onTap],
  )

  useEffect(() => {
    if (prevBoard === undefined) {
      return
    }
    const hadMarks = prevBoard.some((cell: CellValue) => cell !== null)
    const nowEmpty = board.every((cell: CellValue) => cell === null)
    if (hadMarks && nowEmpty) {
      setIsResetting(true)
      const timer = setTimeout(() => setIsResetting(false), 300)
      return () => clearTimeout(timer)
    }
  }, [board, prevBoard])

  useEffect(() => {
    const el = cellRefs.current[focusedIndex]
    if (el) {
      el.focus()
    }
  }, [focusedIndex])

  return (
    <div
      ref={gridRef}
      className={cx(styles.root, isResetting && styles.resetting)}
      role="grid"
      aria-label="Tic-Tac-Toe board"
      id={id}
    >
      {board.map((value, index) => {
        const isDisabled = isGameOver || value !== null
        const isWinning = winLine ? winLine.includes(index) : false

        return (
          <CellButton
            ref={(el) => {
              cellRefs.current[index] = el
            }}
            key={index}
            value={value}
            disabled={isDisabled}
            isFocused={focusedIndex === index}
            isWinning={isWinning}
            focusDirection={focusedIndex === index ? focusDirection : null}
            onClick={() => handleSelect(index)}
            ariaLabel={`Row ${Math.floor(index / BOARD_SIZE) + 1}, Column ${(index % BOARD_SIZE) + 1}, ${value ?? 'empty'}`}
            tabIndex={focusedIndex === index ? 0 : -1}
          />
        )
      })}
      {winLine && <WinLine winLine={winLine} boardRef={gridRef} />}
      {children}
    </div>
  )
}

export default BoardGrid
