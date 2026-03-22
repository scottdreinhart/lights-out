export type CxArg =
  | string
  | false
  | null
  | undefined
  | Record<string, unknown>
  | Array<string | false | null | undefined>

export const cx = (...args: CxArg[]): string => {
  return args
    .flatMap((arg) => {
      if (typeof arg === 'string') {
        return arg
      }

      if (Array.isArray(arg)) {
        return arg.filter((item): item is string => typeof item === 'string')
      }

      if (typeof arg === 'object' && arg !== null) {
        return Object.entries(arg)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key)
      }

      return []
    })
    .join(' ')
}

/**
 * Responsive breakpoints — shared across all game apps.
 * Synchronized with responsive.ts in @games/domain-shared.
 */
export const BREAKPOINTS = {
  sm: 375,
  md: 600,
  lg: 900,
  xl: 1200,
} as const
