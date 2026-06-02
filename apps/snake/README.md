# Snake

The classic arcade game where you guide a growing snake around the grid collecting food. Each piece of food makes you longer and scores points. Avoid hitting the walls or yourself. Sounds easy—it's not!

## 🎮 Quick Start

1. **Control Snake**: Use arrow keys or WASD to move up/down/left/right
2. **Eat Food**: Red squares appear randomly. Move to them to eat.
3. **Grow**: Eating food makes you 1 segment longer and +10 points
4. **Avoid**: Don't hit walls (edges) or your own body (tail)
5. **Game Speed**: Game gets faster as you grow longer (or by time)
6. **Win**: Get highest score before crashing

## 📖 Game Rules

**Objective**: Eat as much food as possible while avoiding obstacles. Get the highest score.

**Game Board**: 20×20 grid (adjustable per difficulty)  
**Snake**: Starts with 3 segments in the center  
**Food**: Appears randomly on the grid (1 piece at a time)  
**Speed**: Increases with difficulty level and time

**Movement Rules**:

- Snake moves continuously in current direction
- Direction changes when you press arrow key or WASD
- You cannot reverse directly (can't go backward into yourself)
- Snake occupies multiple grid squares based on length

**Eating Food**:

- When snake head touches food square, food is consumed
- Snake grows 1 segment (tail extends)
- Score increases (+10 points typically)
- New food appears immediately

**Crashing**:

- **Wall Collision**: Snake head hits boundary → game over
  - Optional: Wrap around to opposite side (alternates per variant)
- **Self Collision**: Snake head hits own body → game over

**Difficulty Levels**:

- **Easy** (10×10, slow speed): Learning mode
- **Medium** (20×20, normal speed): Standard game
- **Hard** (20×20, fast speed): Challenge mode
- **Expert** (30×30, very fast): Extreme challenge

## 🎯 How to Play

### Controls

**Desktop (Keyboard)**

- **Arrow Keys**: Move up/down/left/right (standard)
- **WASD**: Alternative left/right/up/down
- **Space**: Pause/resume
- **Escape**: Open menu
- **R**: Restart current game

**Mobile (Touch)**

- **Swipe**: Direction control (swipe up/down/left/right for movement)
- **D-Pad on screen**: 4-button directional pad
- **Pause Button**: At top of screen

**TV/Gamepad (D-Pad)**

- **D-Pad**: Move snake in all directions
- **Start Button**: Pause
- **Back Button**: Menu
- **OK Button**: Resume/start

### Game Flow

1. **Game Start**: Snake in center (3 segments), food placed randomly
2. **Continuous Movement**: Snake moves in current direction every frame
3. **Your Input**: Press direction key to change direction
   - Direction changes on next move tick (not instant)
4. **Eat Food**: Head touches food → +1 length, +10 points, new food
5. **Obstacles**:
   - **Wall Hit**: Game over, final score shown
   - **Self Hit**: Game over, final score shown
6. **Score Display**: Points shown in top corner, length shown
7. **Game Over**: Restarts or returns to menu

### Scoring

- **Points**: +10 per food piece (adjustable)
- **Bonus**: Eat N food pieces in fast succession → +50 bonus
- **Length**: Final snake length displayed
- **High Score**: Best game recorded
- **Speed Bonus**: Harder difficulties = higher points per food

## 🏗️ Architecture

This is a **DEVELOPING** implementation (68% complete) focusing on game loop and smooth movement.

### Domain Layer (`src/domain/`)

**Core Concepts**:

- `Position` = { x, y }
- `Snake` = Position[] (head first, tail last)
- `Direction` = 'up'|'down'|'left'|'right'
- `GameState` = { snake, foodPosition, score, gameOver }

**Key Files**:

- `types.ts` — Position, Direction, Snake, GameState types
- `rules.ts` — Collision detection, movement validation
- `grid.ts` — Grid management, food placement
- `physics.ts` — Snake movement, tick logic

**Core Logic**:

```typescript
// Move snake forward (advance positions, grow if food eaten)
function tick(state: GameState, direction: Direction): GameState

// Check if head collides with wall or body
function isCollision(snake: Snake, gridSize: number): boolean

// Detect if head touches food
function isFoodEaten(head: Position, food: Position): boolean

// Place new food on empty square
function placeFood(snake: Snake, gridSize: number): Position
```

### App Layer (`src/app/`)

**Custom Hooks**:

- `useSnakeGame()` — Game state, score, speed control
- `useKeyboardControls()` — Arrow/WASD input
- `useTouchControls()` — Swipe detection for mobile

**Services**:

- `gameService.ts` — Game loop tick rate
- `storageService.ts` — High scores, game history

### UI Layer (`src/ui/`)

**Organisms**:

- `SnakeGame` — Main game display
- `GameBoard` — 20×20 grid with snake and food
- `ScoreBoard` — Score, length, high score

**Molecules**:

- `GridDisplay` — Game board grid rendering
- `SnakeSegment` — Individual box in snake
- `FoodDot` — Food square

**Atoms**:

- `Button` — Controls and menu
- `Score` — Text display

## ✅ Development Status

**Completion**: 68% ✅ (Developing)  
**Core Gameplay**: Fully functional  
**Animations**: Smooth grid-based movement

**What's Done**:

- ✅ Snake movement and direction control
- ✅ Food generation and collision detection
- ✅ Obstacle avoidance (walls and self)
- ✅ Scoring system
- ✅ Multiple difficulty levels
- ✅ Keyboard and touch controls
- ✅ Game state management
- ✅ High score tracking

**In Progress**:

- ⏳ Pause/resume functionality
- ⏳ Progressive difficulty (increases over time)

**TODO**:

- ❌ Sound effects (eat, crash, level up)
- ❌ Power-ups (speed boost, slow motion, shield)
- ❌ Obstacles (walls within grid)
- ❌ Leaderboard persistence

## 🚀 Getting Started

```bash
pnpm install
pnpm --filter @games/snake dev
pnpm --filter @games/snake test
```

---

**Last Updated**: April 6, 2026  
**Maturity**: Developing (68% complete)  
**Platforms**: Web, Electron, iOS, Android
