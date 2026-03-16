# Bundle Analysis & Performance Profiling

This guide explains how to analyze the bundle size, identify large dependencies, and optimize code splitting.

## Quick Start

```bash
# Generate bundle analysis report
pnpm analyze:report

# View the interactive HTML report
open dist/bundle-report.html
```

## Understanding the Bundle Report

The bundle report (`dist/bundle-report.html`) is an **interactive treemap visualization** that shows:

### Metrics

- **Raw Size** — Actual size on disk (before compression)
- **Gzip Size** — Compressed size for HTTP transmission (gzip)
- **Brotli Size** — Compressed size for HTTP transmission (brotli)

### Reading the Visualization

1. **Treemap Size** — Larger boxes = larger contributions to bundle
2. **Color** — Visual distinction between dependencies
3. **Hierarchy** — Nested boxes show module relationships
4. **Hover Info** — Mouse over boxes to see exact size breakdown

## Optimization Workflow

### 1. Identify Large Modules

From the report, identify:
- Unexpectedly large dependencies
- Redundant or duplicate code
- Unused dependencies

### 2. Lazy-Load Components

Use React's `lazy()` and `Suspense` for non-critical routes:

```tsx
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

export function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### 3. Optimize Dependencies

Review large dependencies:
- Can it be removed?
- Is there a lighter alternative?
- Can it be loaded on-demand?

### 4. Manual Chunks

The `vite.config.js` defines **manual chunks** for optimal caching:

```javascript
output: {
  manualChunks(id) {
    // React vendor chunk
    if (id.includes('node_modules/react')) {
      return 'vendor-react'
    }
    // Capacitor vendor chunk
    if (id.includes('node_modules/@capacitor')) {
      return 'vendor-capacitor'
    }
  }
}
```

Add more chunks for large third-party libraries.

### 5. Measure Before & After

1. Generate baseline: `pnpm analyze:report`
2. Make optimization
3. Generate new report: `pnpm analyze:report`
4. Compare gzip/brotli sizes

## CI/CD Integration

Bundle analysis runs on each build. Check CI logs for:
- Chunk size warnings (default: 500KB)
- Asset size trends
- Gzip compression ratio

## Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Main bundle (gzip) | < 100KB | Track via reports |
| React vendor (gzip) | < 50KB | Fixed |
| Total app (gzip) | < 300KB | Monitor trends |

## Advanced Analysis

### Generate with Source Maps

Source maps enable precise module tracking:

```bash
# Build includes sourcemaps (see vite.config.js)
pnpm build

# Open report
open dist/bundle-report.html
```

### Compare Multiple Builds

Save reports for trending:

```bash
cp dist/bundle-report.html ./reports/baseline-$(date +%s).html
cp dist/bundle-report.json ./reports/baseline-$(date +%s).json
```

## Common Optimizations

### 1. Remove Unused Dependencies
```bash
pnpm list --depth=0
# Identify unused packages and remove
pnpm remove package-name
```

### 2. Lazy Load Theme Styles
```tsx
// Instead of importing all themes
import(`./${themeName}.css`)
```

### 3. Tree-Shake Unused Exports
Ensure exports are only included when used:
```typescript
// Bad: Re-exports everything
export * from './utils'

// Good: Export only what's needed
export { utilA, utilB } from './utils'
```

## Resources

- [Vite Bundle Analysis](https://vitejs.dev/guide/build.html#analyzing-the-bundle)
- [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer)
- [Web Vitals](https://web.dev/vitals/)
