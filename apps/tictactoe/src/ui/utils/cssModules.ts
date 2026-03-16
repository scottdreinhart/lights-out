/**
 * cssModules.ts — CSS Utility for Component-Scoped Styling
 *
 * Provides the `cx` class name combiner utility used across all
 * CSS Module-based components.
 */

/**
 * Combine multiple class names (similar to clsx/classnames).
 * Useful with scoped styles and conditional classes.
 */
export const cx = (
  ...args: (string | Record<string, unknown> | null | undefined | false)[]
): string => {
  return args
    .flatMap((arg) => {
      if (typeof arg === 'string') {
        return arg
      }
      if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
        return Object.entries(arg)
          .filter(([, value]) => value)
          .map(([key]) => key)
      }
      return []
    })
    .filter(Boolean)
    .join(' ')
}
