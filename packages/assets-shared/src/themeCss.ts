const sharedThemeLoaders = import.meta.glob('./themes/*.css', {
  query: '?inline',
  import: 'default',
}) as Record<string, () => Promise<string>>

const getSharedThemeLoader = (key: string): (() => Promise<string>) | undefined => {
  const slashIndex = key.lastIndexOf('/')
  const fileName = slashIndex === -1 ? key : key.slice(slashIndex + 1)

  if (!fileName.endsWith('.css')) {
    return undefined
  }

  return sharedThemeLoaders[`./themes/${fileName}`]
}

export const createSharedThemeLoaders = (): Record<string, () => Promise<string>> => {
  return new Proxy(
    {},
    {
      get: (_, prop) => {
        if (typeof prop !== 'string') {
          return undefined
        }

        return getSharedThemeLoader(prop)
      },
      has: (_, prop) => {
        if (typeof prop !== 'string') {
          return false
        }

        return getSharedThemeLoader(prop) !== undefined
      },
    },
  ) as Record<string, () => Promise<string>>
}
