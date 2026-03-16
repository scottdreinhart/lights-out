const canVibrate = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'

/** Subtle pulse for focus / navigation changes. */
export const tick = (): void => {
  if (canVibrate) {
    navigator.vibrate(10)
  }
}

/** Medium pulse for cell selection / button taps. */
export const tap = (): void => {
  if (canVibrate) {
    navigator.vibrate(15)
  }
}

/** Heavier pulse for emphasis or error feedback. */
export const heavy = (): void => {
  if (canVibrate) {
    navigator.vibrate(30)
  }
}
