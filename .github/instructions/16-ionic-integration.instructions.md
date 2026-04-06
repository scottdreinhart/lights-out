# Ionic React Integration Guide

> **Authority**: Subordinate to `AGENTS.md` § 0 (Non-Negotiable Rules).
> **BASELINE**: Before using Ionic components, read `AGENTS.md` § 0. Preserve cross-platform behavior. Minimal component customization. Quality gates mandatory.

## Overview

This project integrates **Ionic React** to provide a uniform cross-platform UI layer across:

- **Web browsers** (responsive design, 5 device tiers)
- **Electron desktop** (Windows, Linux, macOS)
- **Capacitor mobile** (iOS, Android native apps)

Ionic provides:
- Cross-platform UI components (modals, alerts, toasts, popovers)
- Platform detection (iOS, Android, web, Electron)
- Gesture handling (swipe, long-press, drag)
- Hardware integration (back button, keyboard events)
- Responsive scaling across device sizes
- Touch-safe interaction patterns

## Architecture

### Integration Points

```
src/index.tsx (entry point)
  ├─ Imports Ionic CSS
  ├─ Calls setupIonicReact()
  └─ Renders ShellApp

src/ui/organisms/AppWithProviders.tsx (provider wrapper)
  └─ Wraps app with IonApp
     └─ All Ionic components must be inside IonApp

src/app/useIonicPlatform.ts (platform detection)
  └─ Provides platform info (iOS, Android, web, Electron)
```

### Layer Responsibilities

| Layer | Responsibility |
|-------|-----------------|
| **Domain** (`@/domain/`) | Framework-agnostic game logic (unchanged) |
| **App** (`@/app/`) | React hooks, context providers, Ionic platform detection |
| **UI** (`@/ui/`) | Ionic components, responsive layout, theme integration |
| **Electron** (`electron/`) | Main/preload processes (unchanged, no Ionic) |
| **Workers** (`src/workers/`) | Web workers, no Ionic dependency |
| **WASM** (`src/wasm/`) | AssemblyScript AI (unchanged, no Ionic) |

### Rules

1. **Ionic only in `src/ui/` and `src/app/`** — Never import Ionic in domain, workers, or Electron main/preload
2. **Always inside `IonApp`** — Ionic components fail outside IonApp wrapper
3. **No breaking of existing CSS** — Ionic CSS imports alongside existing `styles.css`
4. **Platform-aware UI** — Use `useIonicPlatform()` for OS-specific behavior
5. **Responsive first** — Use existing `useResponsiveState()` for viewport-based layout (5 tiers)
6. **Preserve ErrorBoundary** — Keep React error boundaries in place

## Usage Examples

### 1. Platform Detection

```tsx
import { useIonicPlatform } from '@/app'

function MyComponent() {
  const platform = useIonicPlatform()

  if (platform.isIOS) {
    // iOS-specific UI (e.g., safe area handling)
  } else if (platform.isAndroid) {
    // Android-specific UI (e.g., back button behavior)
  } else if (platform.isElectron) {
    // Electron-specific UI (e.g., window controls)
  } else if (platform.isWeb) {
    // Web browser UI
  }

  return <div>{/* Platform-aware UI */}</div>
}
```

### 2. Using Ionic Modal (Instead of Native `<dialog>`)

**Before (native dialog):**
```tsx
import { useRef } from 'react'

function SettingsModal({ open, onClose }) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [open])

  return <dialog ref={dialogRef}>...</dialog>
}
```

**After (Ionic modal):**
```tsx
import { IonModal, IonHeader, IonContent, IonToolbar, IonTitle } from '@ionic/react'

function SettingsModal({ open, onClose }) {
  return (
    <IonModal isOpen={open} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Settings content */}
      </IonContent>
    </IonModal>
  )
}
```

**Benefits:**
- Works consistently on web, Electron, iOS, and Android
- Handles keyboard navigation automatically
- Back button support on mobile
- Safe area awareness on notched devices
- Gesture support (swipe to close on iOS)

### 3. Using Ionic Alert (Instead of `confirm()`)

**Before (browser confirm):**
```tsx
function handleDelete() {
  if (confirm('Delete this item?')) {
    // Proceed with deletion
  }
}
```

**After (Ionic alert):**
```tsx
import { useRef } from 'react'
import { IonAlert } from '@ionic/react'

function handleDelete() {
  alertRef.current?.present()
}

// In JSX:
<IonAlert
  ref={alertRef}
  header="Delete Item"
  message="Are you sure?"
  buttons={[
    { text: 'Cancel', role: 'cancel' },
    { text: 'Delete', role: 'destructive', handler: () => { /* delete */ } },
  ]}
/>
```

**Benefits:**
- Platform-native appearance (iOS vs Android)
- Keyboard accessible
- Mobile-optimized button layout
- Consistent across all platforms

### 4. Using Ionic Toast (Notifications)

**Instead of custom toasts, use Ionic Toast:**
```tsx
import { useRef } from 'react'
import { IonToast } from '@ionic/react'

function MyComponent() {
  const toastRef = useRef<any>(null)

  const showSuccess = () => {
    toastRef.current?.present()
  }

  return (
    <>
      <button onClick={showSuccess}>Show message</button>
      <IonToast
        ref={toastRef}
        message="Operation successful!"
        duration={2000}
        position="bottom"
      />
    </>
  )
}
```

### 5. Responsive Layout Using Ionic Grid

Combine Ionic's grid with existing responsive state:

```tsx
import { IonGrid, IonRow, IonCol } from '@ionic/react'
import { useResponsiveState } from '@/app'
import styles from './MyLayout.module.css'

function MyLayout() {
  const responsive = useResponsiveState()

  return (
    <IonGrid>
      <IonRow>
        <IonCol
          size="12"
          sizeMd={responsive.isDesktop ? '6' : '12'}
          className={styles.column}
        >
          Left panel
        </IonCol>
        <IonCol
          size="12"
          sizeMd={responsive.isDesktop ? '6' : '12'}
          className={styles.column}
        >
          Right panel
        </IonCol>
      </IonRow>
    </IonGrid>
  )
}
```

### 6. Touch-Safe Button (Platform-Aware Sizing)

```tsx
import { IonButton } from '@ionic/react'
import { useIonicPlatform } from '@/app'
import styles from './Button.module.css'

function TouchableButton() {
  const platform = useIonicPlatform()

  return (
    <IonButton
      // On mobile/tablet: larger button for touch
      // On desktop: normal-sized button
      size={platform.isMobileDevice ? 'large' : 'default'}
      className={styles.button}
    >
      Tap me
    </IonButton>
  )
}
```

## Available Ionic Components

Commonly used components in this project:

| Component | Purpose | Use Case |
|-----------|---------|----------|
| `IonApp` | Root wrapper (REQUIRED) | Must wrap entire app |
| `IonModal` | Full-screen or centered modal | Settings, dialogs, overlays |
| `IonAlert` | Confirmation dialogs | Delete confirmations, warnings |
| `IonToast` | Temporary message notification | Status updates, errors |
| `IonPopover` | Context menu or popover | Quick actions, tooltips |
| `IonButton` | Touch-optimized button | All interactive buttons |
| `IonHeader` | Top bar (sticky) | Navigation, titles |
| `IonContent` | Main scrollable area | App body, full-height layout |
| `IonToolbar` | Row within header/footer | Navigation bar |
| `IonGrid` | Responsive grid layout | Multi-column layouts |
| `IonRow` | Grid row | Used with IonGrid |
| `IonCol` | Grid column | Used with IonRow |
| `IonList` | Scrollable list | Long item lists |
| `IonItem` | List item | Used with IonList |
| `IonBackButton` | Hardware back button handler | Mobile navigation |
| `IonMenu` | Side drawer menu | Navigation drawer |
| `IonTabs` | Tab navigation | Multi-page apps |

## Platform-Specific Behaviors

### iOS (Capacitor)
- Safe area awareness (notches, dynamic island)
- Swipe-to-go-back gesture (automatically handled)
- Native status bar integration
- Status bar color customization

### Android (Capacitor)
- Hardware back button support (automatic)
- System navbar integration
- Material design components

### Electron (Desktop)
- Window frame controls
- System menu integration (optional)
- Alt key navigation

### Web Browser
- Standard responsive design (5 tiers: 375/600/900/1200/1800px)
- Hover interactions
- Keyboard shortcuts

## Styling Ionic Components

### Using CSS Modules

```css
/* MyComponent.module.css */
.button {
  --ion-color-primary: var(--color-primary);
  --ion-color-danger: var(--color-danger);
}

.modal {
  --width: 90vw;
  --max-width: 600px;
}
```

### Using CSS Variables

Ionic exposes CSS variables for theming:

```css
--ion-color-primary: #0066cc;
--ion-color-secondary: #00cc66;
--ion-color-danger: #ff0000;
--ion-padding: 1rem;
--ion-border-radius: 8px;
--ion-safe-area-top: 0px; /* Safe area on notched devices */
```

### Combining with Existing Theme System

Ionic CSS works alongside the existing theme system (`src/themes/`):

```tsx
import { useThemeContext } from '@/app/context/ThemeContext'
import styles from './MyComponent.module.css'

function MyComponent() {
  const { settings } = useThemeContext()

  return (
    <div
      className={styles.container}
      style={{
        '--color-primary': settings.colorPrimary,
        '--color-bg': settings.bgColor,
      } as React.CSSProperties}
    >
      Content
    </div>
  )
}
```

## Testing Ionic Components

### Vitest Unit Tests

```tsx
import { render, screen } from '@testing-library/react'
import { IonApp } from '@ionic/react'
import MyComponent from './MyComponent'

test('renders Ionic button', () => {
  render(
    <IonApp>
      <MyComponent />
    </IonApp>,
  )
  expect(screen.getByRole('button')).toBeInTheDocument()
})
```

**Important:** Always wrap test components with `<IonApp>`.

### Playwright E2E Tests

```typescript
// playwright.config.ts already configured for all 15 device profiles
test('modal opens on mobile', async ({ page, isMobile }) => {
  if (!isMobile) return // Skip on desktop
  
  await page.click('button:has-text("Settings")')
  const modal = await page.locator('ion-modal')
  await expect(modal).toBeVisible()
})
```

## Migration Path: Replace Custom Components with Ionic

If you've built custom UI components, consider migrating to Ionic equivalents:

| Custom UI | Ionic Replacement | Migration Path |
|-----------|-------------------|-----------------|
| Custom Modal | `<IonModal>` | Update component, remove custom CSS |
| Custom Dialog | `<IonAlert>` | Update confirm handlers |
| Custom Toast | `<IonToast>` | Update notification triggers |
| Custom Menu | `<IonMenu>` or Hamburger + `<IonModal>` | Add Ionic component |
| Custom Button | `<IonButton>` | Update props, remove custom hover effects |
| Custom List | `<IonList>` + `<IonItem>` | Use Ionic structure |

## Troubleshooting

### Issue: Ionic Components Not Showing

**Check:** Is the parent wrapped in `<IonApp>`?
```tsx
// ✅ CORRECT
<IonApp>
  <MyComponent />
</IonApp>

// ❌ WRONG
<MyComponent /> // IonApp wrapper missing
```

### Issue: Platform Detection Returns Web

**Check:** Is the app running in the correct environment?
- Capacitor iOS/Android: Should return `isIOS` or `isAndroid`
- Electron: Run with `pnpm electron:dev` (not just `pnpm dev`)
- Web: Returns `isWeb = true`

### Issue: Styles Not Applying

**Check:** Ionic CSS imported in `src/index.tsx`?
```tsx
import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
// ... other Ionic CSS imports
```

### Issue: Touch Events Not Working

**Check:** Is the element inside `<IonApp>`?  
Ionic hooks into touch events at the app level; custom elements outside may not work correctly.

## Performance Considerations

1. **Lazy-load modals** — Don't render all modals upfront; render on demand
   ```tsx
   const [showModal, setShowModal] = useState(false)
   {showModal && <IonModal>...</IonModal>}
   ```

2. **Memoize components** — Prevent unnecessary re-renders
   ```tsx
   export const MyButton = memo(function MyButton(props) { ... })
   ```

3. **Avoid layout thrashing** — Ionic uses CSS custom properties; avoid reading computed styles
4. **Virtual lists** — For long lists, use `virtual-scroll` or Ionic's `<IonVirtualScroll>`

## FAQ

### Q: Does Ionic replace the existing theme system?
**A:** No. Ionic CSS (`core.css`, etc.) provides base styles. Your existing theme system (`src/themes/`) overrides and customizes Ionic.

### Q: Can I use Ionic components in domain logic?
**A:** No. Domain logic must remain framework-agnostic. Ionic components are UI only.

### Q: Does Ionic work with the existing game logic?
**A:** Yes. Ionic is a UI layer. Your game logic (`src/domain/`) is unchanged.

### Q: How do I test Ionic components?
**A:** Use Vitest for unit tests (wrap with `<IonApp>`), Playwright for E2E (already configured with 15 device profiles).

### Q: Can I customize Ionic components?
**A:** Yes. Use CSS variables, CSS modules, or inline styles (all three work with Ionic).

### Q: Is Ionic required for the app to work?
**A:** Yes. Ionic is now the root UI framework. All UI components should eventually migrate to Ionic primitives.

## Resources

- [Ionic React Docs](https://ionicframework.com/docs/react)
- [Ionic Components API](https://ionicframework.com/docs/api)
- [Capacitor Docs](https://capacitorjs.com)
- [isPlatform() API](https://ionicframework.com/docs/angular/platform)
- [Ionic Theming](https://ionicframework.com/docs/theming/basics)

## Next Steps

1. **Gradual Migration** — Replace custom modals/alerts with Ionic equivalents as you modify them
2. **Platform-Specific UX** — Use `useIonicPlatform()` to optimize for mobile, tablet, desktop
3. **Test on Real Devices** — Run on iOS/Android via Capacitor; use Playwright for desktop/web
4. **Monitor Performance** — Profile the app on mobile devices to ensure smooth 60 fps interactions
