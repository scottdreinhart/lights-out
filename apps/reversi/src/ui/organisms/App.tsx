import { useState } from 'react'
import { HamburgerMenu } from './HamburgerMenu'

export default function App() {
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)

  return (
    <div
      className="app"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid #ccc',
        }}
      >
        <div>
          <h1>Reversi</h1>
          <p>Place discs to flip opponent pieces; most discs wins (Othello)</p>
        </div>
        <HamburgerMenu
          onRules={() => setShowRulesModal(true)}
          onSettings={() => setShowSettingsModal(true)}
          onAbout={() => setShowAboutModal(true)}
        />
      </header>

      <main
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Reversi gameplay coming soon...</p>
      </main>

      {/* Rules Modal */}
      {showRulesModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowRulesModal(false)}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '2rem',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <button
              className="modal-close"
              onClick={() => setShowRulesModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
            <h2>How to Play Reversi</h2>
            <p>
              Reversi (also known as Othello) is a two-player strategy game where the objective
              is to flip your opponent's pieces by trapping them between your pieces.
            </p>
            <h3>Game Rules</h3>
            <ul>
              <li>Players take turns placing discs on the board</li>
              <li>Place a disc so that one or more opponent discs are trapped between your new disc and another of your discs</li>
              <li>All trapped discs are flipped to your color</li>
              <li>If a player cannot move, play passes to the opponent</li>
              <li>The game ends when neither player can move</li>
              <li>The player with the most discs of their color on the board wins</li>
            </ul>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSettingsModal(false)}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '2rem',
              maxWidth: '400px',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <button
              className="modal-close"
              onClick={() => setShowSettingsModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
            <h2>Settings</h2>
            <p>Game settings will be available once gameplay is implemented.</p>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAboutModal(false)}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '2rem',
              maxWidth: '400px',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <button
              className="modal-close"
              onClick={() => setShowAboutModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
            <h2>About Reversi</h2>
            <p>
              Reversi (also known as Othello) is a classic two-player strategy game with origins
              dating back to the late 19th century. The game is known for its simple rules and
              deep strategic complexity.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
