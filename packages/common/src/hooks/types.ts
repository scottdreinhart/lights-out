export interface UseStatsConfig<T> {
  storageKey: string
  defaultStats: T
  load: (key: string) => string | null
  save: (key: string, value: string) => void
}

export interface UseGameBoardConfig<B> {
  createBoard: () => B
  storageKey?: string
  load?: (key: string) => string | null
  save?: (key: string, value: string) => void
}

// Sound effects types
export type SoundAction = () => void | Promise<void>
export type SoundActionMap<T extends string = string> = Record<T, SoundAction>

export interface UseSoundEffectsConfig<T extends string = string> {
  soundActions: SoundActionMap<T>
  storageKey?: string
  initialEnabled?: boolean
}

