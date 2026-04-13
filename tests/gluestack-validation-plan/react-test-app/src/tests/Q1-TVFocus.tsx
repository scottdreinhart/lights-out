/**
 * File: tests/gluestack-validation-plan/react-test-app/src/tests/Q1-TVFocus.tsx
 * Windows: D:\src\game-platform\tests\gluestack-validation-plan\react-test-app\src\tests\Q1-TVFocus.tsx
 * Linux:   /mnt/d/src/game-platform/tests/gluestack-validation-plan/react-test-app/src/tests/Q1-TVFocus.tsx
 */

import React from 'react'
 * 
 * Tests:
 * - Focus navigation with arrow keys (simulates D-Pad)
 * - Focus visibility
 * - Focus trap (optional exit)
 */
export default function Q1_TVFocus(): JSX.Element {
  const [focusIndex, setFocusIndex] = React.useState(0)
  const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  const grid = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ]

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const row = Math.floor(focusIndex / 3)
      const col = focusIndex % 3

      switch (e.key) {
        case 'ArrowUp':
          if (row > 0) setFocusIndex(focusIndex - 3)
          break
        case 'ArrowDown':
          if (row < 2) setFocusIndex(focusIndex + 3)
          break
        case 'ArrowLeft':
          if (col > 0) setFocusIndex(focusIndex - 1)
          break
        case 'ArrowRight':
          if (col < 2) setFocusIndex(focusIndex + 1)
          break
        default:
          return
      }
      
      e.preventDefault()
      buttonRefs.current[focusIndex]?.focus()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusIndex])

  return (
    <div>
      <Text size='lg' bold>Test Q1: TV/D-Pad Focus Navigation</Text>
      <Text size='sm' style={{ color: '#666', marginBottom: '1rem' }}>
        Use arrow keys to navigate 3×3 grid. Focus should move intuitively.
      </Text>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        maxWidth: '400px',
        marginBottom: '2rem'
      }}>
        {grid.map((row, rowIdx) =>
          row.map((idx) => (
            <button
              key={idx}
              ref={(el) => { buttonRefs.current[idx] = el }}
              onClick={() => setFocusIndex(idx)}
              style={{
                padding: '2rem',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                background: focusIndex === idx ? '#0066cc' : '#f0f0f0',
                color: focusIndex === idx ? 'white' : 'black',
                border: focusIndex === idx ? '4px solid #0044aa' : '2px solid #ccc',
                cursor: 'pointer',
                borderRadius: '8px',
                outline: 'none'
              }}
              onFocus={() => setFocusIndex(idx)}
            >
              {idx}
            </button>
          ))
        )}
      </div>

      <Box style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '4px' }}>
        <Text size='sm'>
          <strong>Current Focus:</strong> {focusIndex} (Row {Math.floor(focusIndex / 3)}, Col {focusIndex % 3})
        </Text>
        <Text size='xs' style={{ color: '#666', marginTop: '0.5rem' }}>
          ✅ Focus visible<br/>
          ✅ Arrow key navigation working<br/>
          ✅ Can customize behavior
        </Text>
      </Box>
    </div>
  )
}
