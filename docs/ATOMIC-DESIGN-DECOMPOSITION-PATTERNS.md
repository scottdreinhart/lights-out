# 💡 Atomic Design Decomposition Patterns

**Purpose**: Practical patterns for decomposing oversized or mixed-concern components  
**Authority**: AGENTS.md § 4 (Architecture Preservation), this document  
**Scope**: React components in `src/ui/` and `apps/*/src/ui/`

---

## When to Decompose

Decompose when:

✅ Component exceeds atomic design responsibility  
✅ File has multiple concerns (state + logic + presentation)  
✅ File is difficult to test without mocking many dependencies  
✅ State logic is complex (>100 lines)  
✅ Component has >3 event handlers requiring substantial logic  
✅ Component renders conditional branches that could be separate components  
✅ File accumulates long-form comments (suggests hidden complexity)

---

## Decomposition Strategy

**Rule**: Decompose **by responsibility**, not by line count.

**Concerns to separate**:

1. **Presentation** (JSX, rendering, layout)
2. **State Coordination** (useState, state machine)
3. **Derived State** (useMemo, selectors, computed values)
4. **Side Effects** (useEffect, event tracking, analytics)
5. **Event Handlers** (onClick, onChange, onSubmit)
6. **Data Transformation** (formatting, validation, normalization)
7. **Permissions / Guards** (access control, conditional rendering)
8. **Styling Concerns** (dynamic styles, responsive classes)
9. **Accessibility** (ARIA attributes, keyboard nav)
10. **Subcomponent Composition** (rendering child components)

---

## Pattern 1: Extract State Logic to Custom Hook

**When**: Component has complex state that could be reused or tested separately

**Before** (Mixed state + presentation):

```tsx
// GameBoard.tsx (organism, ~280 lines - too large!)
import { useState, useCallback } from 'react'
import { GameBoardGrid } from '@/ui/molecules'
import { createBoard, isValidMove, makeMove } from '@/domain'

const GameBoard = ({ difficulty }) => {
  const [board, setBoard] = useState(createBoard())
  const [moves, setMoves] = useState([])
  const [isGameOver, setIsGameOver] = useState(false)
  const [selectedCell, setSelectedCell] = useState(null)
  const [hints, setHints] = useState(3)

  // Complex state coordination logic (50+ lines)
  const handleMove = useCallback(
    (row, col) => {
      if (!isValidMove(board, row, col)) return
      const newBoard = makeMove(board, row, col)
      setBoard(newBoard)
      setMoves([...moves, { row, col }])
      if (isGameEnd(newBoard, difficulty)) {
        setIsGameOver(true)
      }
    },
    [board, moves, difficulty],
  )

  const handleUndo = useCallback(() => {
    if (moves.length === 0) return
    const previousMoves = moves.slice(0, -1)
    setMoves(previousMoves)
    const newBoard = previousMoves.reduce((b, m) => makeMove(b, m.row, m.col), createBoard())
    setBoard(newBoard)
    setIsGameOver(false)
  }, [moves])

  const handleHint = useCallback(() => {
    if (hints <= 0) return
    const hint = getHint(board, difficulty)
    setHints(hints - 1)
    // Show hint UI
  }, [board, hints, difficulty])

  return (
    <div className={styles.root}>
      <div className={styles.info}>
        <span>Moves: {moves.length}</span>
        <span>Hints: {hints}</span>
      </div>
      <GameBoardGrid
        board={board}
        onCellClick={handleMove}
        selectedCell={selectedCell}
        onSelectCell={setSelectedCell}
      />
      <div className={styles.controls}>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleHint}>Hint</button>
      </div>
      {isGameOver && (
        <GameOverModal
          onPlayAgain={() => {
            /* reset */
          }}
        />
      )}
    </div>
  )
}
```

**After** (Extract state to custom hook):

```tsx
// hooks/useGameBoard.ts (in @/app)
export const useGameBoard = (difficulty) => {
  const [board, setBoard] = useState(createBoard())
  const [moves, setMoves] = useState([])
  const [isGameOver, setIsGameOver] = useState(false)
  const [hints, setHints] = useState(3)

  const handleMove = useCallback(
    (row, col) => {
      if (!isValidMove(board, row, col)) return
      const newBoard = makeMove(board, row, col)
      setBoard(newBoard)
      setMoves([...moves, { row, col }])
      if (isGameEnd(newBoard, difficulty)) {
        setIsGameOver(true)
      }
    },
    [board, moves, difficulty],
  )

  const handleUndo = useCallback(() => {
    if (moves.length === 0) return
    const previousMoves = moves.slice(0, -1)
    setMoves(previousMoves)
    const newBoard = previousMoves.reduce((b, m) => makeMove(b, m.row, m.col), createBoard())
    setBoard(newBoard)
    setIsGameOver(false)
  }, [moves])

  const handleHint = useCallback(() => {
    if (hints <= 0) return
    setHints(hints - 1)
  }, [hints])

  return { board, moves, isGameOver, hints, handleMove, handleUndo, handleHint }
}

// GameBoard.tsx (organism, now ~80 lines - focused!)
const GameBoard = ({ difficulty }) => {
  const { board, moves, isGameOver, hints, handleMove, handleUndo, handleHint } =
    useGameBoard(difficulty)
  const [selectedCell, setSelectedCell] = useState(null)

  return (
    <div className={styles.root}>
      <div className={styles.info}>
        <span>Moves: {moves.length}</span>
        <span>Hints: {hints}</span>
      </div>
      <GameBoardGrid
        board={board}
        onCellClick={handleMove}
        selectedCell={selectedCell}
        onSelectCell={setSelectedCell}
      />
      <div className={styles.controls}>
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleHint}>Hint</button>
      </div>
      {isGameOver && (
        <GameOverModal
          onPlayAgain={() => {
            /* reset */
          }}
        />
      )}
    </div>
  )
}
```

---

## Pattern 2: Extract Derived State to useMemo or Custom Hook

**When**: Component computes expensive state from base state repeatedly

**Before** (Recomputed every render):

```tsx
// ScoreBoard.tsx (molecule, ~150 lines)
const ScoreBoard = ({ players, currentRound, gameStats }) => {
  // Recomputed on every render
  const totalScore = players.reduce((sum, p) => sum + p.score, 0)
  const winner = players.reduce((max, p) => (p.score > max.score ? p : max))
  const averageScore = totalScore / players.length
  const roundCompletion = (currentRound / 10) * 100
  const timeRemaining = calculateTimeRemaining(gameStats.startTime)

  return (
    <div className={styles.root}>
      <div className={styles.scores}>
        {players.map((p) => (
          <ScoreCard key={p.id} name={p.name} score={p.score} isWinner={p === winner} />
        ))}
      </div>
      <div className={styles.meta}>
        <ProgressBar value={roundCompletion} max={100} />
        <span>Average: {averageScore}</span>
        <span>Time: {timeRemaining}</span>
      </div>
    </div>
  )
}
```

**After** (Extract computed values to useMemo):

```tsx
// ScoreBoard.tsx (molecule, ~110 lines - cleaner)
const ScoreBoard = ({ players, currentRound, gameStats }) => {
  const scoreStats = useMemo(() => {
    const totalScore = players.reduce((sum, p) => sum + p.score, 0)
    const winner = players.reduce((max, p) => (p.score > max.score ? p : max))
    const averageScore = totalScore / players.length
    return { totalScore, winner, averageScore }
  }, [players])

  const roundStats = useMemo(
    () => ({
      completion: (currentRound / 10) * 100,
      timeRemaining: calculateTimeRemaining(gameStats.startTime),
    }),
    [currentRound, gameStats.startTime],
  )

  return (
    <div className={styles.root}>
      <div className={styles.scores}>
        {players.map((p) => (
          <ScoreCard key={p.id} name={p.name} score={p.score} isWinner={p === scoreStats.winner} />
        ))}
      </div>
      <div className={styles.meta}>
        <ProgressBar value={roundStats.completion} max={100} />
        <span>Average: {scoreStats.averageScore}</span>
        <span>Time: {roundStats.timeRemaining}</span>
      </div>
    </div>
  )
}
```

---

## Pattern 3: Extract Event Handlers to Separate Functions

**When**: Component has multiple non-trivial event handlers

**Before** (Handlers inline):

```tsx
// Modal.tsx (organism, ~200 lines)
const Modal = ({ isOpen, data, onClose, onSave }) => {
  const [formData, setFormData] = useState(data)
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    // Validation logic (15 lines)
    const newData = { ...formData, [field]: value }
    const fieldErrors = {}
    if (field === 'name' && value.length < 3) {
      fieldErrors.name = 'Name too short'
    }
    if (field === 'email' && !isValidEmail(value)) {
      fieldErrors.email = 'Invalid email'
    }
    setFormData(newData)
    setErrors({ ...errors, ...fieldErrors })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Submission logic (20 lines)
    const validation = validate(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    try {
      await saveData(formData)
      onSave(formData)
      onClose()
    } catch (err) {
      setErrors({ submit: err.message })
    }
  }

  return (
    <dialog open={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <input onChange={(e) => handleChange('name', e.target.value)} />
        <input onChange={(e) => handleChange('email', e.target.value)} />
        <button type="submit">Save</button>
      </form>
    </dialog>
  )
}
```

**After** (Extract handlers):

```tsx
// Modal.tsx (organism, ~90 lines - focused)
const Modal = ({ isOpen, data, onClose, onSave }) => {
  const { formData, errors, handleChange, handleSubmit } = useModalForm(data, onSave, onClose)

  return (
    <dialog open={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => handleChange('name', e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && <span id="name-error">{errors.name}</span>}
        <input
          onChange={(e) => handleChange('email', e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && <span id="email-error">{errors.email}</span>}
        <button type="submit">Save</button>
      </form>
    </dialog>
  )
}

// hooks/useModalForm.ts (in @/app)
export const useModalForm = (data, onSave, onClose) => {
  const [formData, setFormData] = useState(data)
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value }
    const fieldErrors = {}
    if (field === 'name' && value.length < 3) {
      fieldErrors.name = 'Name too short'
    }
    if (field === 'email' && !isValidEmail(value)) {
      fieldErrors.email = 'Invalid email'
    }
    setFormData(newData)
    setErrors({ ...errors, ...fieldErrors })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validate(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }
    try {
      await saveData(formData)
      onSave(formData)
      onClose()
    } catch (err) {
      setErrors({ submit: err.message })
    }
  }

  return { formData, errors, handleChange, handleSubmit }
}
```

---

## Pattern 4: Extract Presentational Sub-Components

**When**: Component has large conditional rendering or repeated markup patterns

**Before** (Large JSX block):

```tsx
// Dashboard.tsx (organism, ~250 lines)
const Dashboard = ({ stats, isLoading, error }) => {
  return (
    <div className={styles.root}>
      {isLoading && <Spinner />}
      {error && (
        <div className={styles.error} role="alert">
          <h2>Error</h2>
          <p>{error.message}</p>
          <button onClick={/* retry */}>Retry</button>
        </div>
      )}
      {!isLoading && !error && (
        <div className={styles.content}>
          {/* Stats grid: 80 lines of JSX */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>{stats.totalGames}</h3>
              <p>Total Games</p>
              <small>{stats.winRate}% Win Rate</small>
            </div>
            <div className={styles.statCard}>
              <h3>{stats.currentStreak}</h3>
              <p>Current Streak</p>
              <small>Best: {stats.longestStreak}</small>
            </div>
            {/* ... more stat cards ... */}
          </div>

          {/* Recent games list: 40 lines of JSX */}
          <div className={styles.recentGames}>
            <h2>Recent Games</h2>
            {stats.recentGames.length === 0 ? (
              <p>No games yet</p>
            ) : (
              <ul>
                {stats.recentGames.map((game) => (
                  <li key={game.id}>
                    <span>{game.opponent}</span>
                    <span>{game.result}</span>
                    <time>{formatDate(game.date)}</time>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
```

**After** (Extract sub-components):

```tsx
// Dashboard.tsx (organism, ~110 lines - focused)
const Dashboard = ({ stats, isLoading, error }) => {
  if (isLoading) return <Spinner />
  if (error) return <DashboardError error={error} />

  return (
    <div className={styles.root}>
      <DashboardStats stats={stats} />
      <DashboardRecentGames games={stats.recentGames} />
    </div>
  )
}

// DashboardStats.tsx (molecule)
const DashboardStats = ({ stats }) => (
  <div className={styles.statsGrid}>
    <StatCard value={stats.totalGames} label="Total Games" meta={`${stats.winRate}% Win Rate`} />
    <StatCard
      value={stats.currentStreak}
      label="Current Streak"
      meta={`Best: ${stats.longestStreak}`}
    />
    {/* ... */}
  </div>
)

// DashboardRecentGames.tsx (molecule)
const DashboardRecentGames = ({ games }) => (
  <div className={styles.recentGames}>
    <h2>Recent Games</h2>
    {games.length === 0 ? (
      <p>No games yet</p>
    ) : (
      <ul>
        {games.map((game) => (
          <GameListItem key={game.id} game={game} />
        ))}
      </ul>
    )}
  </div>
)

// DashboardError.tsx (molecule)
const DashboardError = ({ error }) => (
  <div className={styles.error} role="alert">
    <h2>Error</h2>
    <p>{error.message}</p>
    <button onClick={/* retry */}>Retry</button>
  </div>
)
```

---

## Pattern 5: Extract Data Transformation to Domain Functions

**When**: Component performs domain-specific data transformation

**Before** (Logic in component):

```tsx
// Leaderboard.tsx (organism, ~200 lines)
const Leaderboard = ({ rawScores }) => {
  // Complex data transformation (30 lines)
  const leaderboardData = useMemo(() => {
    return rawScores
      .filter((s) => s.timestamp > Date.now() - 30 * 24 * 60 * 60 * 1000)
      .map((s) => ({
        ...s,
        percentile: calculatePercentile(s.score, rawScores),
        rank: 0,
        badge: s.score > 1000 ? 'master' : s.score > 500 ? 'expert' : 'novice',
        stats: {
          avgMoves: s.totalMoves / s.gamesPlayed,
          winRate: (s.wins / s.gamesPlayed) * 100,
          difficulty: determineDifficulty(s),
        },
      }))
      .sort((a, b) => b.score - a.score)
      .map((item, idx) => ({ ...item, rank: idx + 1 }))
  }, [rawScores])

  return (
    <div className={styles.root}>
      <table>
        <tbody>
          {leaderboardData.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.rank}</td>
              <td>{entry.name}</td>
              <td>{entry.score}</td>
              <td>{entry.badge}</td>
              <td>{entry.stats.winRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

**After** (Extract to domain):

```tsx
// @/domain/leaderboard.ts (new, in domain layer)
export const transformLeaderboardScores = (rawScores) => {
  const filtered = rawScores.filter((s) => s.timestamp > Date.now() - 30 * 24 * 60 * 60 * 1000)

  const mapped = filtered.map((s) => ({
    ...s,
    percentile: calculatePercentile(s.score, filtered),
    badge: s.score > 1000 ? 'master' : s.score > 500 ? 'expert' : 'novice',
    stats: {
      avgMoves: s.totalMoves / s.gamesPlayed,
      winRate: (s.wins / s.gamesPlayed) * 100,
      difficulty: determineDifficulty(s),
    },
  }))

  const sorted = mapped.sort((a, b) => b.score - a.score)

  return sorted.map((item, idx) => ({ ...item, rank: idx + 1 }))
}

// Leaderboard.tsx (organism, ~100 lines - focused)
const Leaderboard = ({ rawScores }) => {
  const leaderboardData = useMemo(() => transformLeaderboardScores(rawScores), [rawScores])

  return (
    <div className={styles.root}>
      <table>
        <tbody>
          {leaderboardData.map((entry) => (
            <LeaderboardRow key={entry.id} entry={entry} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

## Pattern 6: Extract Accessibility Concerns

**When**: Component has complex accessibility logic mixed with presentation

**Before** (A11y inline):

```tsx
// GameBoard.tsx (organism, ~180 lines)
const GameBoard = ({ board, onMove }) => {
  const [focusedCell, setFocusedCell] = useState({ row: 0, col: 0 })

  const handleKeyDown = (e) => {
    const { row, col } = focusedCell
    case 'ArrowUp': setFocusedCell({ row: row - 1, col })
    case 'ArrowDown': setFocusedCell({ row: row + 1, col })
    case 'ArrowLeft': setFocusedCell({ row, col: col - 1 })
    case 'ArrowRight': setFocusedCell({ row, col: col + 1 })
    case 'Enter': onMove(row, col)
  }

  return (
    <div className={styles.root} role="application" aria-label="Game board">
      <div className={styles.grid} onKeyDown={handleKeyDown}>
        {board.map((row, r) => (
          <div key={r} role="row">
            {row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => onMove(r, c)}
                onKeyDown={(e) => handleKeyDown(e, r, c)}
                tabIndex={/* complex logic */}
                aria-label={`Cell ${r}, ${c}: ${cell.value}`}
                aria-pressed={focusedCell.row === r && focusedCell.col === c}
                aria-describedby={/* ... */}
                className={focusedCell.row === r && focusedCell.col === c ? styles.focused : ''}
              >
                {cell.value}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
```

**After** (Extract a11y to utility):

```tsx
// utils/useGameBoardA11y.ts (in hooks/)
export const useGameBoardA11y = (boardSize, onMove) => {
  const [focusedCell, setFocusedCell] = useState({ row: 0, col: 0 })

  const handleKeyDown = (e) => {
    const { row, col } = focusedCell
    switch (e.key) {
      case 'ArrowUp':
        if (row > 0) setFocusedCell({ row: row - 1, col })
        e.preventDefault()
        break
      case 'ArrowDown':
        if (row < boardSize - 1) setFocusedCell({ row: row + 1, col })
        e.preventDefault()
        break
      case 'ArrowLeft':
        if (col > 0) setFocusedCell({ row, col: col - 1 })
        e.preventDefault()
        break
      case 'ArrowRight':
        if (col < boardSize - 1) setFocusedCell({ row, col: col + 1 })
        e.preventDefault()
        break
      case 'Enter':
        onMove(row, col)
        break
    }
  }

  const getCellA11yAttrs = (row, col) => ({
    tabIndex: focusedCell.row === row && focusedCell.col === col ? 0 : -1,
    'aria-label': `Cell ${row}, ${col}`,
    'aria-pressed': focusedCell.row === row && focusedCell.col === col,
  })

  return { focusedCell, handleKeyDown, getCellA11yAttrs }
}

// GameBoard.tsx (organism, ~110 lines - cleaner)
const GameBoard = ({ board, onMove }) => {
  const { focusedCell, handleKeyDown, getCellA11yAttrs } = useGameBoardA11y(board.length, onMove)

  return (
    <div className={styles.root} role="application" aria-label="Game board">
      <div className={styles.grid} onKeyDown={handleKeyDown}>
        {board.map((row, r) => (
          <div key={r} role="row">
            {row.map((cell, c) => (
              <GameBoardCell
                key={`${r}-${c}`}
                value={cell.value}
                isSelected={focusedCell.row === r && focusedCell.col === c}
                onClick={() => onMove(r, c)}
                {...getCellA11yAttrs(r, c)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Decomposition Checklist

Before claiming a component is "done":

- [ ] Component has single, clear responsibility
- [ ] File is under size threshold for its atomic level
- [ ] State logic is testable independently (consider hook extraction)
- [ ] Event handlers are readable (consider handler extraction)
- [ ] Computed values use useMemo where appropriate
- [ ] JSX is readable (no deeply nested ternaries)
- [ ] Comments are short and implementation-specific
- [ ] Long-form explanation extracted to markdown if needed
- [ ] ESLint validation passes (`pnpm lint`)
- [ ] Component can be tested without excessive mocking

If any checkbox fails, decompose by the patterns above.

---

## References

- **Atomic Design**: https://bradfrost.com/blog/post/atomic-web-design/
- **SOLID Principles**: AGENTS.md § 10
- **ESLint Boundaries**: https://github.com/jayu/eslint-plugin-boundaries
- **React Best Practices**: `.github/instructions/02-frontend.instructions.md`

---

**Decompose by responsibility. Code remains readable. Architecture stays clean.** ✅
