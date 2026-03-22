import clsx from 'clsx'

/**
 * Utility for combining CSS module classnames
 * Wrapper around clsx for consistent API across components
 */
export function cx(
  ...args: Parameters<typeof clsx>
): string {
  return clsx(...args)
}

export default cx
