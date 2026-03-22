export interface GameStats {
  wins: number
  losses: number
  draws: number
  gamesPlayed: number
  totalScore: number
}

export interface GameState {
  isOver: boolean
  winner: string | null
  isDraw: boolean
}

export interface SoundContextType {
  isMuted: boolean
  toggleMute: () => void
  play: (soundName: 'move' | 'nav' | 'win' | 'loss' | 'draw') => void
}

export interface ThemeContextType {
  colorTheme: string
  mode: 'light' | 'dark' | 'system'
  colorblindMode: string
  setColorTheme: (theme: string) => void
  setMode: (mode: 'light' | 'dark' | 'system') => void
  setColorblindMode: (mode: string) => void
}
