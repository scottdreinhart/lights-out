import type { UseSnakeAppReturn } from '@/app'
import { GameCanvas, HUD, OfflineIndicator } from '@/ui/atoms'
import {
  GameOverOverlay,
  HelpOverlay,
  MainMenu,
  PauseOverlay,
  SettingsOverlay,
  SplashScreen,
  StatsOverlay,
} from '@/ui/molecules'

const CELL_SIZE = 20

export function SnakeSurface({ app }: { app: UseSnakeAppReturn }) {
  const player = app.state.run?.players.find((p) => p.id === 'player')
  const bestScore = app.state.bestScores[app.state.mode]

  return (
    <div className="app">
      <OfflineIndicator />

      {app.state.phase === 'boot' && <SplashScreen onComplete={() => app.setPhase('menu')} />}

      {app.state.phase === 'menu' && (
        <MainMenu
          onPlay={() => {
            app.startGame()
          }}
          onSettings={() => {
            app.setPhase('settings')
          }}
          onHelp={() => {
            app.setPhase('help')
          }}
          onStats={() => {
            app.setPhase('stats')
          }}
        />
      )}

      {app.state.phase === 'settings' && (
        <SettingsOverlay
          mode={app.state.mode}
          difficulty={app.state.difficulty}
          wrapMode={app.state.board.wrapMode}
          boardWidth={app.state.board.width}
          boardHeight={app.state.board.height}
          onSetMode={(m) => {
            app.setMode(m)
          }}
          onSetDifficulty={(d) => {
            app.setDifficulty(d)
          }}
          onToggleWrap={() => {
            app.toggleWrap()
          }}
          onSetBoardSize={(w, h) => {
            app.setBoardSize(w, h)
          }}
          onBack={() => {
            app.backToMenu()
          }}
        />
      )}

      {app.state.phase === 'help' && <HelpOverlay onBack={() => app.backToMenu()} />}

      {app.state.phase === 'stats' && (
        <StatsOverlay
          stats={app.stats}
          bestScores={app.state.bestScores}
          onReset={() => {
            app.setPhase('stats')
          }}
          onBack={() => app.backToMenu()}
        />
      )}

      {(app.state.phase === 'playing' ||
        app.state.phase === 'paused' ||
        app.state.phase === 'game-over') &&
        app.state.run && (
          <div className="game-container">
            <HUD
              player={player}
              bestScore={bestScore}
              mode={app.state.mode}
              wasmActive={app.isWasmActive}
              wrapMode={app.state.board.wrapMode}
            />
            <GameCanvas
              board={app.state.board}
              players={app.state.run.players}
              pickups={app.state.run.pickups}
              trails={app.state.run.trails}
              cellSize={CELL_SIZE}
            />
          </div>
        )}

      {app.state.phase === 'paused' && (
        <PauseOverlay
          onResume={() => {
            app.resume()
          }}
          onRestart={() => {
            app.restart()
          }}
          onMenu={() => {
            app.backToMenu()
          }}
        />
      )}

      {app.state.phase === 'game-over' && app.state.run?.outcome && (
        <GameOverOverlay
          outcome={app.state.run.outcome}
          score={player?.score ?? 0}
          bestScore={bestScore}
          mode={app.state.mode}
          onRestart={() => {
            app.restart()
          }}
          onMenu={() => {
            app.backToMenu()
          }}
        />
      )}
    </div>
  )
}
