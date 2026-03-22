import { vibrate } from '@/app'

export const haptics = {
  light: () => vibrate(10),
  medium: () => vibrate(20),
  heavy: () => vibrate([25, 15, 25]),
}
