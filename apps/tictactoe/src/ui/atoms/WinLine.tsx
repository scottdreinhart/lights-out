import React, { useEffect, useState } from 'react'

import styles from './WinLine.module.css'

interface Coords {
  x1: number
  y1: number
  x2: number
  y2: number
}

interface WinLineProps {
  winLine: number[] | null
  boardRef: React.RefObject<HTMLDivElement | null>
}

const WinLine: React.FC<WinLineProps> = ({ winLine, boardRef }) => {
  const [coords, setCoords] = useState<Coords | null>(null)

  useEffect(() => {
    if (!winLine || winLine.length < 3 || !boardRef?.current) {
      setCoords(null)
      return
    }

    const board = boardRef.current
    const boardRect = board.getBoundingClientRect()
    const cells = board.querySelectorAll('button')
    if (cells.length < 9) {
      return
    }

    const center = (idx: number) => {
      const cell = cells[idx]
      if (!cell) {
        return { x: 0, y: 0 }
      }
      const r = cell.getBoundingClientRect()
      return {
        x: ((r.left + r.width / 2 - boardRect.left) / boardRect.width) * 100,
        y: ((r.top + r.height / 2 - boardRect.top) / boardRect.height) * 100,
      }
    }

    const startIdx = winLine[0]
    const endIdx = winLine[2]
    if (startIdx === undefined || endIdx === undefined) {
      return
    }
    const start = center(startIdx)
    const end = center(endIdx)

    const dx = end.x - start.x
    const dy = end.y - start.y
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const ext = 5
    const ux = (dx / len) * ext
    const uy = (dy / len) * ext

    setCoords({
      x1: start.x - ux,
      y1: start.y - uy,
      x2: end.x + ux,
      y2: end.y + uy,
    })
  }, [winLine, boardRef])

  if (!coords) {
    return null
  }

  return (
    <svg className={styles.root} viewBox="0 0 100 100" aria-hidden="true">
      <line x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2} className={styles.line} />
    </svg>
  )
}

WinLine.displayName = 'WinLine'

export default WinLine
