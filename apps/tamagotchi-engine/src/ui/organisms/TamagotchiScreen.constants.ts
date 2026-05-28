import type { PetState, VARIANT_IDS } from '@/domain'

export type TamaVariantKey = (typeof VARIANT_IDS)[number]

export const ACTION_EMOJIS: Record<string, string> = {
  treat: '🍬',
  feedMeal: '🍱',
  feedSnack: '🍪',
  playGame: '🎮',
  gamePlay: '🎯',
  arcadePlay: '🕹️',
  discipline: '📏',
  praise: '🌟',
  medicine: '💊',
  cleanPoo: '🧼',
  reset: '🔄',
}

export const VARIANT_EMOJIS: ReadonlyArray<{ variantId: TamaVariantKey; emoji: string }> = [
  { variantId: 'original', emoji: '🥚' },
  { variantId: 'angel', emoji: '😇' },
  { variantId: 'ocean', emoji: '🌊' },
]

export const STAGE_BADGES: ReadonlyArray<{
  stage: PetState['stage']
  emoji: string
  label: string
}> = [
  { stage: 'egg', emoji: '🥚', label: 'Egg' },
  { stage: 'baby', emoji: '🍼', label: 'Baby' },
  { stage: 'child', emoji: '🧒', label: 'Child' },
  { stage: 'teen', emoji: '🧑', label: 'Teen' },
  { stage: 'adult', emoji: '🧑‍💼', label: 'Adult' },
  { stage: 'special', emoji: '✨', label: 'Special' },
  { stage: 'departed', emoji: '👻', label: 'Departed' },
]

export const MOOD_EMOJIS: ReadonlyArray<{ mood: PetState['mood']; emoji: string }> = [
  { mood: 'curious', emoji: '🤔' },
  { mood: 'content', emoji: '🙂' },
  { mood: 'playful', emoji: '😄' },
  { mood: 'delighted', emoji: '🤩' },
  { mood: 'calm', emoji: '😌' },
  { mood: 'sleeping', emoji: '💤' },
  { mood: 'hungry', emoji: '🍽️' },
  { mood: 'very-hungry', emoji: '😫' },
  { mood: 'needy', emoji: '🥺' },
  { mood: 'anxious', emoji: '😟' },
  { mood: 'exhausted', emoji: '🥱' },
  { mood: 'sick', emoji: '🤒' },
  { mood: 'departed', emoji: '🪽' },
]

export const CALLS_EMOJI = '📣'
export const CARE_EMOJI = '💖'
export const LIFE_EMOJI = '⌛'

export const AFTERLIFE_EMOJIS: Readonly<Record<'alive' | 'memorial' | 'tombstone', string>> = {
  alive: '💠',
  memorial: '✦',
  tombstone: '🪦',
}

export type EyePosition = {
  x: number
  y: number
}

export type FaceProfile = {
  leftEye: EyePosition
  rightEye: EyePosition
  leftEyeGlyph: string
  rightEyeGlyph: string
  mouth: string
}

export const FACE_PROFILES: Partial<
  Record<
    PetState['mood'] | 'sick' | 'departed' | 'tombstone' | 'very-hungry' | 'anxious',
    FaceProfile
  >
> = {
  curious: {
    leftEye: { x: -10, y: -4 },
    rightEye: { x: 10, y: -4 },
    leftEyeGlyph: '◔',
    rightEyeGlyph: '◔',
    mouth: '◡',
  },
  content: {
    leftEye: { x: -11, y: -1 },
    rightEye: { x: 11, y: -1 },
    leftEyeGlyph: '◕',
    rightEyeGlyph: '◕',
    mouth: '◡',
  },
  playful: {
    leftEye: { x: -12, y: -3 },
    rightEye: { x: 12, y: -3 },
    leftEyeGlyph: '◕',
    rightEyeGlyph: '◕',
    mouth: 'ᴗ',
  },
  delighted: {
    leftEye: { x: -12, y: -4 },
    rightEye: { x: 12, y: -4 },
    leftEyeGlyph: '◕',
    rightEyeGlyph: '◕',
    mouth: '✧',
  },
  calm: {
    leftEye: { x: -11, y: -1 },
    rightEye: { x: 11, y: -1 },
    leftEyeGlyph: '˘',
    rightEyeGlyph: '˘',
    mouth: '﹏',
  },
  sleeping: {
    leftEye: { x: -9, y: 2 },
    rightEye: { x: 9, y: 2 },
    leftEyeGlyph: '－',
    rightEyeGlyph: '－',
    mouth: 'zZ',
  },
  hungry: {
    leftEye: { x: -12, y: 3 },
    rightEye: { x: 12, y: 3 },
    leftEyeGlyph: '◕',
    rightEyeGlyph: '◕',
    mouth: '︿',
  },
  'very-hungry': {
    leftEye: { x: -13, y: 4 },
    rightEye: { x: 13, y: 4 },
    leftEyeGlyph: '◕',
    rightEyeGlyph: '◕',
    mouth: '﹏',
  },
  needy: {
    leftEye: { x: -11, y: 2 },
    rightEye: { x: 11, y: 2 },
    leftEyeGlyph: '◕',
    rightEyeGlyph: '◕',
    mouth: '︵',
  },
  anxious: {
    leftEye: { x: -10, y: 3 },
    rightEye: { x: 10, y: 3 },
    leftEyeGlyph: '⊙',
    rightEyeGlyph: '⊙',
    mouth: 'o',
  },
  exhausted: {
    leftEye: { x: -9, y: 5 },
    rightEye: { x: 9, y: 5 },
    leftEyeGlyph: 'ಠ',
    rightEyeGlyph: 'ಠ',
    mouth: '_',
  },
  sick: {
    leftEye: { x: -10, y: 1 },
    rightEye: { x: 10, y: 1 },
    leftEyeGlyph: '×',
    rightEyeGlyph: '×',
    mouth: '×',
  },
  departed: {
    leftEye: { x: -10, y: 0 },
    rightEye: { x: 10, y: 0 },
    leftEyeGlyph: '✦',
    rightEyeGlyph: '✦',
    mouth: '✦',
  },
  tombstone: {
    leftEye: { x: -10, y: 0 },
    rightEye: { x: 10, y: 0 },
    leftEyeGlyph: '▣',
    rightEyeGlyph: '▣',
    mouth: '▣',
  },
}
