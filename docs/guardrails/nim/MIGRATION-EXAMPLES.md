# Ionic Components — Migration Examples

This guide shows step-by-step examples of migrating existing custom components to use Ionic wrappers.

## Example 1: SettingsOverlay → Ionic Implementation

### Current Implementation (Custom Modal)

**File**: `src/ui/organisms/SettingsOverlay.tsx`

```tsx
import { useRef, useEffect } from 'react'
import styles from './SettingsOverlay.module.css'

export interface SettingsOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export const SettingsOverlay: React.FC<SettingsOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [isOpen])

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClick={(e) => {
      if ((e.target as HTMLElement).tagName === 'DIALOG') {
        onClose()
      }
    }}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Settings</h1>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Game Settings</h2>
            {/* Settings content */}
          </section>
        </div>

        <div className={styles.footer}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={onClose}>OK</button>
        </div>
      </div>
    </dialog>
  )
}
```

### Migrated Implementation (Using IonicModalContainer)

```tsx
import { IonicModalContainer } from '@/ui'
import { useIonicToast } from '@/app'

export interface SettingsOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export const SettingsOverlay: React.FC<SettingsOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const toast = useIonicToast()

  const handleConfirm = async () => {
    // Save settings here
    await toast.success('Settings saved!')
    onClose()
  }

  return (
    <IonicModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      closeButtonText="Cancel"
      confirmButtonText="OK"
      onConfirm={handleConfirm}
    >
      <section className={styles.section}>
        <h2>Game Settings</h2>
        {/* Settings content remains the same */}
      </section>
    </IonicModalContainer>
  )
}
```

### What Changed

| Aspect | Before | After |
|--------|--------|-------|
| **Container** | `<dialog>` element | `<IonicModalContainer>` component |
| **State Management** | `useRef` + `useEffect` | `isOpen` prop only |
| **Close Button** | Manual implementation | Built-in via `closeButtonText` |
| **Footer Buttons** | Custom flex layout | Template-based |
| **Notifications** | None | `useIonicToast()` integration |
| **Platform Support** | Desktop only | Mobile-optimized (iOS/Android modal) |
| **Lines of Code** | ~60 | ~25 |

### Migration Checklist

- [ ] Replace `<dialog>` with `<IonicModalContainer>`
- [ ] Remove `useRef` and `useEffect` for modal state
- [ ] Move close button text to `closeButtonText` prop
- [ ] Move confirm button text to `confirmButtonText` prop
- [ ] Add `onConfirm` handler with save logic
- [ ] Keep content inside component children
- [ ] Remove custom modal styling (CSS vars handle it)
- [ ] Test on mobile/desktop
- [ ] Commit: "refactor: migrate SettingsOverlay to IonicModalContainer"

---

## Example 2: Custom Delete Confirmation → IonicAlertDialog

### Current Implementation (Browser Confirm)

**In a component**:

```tsx
export function ItemCard({ item, onDelete }: ItemCardProps) {
  const handleDelete = () => {
    if (confirm(`Delete "${item.name}"?`)) {
      onDelete(item.id)
    }
  }

  return (
    <div>
      <h3>{item.name}</h3>
      <button onClick={handleDelete}>Delete</button>
    </div>
  )
}
```

**Problems with this approach:**
- ❌ No custom styling (uses browser native)
- ❌ Not themed (doesn't match app colors)
- ❌ No platform-specific appearance (Android vs iOS)
- ❌ No toast feedback after deletion
- ❌ Not accessible (no ARIA)

### Migrated Implementation (Using IonicAlertDialog)

```tsx
import { IonicAlertDialog } from '@/ui'
import { useIonicToast } from '@/app'
import { useRef } from 'react'

export function ItemCard({ item, onDelete }: ItemCardProps) {
  const alertRef = useRef<any>(null)
  const toast = useIonicToast()

  const handleDelete = async () => {
    const confirmed = await alertRef.current?.present()
    if (confirmed?.role === 'confirm') {
      try {
        onDelete(item.id)
        await toast.success('Item deleted')
      } catch (error) {
        await toast.error('Failed to delete item')
      }
    }
  }

  return (
    <div>
      <h3>{item.name}</h3>
      <button onClick={handleDelete}>Delete</button>

      <IonicAlertDialog
        ref={alertRef}
        title="Delete Item?"
        message={`Are you sure you want to delete "${item.name}"? This cannot be undone.`}
        okText="Delete"
        okColor="danger"
        cancelText="Cancel"
      />
    </div>
  )
}
```

### What Changed

| Aspect | Before | After |
|--------|--------|-------|
| **API** | `confirm()` (browser-only) | `IonicAlertDialog` (themed, mobile-optimized) |
| **Styling** | None (platform native) | Matches app theme |
| **Platform** | No customization | Native iOS/Android appearance |
| **Feedback** | No confirmation | Toast notification |
| **Accessibility** | Basic | Full WCAG compliance |
| **Error Handling** | None | Try/catch with error toast |

### Migration Steps

1. **Add ref to AlertDialog**
   ```tsx
   const alertRef = useRef<any>(null)
   ```

2. **Update click handler to async**
   ```tsx
   const handleDelete = async () => {
     const confirmed = await alertRef.current?.present()
     if (confirmed?.role === 'confirm') {
       // Handle delete
     }
   }
   ```

3. **Add toast for feedback**
   ```tsx
   const toast = useIonicToast()
   await toast.success('Item deleted')
   ```

4. **Render IonicAlertDialog**
   ```tsx
   <IonicAlertDialog
     ref={alertRef}
     title="Delete Item?"
     message="Are you sure?"
     okText="Delete"
     okColor="danger"
     cancelText="Cancel"
   />
   ```

---

## Example 3: Custom Toast Notification System → useIonicToast

### Current Implementation (Custom Toast)

**Custom Hook** (`src/app/hooks/useToast.ts`):

```tsx
import { useState, useCallback } from 'react'

interface Toast {
  id: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const add = useCallback((message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info', duration = 3000) => {
    const id = Date.now().toString()
    const toast: Toast = { id, message, type, duration }

    setToasts((prev) => [...prev, toast])

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }

    return id
  }, [])

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, add, remove }
}
```

**Custom Toast Component** (`src/ui/molecules/Toast.tsx`):

```tsx
import styles from './Toast.module.css'

interface ToastProps {
  id: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
  onDismiss: (id: string) => void
}

export function Toast({ id, message, type, onDismiss }: ToastProps) {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {message}
      <button onClick={() => onDismiss(id)}>×</button>
    </div>
  )
}
```

**Usage** (scattered across components):

```tsx
const { toasts, add, remove } = useToast()

// Somewhere in component
const saveFile = async () => {
  try {
    await saveToDisk(file)
    add('File saved successfully', 'success')
  } catch (err) {
    add('Failed to save file', 'error')
  }
}

// In JSX
{toasts.map((t) => (
  <Toast key={t.id} {...t} onDismiss={remove} />
))}
```

**Problems:**
- ❌ 150+ lines of custom code
- ❌ Manual state management
- ❌ Doesn't use Ionic's native toasts
- ❌ No platform-specific animations
- ❌ Hard to test
- ❌ Not themed

### Migrated Implementation (Using useIonicToast)

**All you need:**

```tsx
import { useIonicToast } from '@/app'

export function MyComponent() {
  const toast = useIonicToast()

  const saveFile = async () => {
    try {
      await saveToDisk(file)
      await toast.success('File saved successfully')
    } catch (err) {
      await toast.error('Failed to save file')
    }
  }

  return (
    <button onClick={saveFile}>Save</button>
  )
}
```

### Migration Plan

1. **Stop using custom `useToast`**
   - Find all imports: `grep -r "useToast" src/`
   - Replace with `useIonicToast`

2. **Update calls**
   ```tsx
   // Before
   const { add } = useToast()
   add('Success!', 'success')

   // After
   const toast = useIonicToast()
   await toast.success('Success!')
   ```

3. **Update error handling**
   ```tsx
   // Before
   add('Error!', 'error')

   // After
   await toast.error('Error!')
   ```

4. **Remove custom files**
   ```bash
   rm src/app/hooks/useToast.ts
   rm src/ui/molecules/Toast.tsx
   rm src/ui/molecules/Toast.module.css
   ```

5. **Test on iOS/Android**

### Code Saved

- **Removed**: ~150 lines of custom code
- **Using**: Built-in Ionic toasts (optimized, themed, tested)
- **Benefit**: Platform-specific animations (slide-in on iOS, fade on Android)

---

## Example 4: Custom Buttons → IonicButton

### Current Implementation (Scattered Button Styles)

```tsx
// src/ui/atoms/Button.tsx
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'medium',
  loading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} />
      ) : (
        children
      )}
    </button>
  )
}
```

**CSS** (`src/ui/atoms/Button.module.css`):

```css
.button {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 200ms ease;
}

.small { padding: 6px 12px; font-size: 0.875rem; }
.large { padding: 14px 24px; font-size: 1.125rem; min-height: 48px; }

.primary { background: var(--color-primary); color: white; }
.secondary { background: var(--color-secondary); color: white; }
.danger { background: var(--color-danger); color: white; }

.button:hover { opacity: 0.8; }
.button:active { transform: scale(0.98); }
.button:disabled { opacity: 0.5; cursor: not-allowed; }

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Migrated to IonicButton

```tsx
// Simply use Ionic's button
import { IonicButton } from '@/ui'

// Everywhere you had <Button variant="primary">
// Replace with:
<IonicButton color="primary">
  Click me
</IonicButton>

// Everywhere you had <Button size="large">
// Replace with:
<IonicButton size="large">
  Large Button
</IonicButton>

// Everywhere you had loading state:
<IonicButton loading={isLoading}>
  Save
</IonicButton>
```

### Why Migrate

| Aspect | Custom Button | IonicButton |
|--------|---------------|------------|
| **Lines of code** | 60 (component + CSS) | Pre-built |
| **Touch support** | Manual | Automatic (44px min) |
| **Loading spinner** | Manual CSS | `IonSpinner` |
| **Platform-aware** | No | Yes (iOS/Android) |
| **Theming** | CSS variables | Ionic CSS variables |
| **Testing** | Custom setup | Tested library |
| **Accessibility** | Manual | Built-in WCAG compliance |

---

## Migration Checklist

Use this for any component you want to migrate:

### Modal-Like Components
- [ ] Identify custom `<dialog>` or modal-like component
- [ ] Replace with `<IonicModalContainer>`
- [ ] Test on mobile (should appear fullscreen)
- [ ] Test on desktop (should appear as card)
- [ ] Add toast notifications for success/error
- [ ] Ensure theme colors apply

### Confirmation Dialogs
- [ ] Replace `confirm()` or custom dialog with `<IonicAlertDialog>`
- [ ] Add ref: `const alertRef = useRef<any>(null)`
- [ ] Convert handler to async
- [ ] Check result: `confirmed?.role === 'confirm'`
- [ ] Add toast for feedback
- [ ] Test OK and Cancel buttons

### Toast Notifications
- [ ] Replace custom `useToast` hook with `useIonicToast`
- [ ] Update all `add()` calls to `toast.success()` or `toast.error()`
- [ ] Remove custom Toast component and CSS
- [ ] Test all notification types

### Buttons
- [ ] Replace custom Button component with `<IonicButton>`
- [ ] Update props: `variant` → `color`, `size` → `size`
- [ ] Remove custom Button component
- [ ] Remove custom Button CSS
- [ ] Verify touch targets are ≥44px

---

## Testing After Migration

### Manual Testing
```bash
# Test on web
pnpm start

# Test on mobile
pnpm cap:sync && pnpm cap:run:ios
pnpm cap:sync && pnpm cap:run:android
```

### Automated Testing
```tsx
import { render, screen } from '@testing-library/react'
import { IonicModalContainer } from '@/ui'

test('IonicModalContainer opens and closes', () => {
  const { rerender } = render(
    <IonicModalContainer isOpen={false} onClose={jest.fn()}>
      Content
    </IonicModalContainer>
  )

  rerender(
    <IonicModalContainer isOpen={true} onClose={jest.fn()}>
      Content
    </IonicModalContainer>
  )

  expect(screen.getByText('Content')).toBeInTheDocument()
})
```

---

## Rolling Back (If Needed)

If you need to revert:

```bash
# Undo file changes
git checkout src/ui/organisms/SettingsOverlay.tsx

# Or revert entire commit
git revert <commit-hash>
```

---

## Performance Impact

All migrations should show **improvements**:

- ✅ Smaller bundle (Ionic optimized)
- ✅ Faster rendering (fewer components)
- ✅ Better mobile performance (native touch handling)
- ✅ Less custom JavaScript (Ionic handles it)

Measure with:
```bash
# Before migration
pnpm build && du -sh dist/

# After migration
pnpm build && du -sh dist/
```

---

## Recommended Migration Order

1. **Start with dialogs** (highest impact)
   - SettingsOverlay → IonicModalContainer
   - Any other custom modals

2. **Then confirmations** (quick wins)
   - Delete dialogs → IonicAlertDialog
   - Save/cancel dialogs → IonicAlertDialog

3. **Then notifications** (big cleanup)
   - Custom toast → useIonicToast
   - Remove custom Toast component

4. **Finally buttons** (polish)
   - Custom Button → IonicButton
   - Remove custom Button component

Each stage should be a small, committed PR for easy review.
