# Hook Patterns & Architecture Governance

**Authority**: This document is subordinate to `AGENTS.md`. Defines React hook patterns and best practices across all projects.

---

## 1. Hook Classification & Purposes

All hooks fall into one of five categories. Each category has distinct responsibilities and import scopes.

### Category 1: State Management Hooks

**Purpose**: Centralize complex state logic, decouple from components.

**Examples**:
- `useGame()` — Game state, moves, difficulty, opponent
- `useStats()` — Win/loss/streak tracking
- `useResponsiveState()` — Responsive breakpoints and device info

**Location**: `src/app/hooks/`

**Characteristics**:
- ✅ Return mutable state and callbacks
- ✅ Integrate with `@/infrastructure/storage` for persistence
- ✅ Handle side effects (API calls, timers)
- ✅ May dispatch to Web Workers
- ✅ Usually 50-200 lines

**Pattern**:
```tsx
export function useGame(initialCounts: number[] = DEFAULT_COUNTS) {
  // Load from storage on init
  const [state, setState] = useState<GameState>(() => 
    load('nim-game', createInitialBoard(...))
  )
  
  // Persist on change
  const updateState = useCallback((newState: GameState) => {
    setState(newState)
    save('nim-game', newState)
  }, [])
  
  return { state, updateState, ... }
}
```

**Anti-Pattern**: Don't initialize state from complex computations or network calls synchronously.

---

### Category 2: Utility/Helper Hooks

**Purpose**: Encapsulate reusable, stateless logic patterns.

**Examples**:
- `useDebounce()` — Delay value updates
- `useToggle()` — Boolean state toggle
- `useLocalStorage()` — Generic persistence wrapper
- `useDarkMode()` — Theme convenience API

**Location**: `src/app/hooks/`

**Characteristics**:
- ✅ No shared state across instances
- ✅ Light and composable (typically <50 lines)
- ✅ Reusable across many components
- ✅ Easy to test in isolation
- ✅ No side effects except React internals

**Pattern**:
```tsx
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delayMs)
    return () => clearTimeout(handler)
  }, [value, delayMs])
  
  return debouncedValue
}
```

**Rule**: Utility hooks should be pure (deterministic output for given inputs).

---

### Category 3: Platform/Infrastructure Hooks

**Purpose**: Abstract platform-specific capabilities (Capacitor, Electron, Web).

**Examples**:
- `useOnlineStatus()` — Network connectivity
- `useServiceLoader()` — Platform API initialization
- `usePerformanceMetrics()` — Performance monitoring
- `useDeviceInfo()` — Device capabilities

**Location**: `src/app/hooks/`

**Characteristics**:
- ✅ Handle platform differences transparently
- ✅ Graceful fallbacks for unavailable features
- ✅ May use `@/infrastructure/platform` contracts
- ✅ Safe to call on all platforms (Web, Electron, Capacitor)

**Pattern**:
```tsx
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(navigator.onLine)
  
  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  return online
}
```

---

### Category 4: Context Provider Hooks

**Purpose**: Consume values from Context providers, with guaranteed availability.

**Examples**:
- `useThemeContext()` — Access theme settings
- `useSoundContext()` — Access sound state
- `useI18nContext()` — Access translation functions

**Location**: `src/app/context/` (usually paired with Context component)

**Characteristics**:
- ✅ Call `useContext()` internally
- ✅ Throw error if used outside provider
- ✅ Never create circular imports
- ✅ Minimal logic (usually <20 lines)

**Pattern**:
```tsx
const ThemeContext = createContext<UseThemeReturn | null>(null)

export function useThemeContext(): UseThemeReturn {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useThemeContext must be used within <ThemeProvider>')
  }
  return ctx
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useTheme()  // Pull from actual hook
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
```

---

### Category 5: Gesture/Input Hooks

**Purpose**: Normalize touch, keyboard, and pointer interactions across platforms.

**Examples**:
- `useSwipeGesture()` — Velocity-based swipe detection
- `useLongPress()` — Long-press detection (touch + mouse)
- `useKeyboardControls()` — Keyboard input mapping
- `useDropdownBehavior()` — Focus/close logic for dropdowns

**Location**: `src/app/hooks/`

**Characteristics**:
- ✅ Semantic action dispatch (not raw events)
- ✅ Multi-platform (touch + mouse + keyboard)
- ✅ Respect accessibility requirements (focus, aria)
- ✅ Handle platform differences transparently

**Pattern**:
```tsx
export function useSwipeGesture(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  thresholdPx: number = 50,
) {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
  }
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStart.x
    
    if (Math.abs(deltaX) > thresholdPx) {
      if (deltaX > 0) onSwipeRight?.()
      else onSwipeLeft?.()
    }
  }
  
  return { onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd }
}
```

---

## 2. Hook Naming Conventions (Mandatory)

| Pattern | Use Case | Example |
|---------|----------|---------|
| `use[Feature]()` | State management, configuration | `useGame()`, `useStats()`, `useTheme()` |
| `use[Action]()` | Utility/behavior hooks | `useDebounce()`, `useToggle()`, `useLongPress()` |
| `use[Feature]Context()` | Consume Context (explicit provider dependency) | `useThemeContext()`, `useSoundContext()` |
| `use[Feature]Service()` | Deprecated pattern — avoid | ❌ Use services directly or wrap in `useXxx()` |
| `use[Gesture]Gesture()` | Input/gesture hooks | `useSwipeGesture()`, `useLongPress()` |
| `use[Source]()` | Data source hooks (API, storage) | `useLocalStorage()`, `useAsync()` |

**Hard Rules**:
- ✅ All hooks start with `use`
- ✅ Follow `[Action]` or `[Feature]` convention
- ✅ Names should be **descriptive** about what they do
- ❌ Never use generic names like `useData()` or `useHelper()`
- ❌ Never use `useFetch*` if you mean `useAsync*` (reserve `use*Fetch` for HTTP-specific)

---

## 3. Hook Design Patterns

### Pattern A: Persistent State (with Storage)

Use when state should survive app reload.

```tsx
export function useUserPreferences() {
  const [prefs, setPrefs] = useState<Preferences>(() => 
    load('user-prefs', DEFAULT_PREFS)
  )
  
  const updatePrefs = useCallback((next: Preferences) => {
    setPrefs(next)
    save('user-prefs', next)
  }, [])
  
  return { prefs, updatePrefs }
}
```

**Checklist**:
- [ ] Load from storage in initializer
- [ ] Save after every mutation
- [ ] Provide update function (not setter)
- [ ] Handle storage errors gracefully

---

### Pattern B: Debounced Values

Use when you want to delay updates to prevent excessive re-renders.

```tsx
const searchTerm = useDebounce(inputValue, 500)

useEffect(() => {
  performSearch(searchTerm)  // Only runs when searchTerm changes
}, [searchTerm])
```

**Checklist**:
- [ ] Return debounced value (not callback)
- [ ] Allow custom delay
- [ ] Clean up timer on unmount

---

### Pattern C: Gesture Recognition

Use for touch/mouse/keyboard interactions.

```tsx
export function useSwipeGesture(onSwipe: (direction: 'left' | 'right') => void) {
  const [startX, setStartX] = useState(0)
  
  return {
    onTouchStart: (e) => setStartX(e.touches[0].clientX),
    onTouchEnd: (e) => {
      const delta = e.changedTouches[0].clientX - startX
      if (Math.abs(delta) > THRESHOLD) {
        onSwipe(delta > 0 ? 'right' : 'left')
      }
    },
  }
}
```

**Checklist**:
- [ ] Handle touch AND mouse
- [ ] Calculate velocity/delta correctly
- [ ] Allow customizable thresholds
- [ ] Prevent accidental triggers on scroll

---

### Pattern D: Conditional/Responsive

Use when behavior depends on viewport size or device capability.

```tsx
export function useResponsiveState() {
  const [width, setWidth] = useState(window.innerWidth)
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return {
    isMobile: width < 600,
    isDesktop: width >= 900,
    width,
  }
}
```

**Checklist**:
- [ ] Use semantic categories (not raw pixels)
- [ ] Cache computed values in render
- [ ] Handle window resize efficiently
- [ ] SSR-safe (check `typeof window`)

---

## 4. Storage Integration Patterns

### Recommended: Direct Infrastructure API

The project has two layers: `@/infrastructure/storage` and `@/app/services`.

**For NEW state:** Use `@/infrastructure/storage` directly in hooks:

```tsx
import { load, save } from '@/infrastructure/storage'

const [data, setData] = useState<Data>(() => load('my-key', INITIAL))

const updateData = useCallback((next: Data) => {
  setData(next)
  save('my-key', next)
}, [])
```

**Wrap in `useLocalStorage` for reusability:**

```tsx
const [data, setData, clearData] = useLocalStorage('my-key', INITIAL)
```

---

## 5. Performance Checklist

**Before finalizing any hook:**

- [ ] No infinite loops (verify dependency arrays)
- [ ] No memory leaks (cleanup functions in useEffect)
- [ ] Callback memoization (`useCallback`) appropriate
- [ ] No expensive computations in renders
- [ ] Tested with DevTools Profiler
- [ ] Under 150 lines (consider splitting if larger)

---

## 6. Testing Strategy

### Unit Test Pattern

```tsx
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  it('should delay value updates', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 'initial' } }
    )
    
    expect(result.current).toBe('initial')
    
    rerender({ value: 'updated' })
    expect(result.current).toBe('initial')  // Still debounced
    
    await act(async () => {
      await new Promise(r => setTimeout(r, 150))
    })
    expect(result.current).toBe('updated')
  })
})
```

---

## 7. Common Anti-Patterns

| Pattern | Why It's Bad | Fix |
|---------|-------------|-----|
| **Hook calls outside React** | React hooks are tied to component lifecycle | Call only inside React components |
| **Conditional hook calls** | Breaks Rules of Hooks (fixed call count) | Always call unconditionally |
| **Circular dependencies** (hook A → hook B → hook A) | Infinite loops, hard to debug | Flatten or use shared state |
| **Creating the same hook multiple times** | Duplicate state, listener spam | Create once, share output |
| **Raw `localStorage` calls** | No type safety, no fallback | Use `load()` / `save()` from `@/infrastructure` |
| **Mismatch between local state and storage** | Data inconsistency, stale reads | Always keep sync via callbacks |
| **No error boundaries around Context hooks** | App crashes if context unavailable | Use `useContext()` with error check, throw if null |

---

## 8. Hook Integration Checklist

**When adding a new hook to the codebase:**

- [ ] File created in `src/app/hooks/[hookName].ts`
- [ ] Export added to `src/app/hooks/index.ts` barrel
- [ ] JSDoc comment with usage example
- [ ] Type signatures fully specified (no `any`)
- [ ] Dependency array verified (ESLint rules pass)
- [ ] Memory leaks prevented (cleanup functions)
- [ ] Error handling graceful (no runtime exceptions)
- [ ] Works on all platforms (Web, Electron, Capacitor)
- [ ] Unit tests created (if business logic)
- [ ] AGENTS.md updated (if adding new pattern)

---

## 9. Governance Summary

**Hooks are the primary abstraction for:**
1. **State management** (`useGame`, `useStats`, `useTheme`)
2. **Reusable logic** (`useDebounce`, `useToggle`, `useLocalStorage`)
3. **Platform capabilities** (`useOnlineStatus`, `useServiceLoader`)
4. **Context access** (`useThemeContext`, `useSoundContext`)
5. **Gesture/input** (`useSwipeGesture`, `useLongPress`)

**Every hook must be:**
- ✅ Typed (full TypeScript coverage)
- ✅ Documented (JSDoc + example)
- ✅ Exported from barrel
- ✅ Tested (unit tests for logic)
- ✅ Composable (reusable across projects)

---

**Reference**: AGENTS.md § 10 (SOLID Principles), § 21 (Hook Naming), § 27 (Mobile Gestures)
