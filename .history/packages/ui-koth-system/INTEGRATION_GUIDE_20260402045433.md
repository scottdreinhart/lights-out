# KOTH System: Game Integration Guide

**Date**: April 2, 2026 (Updated)  
**Package**: `@games/ui-koth-system`  
**Audience**: Game app developers

**Available Components & Hooks:**
- `KothRankingScreen` — Full-screen results display
- `KothPodium` — Top 3 podium with medals (NEW)
- `KothEntryRow` — Enhanced ranking row with metadata (NEW)
- `KothLeaderboard` — Reusable leaderboard list
- `KothRankingEntry` — Basic entry component
- `useKothLeaderboard` — Basic state hook
- `useKothData` — localStorage-backed state hook (NEW)

---

## Quick Start (5 minutes)

### 1. Install the Package

The package is already available as `@games/ui-koth-system` in your monorepo.

```bash
# In your game app directory
cd apps/your-game-app
```

### 2. Basic Usage with New Hook

```tsx
import { useKothData, KothEntryRow, KothPodium } from '@games/ui-koth-system'

export const ResultsScreen = ({ score, difficulty }) => {
  const { entries, addEntry } = useKothData({
    gameName: 'your-game',
    maxEntries: 100,
  })

  // Add current game result to leaderboard
  const handleGameEnd = () => {
    addEntry({
      username: 'PlayerName',
      score,
      difficulty,
      duration: 120, // seconds
      wins: 1,
      timestamp: Date.now(),
      rank: 0,
    })
  }

  const topThree = entries.slice(0, 3)

  return (
    <div>
      <KothPodium first={topThree[0]} second={topThree[1]} third={topThree[2]} />
      {entries.map((entry) => (
        <KothEntryRow key={entry.id} entry={entry} />
      ))}
    </div>
  )
}
```

Done! ✅

---

## Common Integration Patterns

### Pattern 1: Direct Results Screen

**Use when**: Your game has a traditional results screen after gameplay.

```tsx
// apps/your-game/src/ui/organisms/ResultsScreen.tsx
import { KothRankingScreen } from '@games/ui-koth-system'
import { useGameStats } from '@/app'

export const ResultsScreen = () => {
  const { score, rank, playerName } = useGameStats()

  return (
    <KothRankingScreen
      playerScore={score}
      playerRank={rank}
      playerName={playerName}
      onNewGame={() => window.location.reload()}
      onHome={() => navigate('/')}
    />
  )
}
```

### Pattern 2: Stats Service Integration

**Use when**: Your game has a centralized stats/persistence service.

```tsx
// apps/your-game/src/ui/organisms/RankingView.tsx
import { KothRankingScreen } from '@games/ui-koth-system'
import { statsService } from '@/app/services'

export const RankingView = () => {
  const currentStats = statsService.getCurrent()

  return (
    <KothRankingScreen
      playerScore={currentStats.totalScore}
      playerRank={calculateRank(currentStats)}
      playerName={currentStats.playerName}
      onNewGame={handleNewGame}
      onHome={goHome}
    />
  )
}
```

### Pattern 3: Leaderboard Page

**Use when**: You want to display full leaderboard rankings.

```tsx
// apps/your-game/src/ui/organisms/LeaderboardPage.tsx
import { KothLeaderboard, KothLeaderboardState } from '@games/ui-koth-system'
import { useLeaderboardData } from '@/app'

export const LeaderboardPage = () => {
  const { entries, currentPlayerId } = useLeaderboardData()

  return (
    <div className="page">
      <h1>Top Players</h1>
      <KothLeaderboard
        entries={entries}
        currentPlayerId={currentPlayerId}
        onSelectEntry={(entry) => viewPlayerProfile(entry.id)}
      />
    </div>
  )
}
```

### Pattern 4: Custom Layout

**Use when**: You want to customize the layout but use the ranking components.

```tsx
// apps/your-game/src/ui/organisms/CustomRanking.tsx
import { KothRankingEntry } from '@games/ui-koth-system'
import styles from './CustomRanking.module.css'

export const CustomRanking = ({ topPlayers }) => {
  return (
    <div className={styles.customLayout}>
      <div className={styles.kingSection}>
        {topPlayers[0] && (
          <>
            <h2>👑 The King</h2>
            <KothRankingEntry
              rank={1}
              playerName={topPlayers[0].name}
              playerScore={topPlayers[0].score}
              isKing={true}
            />
          </>
        )}
      </div>

      <div className={styles.challengersSection}>
        <h2>Challengers</h2>
        {topPlayers.slice(1).map((player, index) => (
          <KothRankingEntry
            key={player.id}
            rank={index + 2}
            playerName={player.name}
            playerScore={player.score}
          />
        ))}
      </div>
    </div>
  )
}
```

---

## Type Integration

### Using Type Definitions

```tsx
import type { KothEntry, KothRankingScreenProps } from '@games/ui-koth-system'

// Use types in your data structures
const leaderboard: KothEntry[] = [
  {
    id: 'player1',
    name: 'Champion',
    score: 5000,
    rank: 1,
    timestamp: new Date(),
  },
  {
    id: 'player2',
    name: 'Contender',
    score: 4200,
    rank: 2,
    timestamp: new Date(),
  },
]

// Type-safe props
const screenProps: KothRankingScreenProps = {
  playerScore: 2500,
  playerRank: 3,
  onNewGame: () => {},
  onHome: () => {},
}
```

---

## Hook Usage

### Using useKothLeaderboard

```tsx
import { useKothLeaderboard } from '@games/ui-koth-system'

export const MyComponent = () => {
  const { entries, currentRank, currentScore, kingName, isKing, loadEntries, updateScore } =
    useKothLeaderboard()

  useEffect(() => {
    // Load leaderboard data after game
    loadEntries(fetchedLeaderboardData)
    updateScore(newScore)
  }, [gameComplete])

  return (
    <div>
      <p>You are {isKing ? '👑 the King!' : `ranked #${currentRank}`}</p>
      <p>The King is: {kingName}</p>
    </div>
  )
}
```

---

## Styling & Theming

### Using CSS Variables

The component uses CSS variables for theming. Set these in your root layout:

```css
/* apps/your-game/src/styles/theme.css */
:root {
  /* Colors */
  --color-primary: #0087be;
  --color-primary-hover: #0070a0;
  --color-text-primary: #000000;
  --color-text-secondary: #666666;
  --color-background: #f5f5f5;
  --color-background-alt: #e8e8e8;
  --color-surface: #ffffff;
  --color-focus: #0087be;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-text-primary-dark: #ffffff;
    --color-text-secondary-dark: #999999;
    --color-background-dark: #0d0d0d;
    --color-background-alt-dark: #1a1a1a;
    --color-surface-dark: #1a1a1a;
  }
}
```

### Customizing with CSS Modules

```css
/* apps/your-game/src/ui/organisms/CustomRanking.module.css */
.customScreen {
  background: linear-gradient(135deg, var(--game-color-1), var(--game-color-2));
}

.kingBadge {
  color: gold;
  font-weight: 700;
}

.challengerEntry {
  background: rgba(255, 255, 255, 0.95);
}
```

---

## Data Flow Examples

### Example 1: Fetch from API

```tsx
// Fetch leaderboard from server after game
const fetchLeaderboard = async () => {
  const response = await fetch('/api/koth/leaderboard')
  const data = await response.json()

  return {
    entries: data.entries,
    currentScore: data.playerStats.score,
    currentRank: data.playerStats.rank,
  }
}

// Use in component
;<KothRankingScreen
  playerScore={leaderboardData.currentScore}
  playerRank={leaderboardData.currentRank}
  entries={leaderboardData.entries}
  onNewGame={startNewGame}
  onHome={goHome}
/>
```

### Example 2: Local Storage for Offline

```tsx
// Save current game result to localStorage
const saveResult = (score: number, rank: number) => {
  const result = {
    score,
    rank,
    timestamp: new Date().toISOString(),
    playerName: localStorage.getItem('playerName'),
  }

  const results = JSON.parse(localStorage.getItem('kothResults') || '[]')
  results.push(result)
  localStorage.setItem('kothResults', JSON.stringify(results))
}

// Load for display
const loadResults = () => {
  return JSON.parse(localStorage.getItem('kothResults') || '[]')
}
```

### Example 3: Real-time Updates

```tsx
// WebSocket connection for live leaderboard
const socket = io('wss://game-server.com')

socket.on('leaderboard-update', (newEntries) => {
  updateScore(newEntries)
})

useEffect(() => {
  return () => socket.disconnect()
}, [])
```

---

## Testing Your Integration

### Component Test Example

```tsx
// apps/your-game/src/ui/organisms/ResultsScreen.test.tsx
import { render, screen } from '@testing-library/react'
import { ResultsScreen } from './ResultsScreen'

describe('ResultsScreen', () => {
  it('displays KothRankingScreen with game stats', () => {
    render(<ResultsScreen />)

    expect(screen.getByText('2500')).toBeInTheDocument()
    expect(screen.getByText('Your Rank: 3')).toBeInTheDocument()
  })

  it('calls onNewGame when button clicked', async () => {
    const { user } = render(<ResultsScreen />)

    await user.click(screen.getByRole('button', { name: /new game/i }))

    expect(window.location.reload).toHaveBeenCalled()
  })
})
```

### E2E Test Example

```tsx
// apps/your-game/src/ui/organisms/ResultsScreen.e2e.spec.ts
import test from '@playwright/test'

test('displays results screen after game', async ({ page }) => {
  await page.goto('/game')
  // Play game...

  // Assert results screen shown
  await page.waitForSelector('text=2500')
  await page.click('button:has-text("New Game")')

  // Should start new game
  await page.waitForSelector('[class*="game-board"]')
})
```

---

## Performance Tips

### 1. Memoize Leaderboard Entries

```tsx
import { useMemo } from 'react'

export const MyLeaderboard = ({ entries }) => {
  const memoizedEntries = useMemo(() => entries, [entries])

  return <KothLeaderboard entries={memoizedEntries} />
}
```

### 2. Lazy Load Avatars

```tsx
const LazyAvatar = ({ src, alt }) => <img src={src} alt={alt} loading="lazy" />
```

### 3. Virtual Scrolling for Long Lists

```tsx
import { FixedSizeList } from 'react-window'

;<FixedSizeList height={600} itemCount={entries.length} itemSize={80}>
  {({ index, style }) => (
    <div style={style}>
      <KothRankingEntry {...entries[index]} />
    </div>
  )}
</FixedSizeList>
```

---

## Troubleshooting

### Issue: Component not displaying

**Solution**:

- Check import path is correct
- Verify CSS variables are defined in root
- Check console for TypeScript errors

### Issue: Styles not applying

**Solution**:

- Ensure CSS modules are imported correctly
- Check CSS variable values are set
- Verify no conflicting global styles

### Issue: Dark mode not working

**Solution**:

- Add `@media (prefers-color-scheme: dark)` rules
- Check `prefers-color-scheme` is supported in browser
- Manually test with browser dev tools

### Issue: Responsive layout broken

**Solution**:

- Check viewport width matches breakpoint ranges
- Verify container width is not constrained
- Test at exactly: 375px, 600px, 900px, 1200px, 1800px

---

## API Reference Summary

### KothRankingScreen Props

```tsx
{
  playerScore: number          // Required
  playerRank: number           // Required
  playerName?: string          // Optional
  onNewGame: () => void        // Required
  onHome: () => void           // Required
  entries?: KothEntry[]        // Optional
  loading?: boolean            // Optional
}
```

### KothLeaderboard Props

```tsx
{
  entries: KothEntry[]          // Required
  currentPlayerId?: string      // Optional
  onSelectEntry?: (entry) => void  // Optional
}
```

### KothRankingEntry Props

```tsx
{
  rank: number                 // Required
  playerName: string           // Required
  playerScore: number          // Required
  isCurrentPlayer?: boolean    // Optional
  isKing?: boolean             // Optional
  avatar?: string              // Optional
}
```

---

## Next Steps

1. ✅ Copy one of the integration patterns above
2. ✅ Adapt to your game's data structure
3. ✅ Test with your game stats
4. ✅ Customize CSS variables for your brand
5. ✅ Add to your results/ranking screens
6. ✅ Collect user feedback

---

## Questions?

Refer to:

- **Full Docs**: `packages/ui-koth-system/README.md`
- **Implementation Details**: `packages/ui-koth-system/IMPLEMENTATION_SUMMARY.md`
- **Type Definitions**: `packages/ui-koth-system/src/types/`
- **Example Components**: Look at any game app using the component

---

**Ready to integrate? Pick your pattern above and get started!** 🚀
