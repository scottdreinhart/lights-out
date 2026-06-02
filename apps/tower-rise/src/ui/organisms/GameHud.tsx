import type { GameState } from '@/domain'

interface Props {
  gameState: GameState
}

export function GameHud({ gameState }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        color: 'white',
        fontFamily: 'monospace',
        background: 'rgba(0,0,0,0.45)',
        padding: '8px 12px',
      }}
    >
      <div>Tower Rise</div>
      <div>Score: {gameState.score}</div>
      <div>Lives: {gameState.lives}</div>
      <div>Bonus: {gameState.bonusTimer}</div>
      <div>Level: {gameState.levelIndex + 1}</div>
      <div>Collectibles: {gameState.collectibles.length}</div>
      <div>State: {gameState.screen}</div>
    </div>
  )
}
