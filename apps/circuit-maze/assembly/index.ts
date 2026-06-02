// Circuit Maze Sentinel AI — WebAssembly (AssemblyScript)
//
// Exports:
// - initGrid(width, height): initialize walkable grid
// - setWall(index, blocked): mark wall cells (1=wall, 0=walkable)
// - pickMoveAStar(currentX, currentY, targetX, targetY, tier, seed): direction
//
// Direction index:
//   0 = up, 1 = right, 2 = down, 3 = left, 4 = stay
//
// Tier values:
//   0 = easy, 1 = medium, 2 = hard, 3 = elite

const MAX_CELLS: i32 = 512
const SCORE_INF: i32 = 2147483647

let gridWidth: i32 = 0
let gridHeight: i32 = 0
let gridSize: i32 = 0

const walkable = new StaticArray<i32>(MAX_CELLS)
const gScore = new StaticArray<i32>(MAX_CELLS)
const fScore = new StaticArray<i32>(MAX_CELLS)
const cameFrom = new StaticArray<i32>(MAX_CELLS)
const openMask = new StaticArray<i32>(MAX_CELLS)
const closedMask = new StaticArray<i32>(MAX_CELLS)

function absInt(value: i32): i32 {
  return value < 0 ? -value : value
}

function inBounds(x: i32, y: i32): bool {
  return x >= 0 && x < gridWidth && y >= 0 && y < gridHeight
}

function toIndex(x: i32, y: i32): i32 {
  return y * gridWidth + x
}

function toX(index: i32): i32 {
  return index % gridWidth
}

function toY(index: i32): i32 {
  return index / gridWidth
}

function manhattanIndex(a: i32, b: i32): i32 {
  return absInt(toX(a) - toX(b)) + absInt(toY(a) - toY(b))
}

function tierHeuristicNoise(tier: i32, seed: i32, index: i32): i32 {
  if (tier <= 0) {
    return (seed + index * 17) & 3
  }
  if (tier === 1) {
    return (seed + index * 11) & 1
  }
  return 0
}

function resetWorkingSets(): void {
  for (let i = 0; i < gridSize; i += 1) {
    gScore[i] = SCORE_INF
    fScore[i] = SCORE_INF
    cameFrom[i] = -1
    openMask[i] = 0
    closedMask[i] = 0
  }
}

function pickBestOpenIndex(): i32 {
  let best = -1
  let bestScore = SCORE_INF
  for (let i = 0; i < gridSize; i += 1) {
    if (openMask[i] === 0) {
      continue
    }
    const score = fScore[i]
    if (score < bestScore) {
      bestScore = score
      best = i
    }
  }
  return best
}

function relaxNeighbor(current: i32, neighbor: i32, goal: i32, tier: i32, seed: i32): void {
  if (neighbor < 0 || neighbor >= gridSize) {
    return
  }
  if (walkable[neighbor] === 0 || closedMask[neighbor] !== 0) {
    return
  }

  const tentative = gScore[current] + 1
  if (tentative >= gScore[neighbor]) {
    return
  }

  gScore[neighbor] = tentative
  cameFrom[neighbor] = current
  const heuristic = manhattanIndex(neighbor, goal) + tierHeuristicNoise(tier, seed, neighbor)
  fScore[neighbor] = tentative + heuristic
  openMask[neighbor] = 1
}

function findPathFirstStep(start: i32, goal: i32, tier: i32, seed: i32): i32 {
  resetWorkingSets()

  gScore[start] = 0
  fScore[start] = manhattanIndex(start, goal)
  openMask[start] = 1

  while (true) {
    const current = pickBestOpenIndex()
    if (current < 0) {
      break
    }
    if (current === goal) {
      break
    }

    openMask[current] = 0
    closedMask[current] = 1

    const x = toX(current)
    const y = toY(current)

    if (y > 0) {
      relaxNeighbor(current, toIndex(x, y - 1), goal, tier, seed)
    }
    if (x < gridWidth - 1) {
      relaxNeighbor(current, toIndex(x + 1, y), goal, tier, seed)
    }
    if (y < gridHeight - 1) {
      relaxNeighbor(current, toIndex(x, y + 1), goal, tier, seed)
    }
    if (x > 0) {
      relaxNeighbor(current, toIndex(x - 1, y), goal, tier, seed)
    }
  }

  if (cameFrom[goal] < 0) {
    return -1
  }

  let cursor = goal
  let parent = cameFrom[cursor]
  while (parent >= 0 && parent !== start) {
    cursor = parent
    parent = cameFrom[cursor]
  }

  if (parent < 0) {
    return -1
  }
  return cursor
}

function fallbackGreedyDirection(
  currentX: i32,
  currentY: i32,
  targetX: i32,
  targetY: i32,
  tier: i32,
  seed: i32,
): i32 {
  let bestDirection: i32 = 4
  let bestScore: i32 = SCORE_INF

  const candidates = new StaticArray<i32>(4)
  candidates[0] = currentY > 0 ? toIndex(currentX, currentY - 1) : -1
  candidates[1] = currentX < gridWidth - 1 ? toIndex(currentX + 1, currentY) : -1
  candidates[2] = currentY < gridHeight - 1 ? toIndex(currentX, currentY + 1) : -1
  candidates[3] = currentX > 0 ? toIndex(currentX - 1, currentY) : -1

  const targetIndex = toIndex(targetX, targetY)
  for (let dir = 0; dir < 4; dir += 1) {
    const candidate = candidates[dir]
    if (candidate < 0 || walkable[candidate] === 0) {
      continue
    }

    const score = manhattanIndex(candidate, targetIndex) + tierHeuristicNoise(tier, seed, candidate)
    if (score < bestScore) {
      bestScore = score
      bestDirection = dir
    }
  }

  return bestDirection
}

export function initGrid(width: i32, height: i32): void {
  if (width <= 0 || height <= 0) {
    return
  }

  const size = width * height
  if (size > MAX_CELLS) {
    return
  }

  gridWidth = width
  gridHeight = height
  gridSize = size

  for (let i = 0; i < gridSize; i += 1) {
    walkable[i] = 1
  }
}

export function setWall(index: i32, blocked: i32): void {
  if (index < 0 || index >= gridSize) {
    return
  }
  walkable[index] = blocked !== 0 ? 0 : 1
}

export function pickMoveAStar(
  currentX: i32,
  currentY: i32,
  targetX: i32,
  targetY: i32,
  tier: i32,
  seed: i32,
): i32 {
  if (
    gridSize <= 0 ||
    !inBounds(currentX, currentY) ||
    !inBounds(targetX, targetY)
  ) {
    return 4
  }

  const start = toIndex(currentX, currentY)
  const goal = toIndex(targetX, targetY)
  if (start === goal) {
    return 4
  }

  const step = findPathFirstStep(start, goal, tier, seed)
  if (step >= 0) {
    const stepX = toX(step)
    const stepY = toY(step)
    if (stepY < currentY) {
      return 0
    }
    if (stepX > currentX) {
      return 1
    }
    if (stepY > currentY) {
      return 2
    }
    if (stepX < currentX) {
      return 3
    }
    return 4
  }

  return fallbackGreedyDirection(currentX, currentY, targetX, targetY, tier, seed)
}
