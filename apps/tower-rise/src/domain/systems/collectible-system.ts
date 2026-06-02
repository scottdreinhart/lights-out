import type { GameState } from '../core/game-state'
import type { Collectible } from '../entities/collectible'
import { isIntersecting } from '../utils/collision'

function createCollectible(state: GameState): Collectible | undefined {
  const candidatePlatforms = state.platforms.filter(
    (_platform, index) => index > 0 && index < state.platforms.length - 1,
  )
  const platform =
    candidatePlatforms[(state.nextCollectibleId + state.levelIndex) % candidatePlatforms.length]

  if (!platform) {
    return undefined
  }

  const rare = (state.nextCollectibleId + state.levelIndex) % 5 === 0
  const width = 20
  const height = 20

  return {
    id: `collectible-${state.nextCollectibleId}`,
    position: {
      x: platform.position.x + Math.max(16, platform.bounds.width / 2 - width / 2),
      y: platform.position.y - height,
    },
    bounds: { width, height },
    kind: rare ? 'rare' : 'bonus',
    value: rare ? 1000 : 250,
    active: true,
  }
}

export function applyCollectibleSystem(state: GameState): GameState {
  if (state.screen !== 'playing') {
    return state
  }

  let collectibles = [...state.collectibles]
  let collectibleSpawnCooldown = state.collectibleSpawnCooldown - 1
  let nextCollectibleId = state.nextCollectibleId
  let scoreGain = 0
  let nextSoundEventId = state.nextSoundEventId
  const soundEvents = [...state.soundEvents]

  if (collectibleSpawnCooldown <= 0 && collectibles.length < 2) {
    const collectible = createCollectible(state)
    if (collectible) {
      collectibles.push(collectible)
      nextCollectibleId += 1
    }
    collectibleSpawnCooldown = Math.max(300, 720 - state.levelIndex * 60)
  }

  collectibles = collectibles
    .map((collectible) => {
      const pickedUp =
        collectible.active &&
        isIntersecting(
          { position: state.player.position, bounds: state.player.bounds },
          { position: collectible.position, bounds: collectible.bounds },
        )

      if (!pickedUp) {
        return collectible
      }

      scoreGain += collectible.value
      soundEvents.push({
        id: nextSoundEventId,
        type: 'score',
      })
      nextSoundEventId += 1

      return {
        ...collectible,
        active: false,
      }
    })
    .filter((collectible) => collectible.active)

  return {
    ...state,
    collectibles,
    collectibleSpawnCooldown,
    nextCollectibleId,
    score: state.score + scoreGain,
    nextSoundEventId,
    soundEvents,
  }
}
