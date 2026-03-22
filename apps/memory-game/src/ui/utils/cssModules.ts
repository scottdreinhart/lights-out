import clsx from 'clsx'

export function cx(...args: Parameters<typeof clsx>): string {
  return clsx(...args)
}
