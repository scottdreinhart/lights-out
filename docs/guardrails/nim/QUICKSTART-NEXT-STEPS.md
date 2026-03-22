# Ionic Components — Next Steps & Quick Actions

## What You Now Have

Your Nim project includes **5 production-ready Ionic components** ready to use immediately.

### Overview

```
IonicButton (atom)
  ├─ Touch-optimized, platform-aware
  ├─ 6 colors, 3 sizes, loading state
  └─ Ready to use everywhere

IonicModalContainer (molecule)
  ├─ IonModal wrapper with defaults
  ├─ Auto responsive (fullscreen/card)
  └─ Replace custom <dialog> with this

IonicAlertDialog (molecule)
  ├─ Replaces browser confirm()
  ├─ Platform-native appearance
  └─ ImperativeHandle for async confirm

useIonicToast (hook)
  ├─ Replaces custom toast system
  ├─ 5 methods: show/success/error/warning/info
  └─ Auto-dismiss with icons
```

## Import All From Single Location

```tsx
// Atoms
import { IonicButton } from '@/ui'

// Molecules
import { IonicModalContainer, IonicAlertDialog } from '@/ui'

// Hooks (from app)
import { useIonicToast } from '@/app'
```

## Quick Actions (Copy-Paste Ready)

### Action 1: Test IonicButton (2 minutes)

**File**: `src/ui/organisms/MainMenu.tsx` (or any component)

Add this button:

```tsx
import { IonicButton } from '@/ui'

export function MainMenu() {
  return (
    <div>
      {/* Existing content */}
      
      {/* Add this test button */}
      <IonicButton 
        color="primary" 
        onClick={() => console.log('Ionic button works!')}
      >
        Test Ionic Button
      </IonicButton>
    </div>
  )
}
```

**Test it**: Run `pnpm start`, click the button, check console.

### Action 2: Validate Build (1 minute)

```bash
cd /mnt/c/Users/scott/nim  # WSL bash
pnpm validate
```

Should show:
```
✓ lint
✓ format:check
✓ typecheck
✓ build
```

If all pass → components are ready.

### Action 3: Use IonicToast (2 minutes)

**File**: `src/ui/organisms/GameBoard.tsx` (or any game component)

Find any success handler, add toast:

```tsx
import { useIonicToast } from '@/app'

export function GameBoard() {
  const toast = useIonicToast()

  const handleGameWin = async () => {
    // Existing code
    await toast.success('You won! 🎉')
  }

  return (
    // Existing JSX
  )
}
```

### Action 4: Migrate SettingsOverlay (10 minutes)

**Current file**: `src/ui/organisms/SettingsOverlay.tsx`

**Step 1**: Replace import

```tsx
// Remove
import styles from './SettingsOverlay.module.css'

// Add
import { IonicModalContainer } from '@/ui'
import { useIonicToast } from '@/app'
```

**Step 2**: Replace component

**Before**:
```tsx
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
    <dialog ref={dialogRef} className={styles.dialog}>
      {/* ... lots of custom markup ... */}
    </dialog>
  )
}
```

**After**:
```tsx
export const SettingsOverlay: React.FC<SettingsOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const toast = useIonicToast()

  const handleSave = async () => {
    // Save logic
    await toast.success('Settings saved!')
    onClose()
  }

  return (
    <IonicModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      closeButtonText="Cancel"
      confirmButtonText="Save"
      onConfirm={handleSave}
    >
      {/* Put your settings content here, same as before */}
    </IonicModalContainer>
  )
}
```

**Step 3**: Remove old CSS

```bash
rm src/ui/organisms/SettingsOverlay.module.css
```

**Step 4**: Test and commit

```bash
pnpm start
# Test modal opens/closes/saves

git add .
git commit -m "refactor: migrate SettingsOverlay to IonicModalContainer"
```

### Action 5: Create a Test Component (5 minutes)

Create `src/ui/organisms/IonicShowcase.tsx`:

```tsx
import { useState } from 'react'
import { IonicButton, IonicModalContainer, IonicAlertDialog } from '@/ui'
import { useIonicToast } from '@/app'
import { useRef } from 'react'

/**
 * Showcase of all new Ionic components
 * Remove this file after testing
 */
export function IonicShowcase() {
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const alertRef = useRef<any>(null)
  const toast = useIonicToast()

  const handleLoadingClick = async () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  const handleAlert = async () => {
    const result = await alertRef.current?.present()
    if (result?.role === 'confirm') {
      await toast.success('You confirmed!')
    }
  }

  const handleToast = async () => {
    await toast.info('Info message')
    await new Promise(r => setTimeout(r, 1500))
    await toast.success('Success!')
    await new Promise(r => setTimeout(r, 1500))
    await toast.warning('Warning!')
    await new Promise(r => setTimeout(r, 1500))
    await toast.error('Error!')
  }

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h2>Ionic Components Showcase</h2>

      <IonicButton color="primary" onClick={() => setModalOpen(true)}>
        Open Modal
      </IonicButton>

      <IonicButton color="secondary" onClick={handleAlert}>
        Show Alert
      </IonicButton>

      <IonicButton color="success" onClick={handleToast}>
        Show Toasts
      </IonicButton>

      <IonicButton 
        color="danger" 
        loading={loading}
        onClick={handleLoadingClick}
      >
        Click for Loading
      </IonicButton>

      <IonicModalContainer
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Modal Example"
        closeButtonText="Close"
        confirmButtonText="OK"
        onConfirm={() => {
          setModalOpen(false)
        }}
      >
        <p>This is a modal using IonicModalContainer!</p>
      </IonicModalContainer>

      <IonicAlertDialog
        ref={alertRef}
        title="Confirm?"
        message="Do you want to proceed?"
        okText="Yes"
        cancelText="Cancel"
      />
    </div>
  )
}
```

**Test it**: Use this component in your app, test all buttons.

## Recommended Order of Actions

### Phase 1: Validation (Today)
```
1. Run pnpm validate
2. Read IONIC-COMPONENTS-USAGE-GUIDE.md
3. Add test IonicButton to one component
```

### Phase 2: First Migration (Today/Tomorrow)
```
1. Migrate SettingsOverlay to IonicModalContainer
2. Test on mobile (pnpm cap:sync)
3. Commit and celebrate 🎉
```

### Phase 3: More Migrations (This Week)
```
1. Replace confirm() dialogs with IonicAlertDialog
2. Replace custom toast with useIonicToast
3. Remove all custom modal/toast code
```

### Phase 4: Polish (Next Week)
```
1. Create more Ionic wrappers (IonList, IonPopover, etc.)
2. Comprehensive testing on all devices
3. Performance audit
```

## Terminal Commands (Copy-Paste)

### Verify Everything Works
```bash
cd /mnt/c/Users/scott/nim
pnpm validate
```

### Start Development Server
```bash
pnpm start
```

### Test on iOS
```bash
pnpm cap:sync
pnpm cap:run:ios
```

### Test on Android
```bash
pnpm cap:sync
pnpm cap:run:android
```

### Commit Changes
```bash
git add .
git commit -m "feat: add Ionic wrapper components"
```

## Key Files for Reference

| Purpose | File |
|---------|------|
| How to use components | IONIC-COMPONENTS-USAGE-GUIDE.md |
| Before/after migrations | MIGRATION-EXAMPLES.md |
| Complete inventory | IONIC-COMPONENTS-SUMMARY.md |
| Source code | src/ui/atoms/IonicButton* |
| | src/ui/molecules/IonicModal* |
| | src/ui/molecules/IonicAlert* |
| | src/app/hooks/useIonicToast.ts |

## Success Criteria

After completing Phase 1 & 2, you should have:

- ✅ `pnpm validate` passes
- ✅ IonicButton displays correctly
- ✅ SettingsOverlay migrated to IonicModalContainer
- ✅ Modal opens/closes on mobile and desktop
- ✅ One git commit with new components

## Troubleshooting

### Components not importing?
```bash
# Make sure TypeScript sees the changes
pnpm typecheck
```

### Styles not applying?
- Verify CSS Module is imported: `import styles from './Component.module.css'`
- Check theme color variables are defined
- Look at browser DevTools → Styles tab

### iOS/Android looks wrong?
- Clear cache: `pnpm cap:sync`
- Rebuild: `pnpm cap:run:ios` (or Android)
- Check useIonicPlatform() is returning correct platform

### Build fails?
- Run: `pnpm lint:fix`
- Check TypeScript: `pnpm typecheck`
- Clear cache: `pnpm clean && pnpm install`

---

## Ready to Go! 🚀

You have **everything you need to start using Ionic components today**.

**Recommended first step**: Run `pnpm validate` to confirm build passes.

Then pick one of the Quick Actions and start integrating!

Questions? Check the usage guides or component source files for JSDoc comments.
