/**
 * File: tests/gluestack-validation-plan/react-test-app/src/App.tsx
 * Windows: D:\src\game-platform\tests\gluestack-validation-plan\react-test-app\src\App.tsx
 * Linux:   /mnt/d/src/game-platform/tests/gluestack-validation-plan/react-test-app/src/App.tsx
 */

import React from 'react'(): JSX.Element {
  const [activeTest, setActiveTest] = React.useState<1 | 2 | 3>(1)

  return (
    <GluestackUIProvider config={config}>
      <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
        <h1>Gluestack UI Validation Tests</h1>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTest(1)}
            style={{ 
              padding: '0.5rem 1rem',
              background: activeTest === 1 ? '#0066cc' : '#ccc',
              color: activeTest === 1 ? 'white' : 'black',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Q1: TV/D-Pad Focus
          </button>
          <button 
            onClick={() => setActiveTest(2)}
            style={{ 
              padding: '0.5rem 1rem',
              background: activeTest === 2 ? '#0066cc' : '#ccc',
              color: activeTest === 2 ? 'white' : 'black',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Q2: Game Theming
          </button>
          <button 
            onClick={() => setActiveTest(3)}
            style={{ 
              padding: '0.5rem 1rem',
              background: activeTest === 3 ? '#0066cc' : '#ccc',
              color: activeTest === 3 ? 'white' : 'black',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Q3: Responsive
          </button>
        </div>

        {activeTest === 1 && <Q1_TVFocus />}
        {activeTest === 2 && <Q2_Theming />}
        {activeTest === 3 && <Q3_Responsive />}
      </div>
    </GluestackUIProvider>
  )
}
