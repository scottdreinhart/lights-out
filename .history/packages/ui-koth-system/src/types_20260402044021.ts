/**
 * Central type definitions for King of the Hill (KotH) ranking system
 * Used across all games for leaderboard display and score tracking
 */

export interface KothEntry {
  /**
   * Unique identifier (usually UUID or timestamp-based)
   */
  id: string

  /**
   * Player name / username
   */
  username: string

  /**
   * Final score for this session
   */
  score: number

  /**
   * Number of wins (optional, game-specific)
   */
  wins?: number

  /**
   * Timestamp when score was achieved (milliseconds)
   */
  timestamp: number

  /**
   * Rank in the current leaderboard
   */
  rank: number

  /**
   * Difficulty level played (if applicable: 'easy', 'medium', 'hard')
   */
  difficulty?: string

  /**
   * Game mode (if applicable: 'classic', 'sprint', 'survival', etc.)
   */
  gameMode?: string

  /**
   * Duration of game session in seconds (optional)
   */
  duration?: number

  /**
   * Whether this is the current player's entry
   */
  isCurrentPlayer?: boolean
}

export interface KothRankingScreenProps {
  /**
   * Title of the game (e.g., "TicTacToe", "Sudoku")
   */
  gameTitle: string

  /**
   * Current player's final score for this session
   */
  currentScore: number

  /**
   * All ranking entries to display
   */
  entries: KothEntry[]

  /**
   * Current player's rank (if in top entries)
   */
  playerRank?: number

  /**
   * Callback when returning to menu
   */
  onReturn: () => void

  /**
   * Optional callback to play again
   */
  onPlayAgain?: () => void

  /**
   * Number of top entries to display (default: 10)
   */
  showTop?: number

  /**
   * Player's username (optional, for highlighting)
   */
  playerName?: string

  /**
   * Custom color scheme
   */
  accentColor?: string
}

export interface KothPodiumProps {
  /**
   * First place entry
   */
  first?: KothEntry

  /**
   * Second place entry
   */
  second?: KothEntry

  /**
   * Third place entry
   */
  third?: KothEntry

  /**
   * Accent color for medals
   */
  accentColor?: string
}

export interface KothEntryRowProps {
  /**
   * The rank entry to display
   */
  entry: KothEntry

  /**
   * Whether this is the current player (highlight)
   */
  isCurrentPlayer?: boolean

  /**
   * Custom accent color
   */
  accentColor?: string
}

export interface UseKothDataConfig {
  /**
   * Game name (used for localStorage key)
   */
  gameName: string

  /**
   * Maximum entries to keep (older entries deleted automatically)
   */
  maxEntries?: number
}

export interface UseKothDataResult {
  /**
   * All KotH entries for this game
   */
  entries: KothEntry[]

  /**
   * Save a new entry and update rankings
   */
  addEntry: (entry: Omit<KothEntry, 'id' | 'rank'>) => void

  /**
   * Get sorted entries
   */
  getEntries: (limit?: number) => KothEntry[]

  /**
   * Find player's rank
   */
  getPlayerRank: (username: string) => number | undefined

  /**
   * Clear all entries (for testing)
   */
  clearEntries: () => void
}
